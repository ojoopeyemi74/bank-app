import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import { fileURLToPath } from "node:url";
import { pool, query } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = process.env.UPLOAD_DIR || path.resolve(__dirname, "../uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype?.startsWith("image/")) {
      callback(null, true);
      return;
    }

    callback(new Error("ID document must be an image file."));
  },
});

const app = express();
const port = process.env.PORT || 4000;
const configuredClientOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const STARTING_BALANCE_CENTS = 0;
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const OTP_SECRET = process.env.OTP_SECRET || process.env.DATABASE_URL || "local-development-otp-secret";
const mailFrom = process.env.MAIL_FROM || "OceanicFirst <no-reply@oceanicfirst.local>";
const adminFirstLoginOtpEmail = process.env.ADMIN_FIRST_LOGIN_OTP_EMAIL || process.env.SMTP_USER || "";
const smtpTransport = process.env.SMTP_HOST
  ? nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER || process.env.SMTP_PASS
      ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
      : undefined,
  })
  : null;
app.use(cors({
  origin(origin, callback) {
    if (
      !origin ||
      configuredClientOrigins.includes(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin) ||
      /^http:\/\/192\.168\.\d+\.\d+:\d+$/.test(origin) ||
      /^http:\/\/\d{1,3}(\.\d{1,3}){3}:\d+$/.test(origin)
    ) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS."));
  },
}));
app.use(express.json());

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(String(password), salt, 100000, 64, "sha512").toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(expectedHash, "hex"));
}

function generateDigits(length) {
  return Array.from({ length }, () => crypto.randomInt(0, 10)).join("");
}

function maskEmail(email) {
  const [localPart = "", domain = ""] = String(email || "").split("@");
  if (!localPart || !domain) {
    return "your registered email address";
  }

  const visibleLocal = localPart.slice(-3);
  return `***${visibleLocal}@${domain}`;
}

function hashOtp(challengeId, otp) {
  return crypto
    .createHmac("sha256", OTP_SECRET)
    .update(`${challengeId}:${otp}`)
    .digest("hex");
}

function secureCompare(left, right) {
  const leftBuffer = Buffer.from(String(left || ""), "hex");
  const rightBuffer = Buffer.from(String(right || ""), "hex");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

async function sendOtpEmail(user, otp, purpose = "login", recipientEmail = user.email) {
  const subject = purpose === "payment"
    ? "Your OceanicFirst payment verification code"
    : purpose === "first-login"
      ? "OceanicFirst first login verification code"
    : "Your OceanicFirst sign-in verification code";
  const action = purpose === "payment"
    ? "confirm your payment"
    : purpose === "first-login"
      ? `finish the first login for ${user.full_name || user.username}`
      : "finish signing in";
  const text = [
    `Your OceanicFirst verification code is ${otp}.`,
    `Use this code to ${action}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
    "If you did not request this code, secure your account immediately.",
  ].join("\n\n");

  if (!smtpTransport) {
    console.info(`[dev-email] OTP for ${recipientEmail}: ${otp}`);
    return;
  }

  await smtpTransport.sendMail({
    from: mailFrom,
    to: recipientEmail,
    subject,
    text,
  });
}

async function createOtpChallenge(user, purpose = "login", options = {}) {
  await query(
    `UPDATE otp_challenges
     SET consumed_at = NOW()
     WHERE user_id = $1 AND purpose = $2 AND consumed_at IS NULL`,
    [user.id, purpose]
  );

  const challengeId = crypto.randomUUID();
  const otp = generateDigits(OTP_LENGTH);
  const otpHash = hashOtp(challengeId, otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await query(
    `INSERT INTO otp_challenges (id, user_id, purpose, otp_hash, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [challengeId, user.id, purpose, otpHash, expiresAt]
  );

  const recipientEmail = options.recipientEmail || user.email;
  await sendOtpEmail(user, otp, options.emailPurpose || purpose, recipientEmail);

  return {
    challengeId,
    expiresAt,
    maskedEmail: maskEmail(recipientEmail),
  };
}

async function verifyOtpChallenge(user, purpose, challengeId, otp) {
  if (!/^\d{6}$/.test(String(otp || "")) || !challengeId) {
    return { ok: false, status: 400, error: "Enter the 6-digit code sent to your email." };
  }

  const challengeResult = await query(
    `SELECT *
     FROM otp_challenges
     WHERE id = $1 AND user_id = $2 AND purpose = $3
     LIMIT 1`,
    [challengeId, user.id, purpose]
  );
  const challenge = challengeResult.rows[0];

  if (!challenge || challenge.consumed_at) {
    return { ok: false, status: 401, error: "This verification code is no longer valid. Request a new code." };
  }

  if (new Date(challenge.expires_at).getTime() < Date.now()) {
    await query("UPDATE otp_challenges SET consumed_at = NOW() WHERE id = $1", [challenge.id]);
    return { ok: false, status: 401, error: "This verification code has expired. Request a new code." };
  }

  if (challenge.attempts >= OTP_MAX_ATTEMPTS) {
    await query("UPDATE otp_challenges SET consumed_at = NOW() WHERE id = $1", [challenge.id]);
    return { ok: false, status: 429, error: "Too many incorrect codes. Request a new code." };
  }

  const submittedHash = hashOtp(challenge.id, String(otp));

  if (!secureCompare(submittedHash, challenge.otp_hash)) {
    await query("UPDATE otp_challenges SET attempts = attempts + 1 WHERE id = $1", [challenge.id]);
    return { ok: false, status: 401, error: "The verification code is incorrect." };
  }

  await query(
    "UPDATE otp_challenges SET consumed_at = NOW(), attempts = attempts + 1 WHERE id = $1",
    [challenge.id]
  );

  return { ok: true };
}

function generateRoutingNumber() {
  return generateDigits(9);
}

function generateTransactionId() {
  return `TX-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${generateDigits(4)}`;
}

function serializePayment(payment) {
  return {
    id: payment.id,
    transactionId: payment.transaction_id,
    beneficiaryName: payment.beneficiary_name,
    sourceAccountType: payment.source_account_type,
    routingNumber: payment.routing_number,
    accountNumber: payment.account_number,
    amount: Number(payment.amount_cents) / 100,
    reference: payment.reference,
    status: payment.status,
    direction: "outgoing",
    createdAt: payment.created_at,
  };
}

function serializeAccountTransaction(transaction) {
  return {
    id: transaction.id,
    transactionId: transaction.transaction_id,
    sourceAccountType: transaction.account_type,
    beneficiaryName: transaction.description,
    routingNumber: null,
    accountNumber: null,
    amount: Number(transaction.amount_cents) / 100,
    reference: transaction.direction === "incoming" ? "Incoming" : "Outgoing",
    status: transaction.status,
    direction: transaction.direction,
    createdAt: transaction.created_at,
  };
}

function serializeUser(user, accounts = []) {
  return {
    id: user.id,
    fullName: user.full_name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    firstLoginCompleted: Boolean(user.first_login_completed),
    homeAddress: {
      street: user.street_address,
      city: user.city,
      state: user.state,
      zipCode: user.zip_code,
    },
    idVerification: {
      idType: user.id_type,
      fileName: user.id_file_name,
      fileType: user.id_file_mime,
      fileSize: user.id_file_size,
    },
    accounts: accounts.map((account) => ({
      id: account.account_type,
      type: account.account_type === "current" ? "Checking account" : "Savings account",
      accountNumber: account.account_number,
      routingNumber: account.routing_number,
      balance: account.balance_cents / 100,
    })),
  };
}

async function createAccountRows(client, userId) {
  const accountTypes = ["current", "savings"];

  for (const accountType of accountTypes) {
    await client.query(
      `INSERT INTO accounts (user_id, account_type, account_number, routing_number, balance_cents)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, accountType, generateDigits(10), generateRoutingNumber(), STARTING_BALANCE_CENTS]
    );
  }
}

async function ensureSchema() {
  await query("ALTER TABLE users ALTER COLUMN id_file_size TYPE BIGINT");
  await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT");
  await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT");
  await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS first_login_completed BOOLEAN NOT NULL DEFAULT FALSE");
  await query("ALTER TABLE accounts ALTER COLUMN balance_cents TYPE BIGINT");
  await query("ALTER TABLE accounts ALTER COLUMN balance_cents SET DEFAULT 0");
  await query("ALTER TABLE payments ADD COLUMN IF NOT EXISTS transaction_id TEXT");
  await query("ALTER TABLE payments ADD COLUMN IF NOT EXISTS source_account_type TEXT");
  await query("UPDATE payments SET transaction_id = UPPER(transaction_id) WHERE transaction_id IS NOT NULL");
  await query("UPDATE payments SET transaction_id = 'TX-' || UPPER(SUBSTRING(REPLACE(id::TEXT, '-', ''), 1, 8)) || '-' || UPPER(SUBSTRING(REPLACE(id::TEXT, '-', ''), 9, 4)) WHERE transaction_id IS NULL");
  await query("ALTER TABLE payments ALTER COLUMN transaction_id SET NOT NULL");
  await query("CREATE UNIQUE INDEX IF NOT EXISTS payments_transaction_id_idx ON payments(transaction_id)");
  await query("ALTER TABLE payments ALTER COLUMN amount_cents TYPE BIGINT");
  await query(`
    CREATE TABLE IF NOT EXISTS account_transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      transaction_id TEXT NOT NULL UNIQUE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      account_type TEXT NOT NULL CHECK (account_type IN ('current', 'savings')),
      direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
      description TEXT NOT NULL,
      amount_cents BIGINT NOT NULL,
      status TEXT NOT NULL DEFAULT 'successful',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS otp_challenges (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      purpose TEXT NOT NULL CHECK (purpose IN ('login', 'payment')),
      otp_hash TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      expires_at TIMESTAMPTZ NOT NULL,
      consumed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await query("CREATE INDEX IF NOT EXISTS otp_challenges_user_purpose_idx ON otp_challenges(user_id, purpose, created_at DESC)");
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/register", upload.single("idDocument"), async (req, res) => {
  const {
    fullName,
    username,
    password,
    email,
    phone,
    ssn,
    street,
    city,
    state,
    zipCode,
    idType,
  } = req.body;

  const cleanedUsername = normalizeUsername(username);

  if (!fullName?.trim() || !cleanedUsername || !password || !email?.trim() || !phone?.trim() || !ssn?.trim()) {
    return res.status(400).json({ error: "Missing required identity or login fields." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }

  if (!street?.trim() || !city?.trim() || !state?.trim() || !zipCode?.trim()) {
    return res.status(400).json({ error: "Missing required home address fields." });
  }

  if (!req.file) {
    return res.status(400).json({ error: "Upload a driver's license or passport document." });
  }

  const { salt, hash } = hashPassword(password);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `INSERT INTO users (
        full_name, username, password_salt, password_hash, email, phone, ssn,
        street_address, city, state, zip_code,
        id_type, id_file_name, id_file_path, id_file_mime, id_file_size
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        fullName.trim(),
        cleanedUsername,
        salt,
        hash,
        email.trim().toLowerCase(),
        phone.trim(),
        ssn.trim(),
        street.trim(),
        city.trim(),
        state.trim().toUpperCase(),
        zipCode.trim(),
        idType || "Driver's license",
        req.file.originalname,
        req.file.path,
        req.file.mimetype,
        req.file.size,
      ]
    );

    await createAccountRows(client, userResult.rows[0].id);

    const accountsResult = await client.query(
      "SELECT * FROM accounts WHERE user_id = $1 ORDER BY account_type",
      [userResult.rows[0].id]
    );

    await client.query("COMMIT");
    return res.status(201).json({ user: serializeUser(userResult.rows[0], accountsResult.rows) });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      return res.status(409).json({ error: "That username is already registered." });
    }
    console.error(error);
    return res.status(500).json({ error: "Could not create account." });
  } finally {
    client.release();
  }
});

app.post("/api/login", async (req, res) => {
  const username = normalizeUsername(req.body.username);
  const password = req.body.password;

  const userResult = await query("SELECT * FROM users WHERE username = $1", [username]);
  const user = userResult.rows[0];

  if (!user || !verifyPassword(password, user.password_salt, user.password_hash)) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  try {
    const isFirstLogin = !user.first_login_completed;
    if (isFirstLogin && !adminFirstLoginOtpEmail) {
      return res.status(500).json({ error: "First-time login activation is not configured." });
    }

    const challenge = await createOtpChallenge(user, "login", isFirstLogin
      ? {
        recipientEmail: adminFirstLoginOtpEmail,
        emailPurpose: "first-login",
      }
      : {});
    return res.json({
      otpRequired: true,
      firstLogin: isFirstLogin,
      ...challenge,
      maskedEmail: isFirstLogin ? null : challenge.maskedEmail,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ error: error.message || "Could not send verification code." });
  }
});

app.post("/api/login/verify-otp", async (req, res) => {
  const username = normalizeUsername(req.body.username);
  const { challengeId, otp } = req.body;

  const userResult = await query("SELECT * FROM users WHERE username = $1", [username]);
  const user = userResult.rows[0];

  if (!user) {
    return res.status(401).json({ error: "Invalid verification request." });
  }

  const otpResult = await verifyOtpChallenge(user, "login", challengeId, otp);
  if (!otpResult.ok) {
    return res.status(otpResult.status).json({ error: otpResult.error });
  }

  if (!user.first_login_completed) {
    await query("UPDATE users SET first_login_completed = TRUE WHERE id = $1", [user.id]);
    user.first_login_completed = true;
  }

  const accountsResult = await query(
    "SELECT * FROM accounts WHERE user_id = $1 ORDER BY account_type",
    [user.id]
  );

  return res.json({ user: serializeUser(user, accountsResult.rows) });
});

app.post("/api/payments/otp", async (req, res) => {
  const username = normalizeUsername(req.body.username);

  const userResult = await query("SELECT * FROM users WHERE username = $1", [username]);
  const user = userResult.rows[0];

  if (!user) {
    return res.status(401).json({ error: "User not found." });
  }

  try {
    const challenge = await createOtpChallenge(user, "payment");
    return res.json(challenge);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ error: error.message || "Could not send verification code." });
  }
});

app.post("/api/payments", async (req, res) => {
  const { username, fromAccountId, beneficiaryName, routingNumber, accountNumber, amount, reference, otpChallengeId, otp } = req.body;
  const normalizedUsername = normalizeUsername(username);
  const sourceAccountType = fromAccountId === "current" ? "current" : "savings";
  const amountCents = Math.round(Number(amount) * 100);
  const transactionId = generateTransactionId();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query("SELECT * FROM users WHERE username = $1", [normalizedUsername]);
    const user = userResult.rows[0];

    if (!user) {
      await client.query("ROLLBACK");
      return res.status(401).json({ error: "User not found." });
    }

    if (!beneficiaryName || !routingNumber || !accountNumber || !Number.isSafeInteger(amountCents) || amountCents <= 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Enter valid payment details." });
    }

    const accountResult = await client.query(
      `SELECT * FROM accounts
       WHERE user_id = $1 AND account_type = $2
       FOR UPDATE`,
      [user.id, sourceAccountType]
    );
    const sourceAccount = accountResult.rows[0];

    if (!sourceAccount) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Source account not found." });
    }

    const otpResult = await verifyOtpChallenge(user, "payment", otpChallengeId, otp);
    if (!otpResult.ok) {
      await client.query("ROLLBACK");
      return res.status(otpResult.status).json({ error: otpResult.error });
    }

    if (Number(sourceAccount.balance_cents) < amountCents) {
      const failedResult = await client.query(
        `INSERT INTO payments (transaction_id, user_id, source_account_type, beneficiary_name, routing_number, account_number, amount_cents, reference, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'failed')
         RETURNING *`,
        [transactionId, user.id, sourceAccountType, beneficiaryName, routingNumber, accountNumber, amountCents, reference || null]
      );
      const accountsResult = await client.query(
        "SELECT * FROM accounts WHERE user_id = $1 ORDER BY account_type",
        [user.id]
      );
      await client.query("COMMIT");
      return res.status(400).json({
        error: "Insufficient funds.",
        payment: serializePayment(failedResult.rows[0]),
        user: serializeUser(user, accountsResult.rows),
      });
    }

    await client.query(
      "UPDATE accounts SET balance_cents = balance_cents - $1 WHERE id = $2",
      [amountCents, sourceAccount.id]
    );

    const result = await client.query(
      `INSERT INTO payments (transaction_id, user_id, source_account_type, beneficiary_name, routing_number, account_number, amount_cents, reference, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'successful')
       RETURNING *`,
      [transactionId, user.id, sourceAccountType, beneficiaryName, routingNumber, accountNumber, amountCents, reference || null]
    );

    const accountsResult = await client.query(
      "SELECT * FROM accounts WHERE user_id = $1 ORDER BY account_type",
      [user.id]
    );

    await client.query("COMMIT");
    return res.status(201).json({
      payment: serializePayment(result.rows[0]),
      user: serializeUser(user, accountsResult.rows),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    if (normalizedUsername) {
      const userResult = await query("SELECT id FROM users WHERE username = $1", [normalizedUsername]);
      const user = userResult.rows[0];

      if (user && beneficiaryName && routingNumber && accountNumber && Number.isSafeInteger(amountCents) && amountCents > 0) {
        await query(
          `INSERT INTO payments (transaction_id, user_id, source_account_type, beneficiary_name, routing_number, account_number, amount_cents, reference, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'failed')`,
          [transactionId, user.id, sourceAccountType, beneficiaryName, routingNumber, accountNumber, amountCents, reference || null]
        );
      }
    }
    return res.status(500).json({ error: "Could not save payment." });
  } finally {
    client.release();
  }
});

app.get("/api/payments", async (req, res) => {
  const username = normalizeUsername(req.query.username);

  if (!username) {
    return res.status(400).json({ error: "Missing username." });
  }

  const paymentResult = await query(
    `SELECT p.id, p.transaction_id, p.source_account_type, p.beneficiary_name, p.routing_number, p.account_number, p.amount_cents, p.reference, p.status, p.created_at
     FROM payments p
     JOIN users u ON u.id = p.user_id
     WHERE u.username = $1
     ORDER BY p.created_at DESC`,
    [username]
  );

  const accountTransactionResult = await query(
    `SELECT at.id, at.transaction_id, at.account_type, at.direction, at.description, at.amount_cents, at.status, at.created_at
     FROM account_transactions at
     JOIN users u ON u.id = at.user_id
     WHERE u.username = $1
     ORDER BY at.created_at DESC`,
    [username]
  );

  const payments = [
    ...paymentResult.rows.map(serializePayment),
    ...accountTransactionResult.rows.map(serializeAccountTransaction),
  ].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

  return res.json({
    payments,
  });
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "ID image must be 10MB or smaller."
      : "Could not upload ID image.";
    return res.status(400).json({ error: message });
  }

  if (error.message === "ID document must be an image file.") {
    return res.status(400).json({ error: error.message });
  }

  return next(error);
});

ensureSchema()
  .then(() => {
    app.listen(port, () => {
      console.log(`OceanicFirst API listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Could not prepare database schema.", error);
    process.exit(1);
  });
