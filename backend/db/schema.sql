CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  ssn TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  id_type TEXT NOT NULL,
  id_file_name TEXT,
  id_file_path TEXT,
  id_file_mime TEXT,
  id_file_size BIGINT,
  first_login_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_type TEXT NOT NULL CHECK (account_type IN ('current', 'savings')),
  account_number TEXT NOT NULL UNIQUE,
  routing_number TEXT NOT NULL,
  balance_cents BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_account_type TEXT CHECK (source_account_type IN ('current', 'savings')),
  beneficiary_name TEXT NOT NULL,
  routing_number TEXT NOT NULL,
  account_number TEXT NOT NULL,
  amount_cents BIGINT NOT NULL,
  reference TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
);

CREATE TABLE IF NOT EXISTS otp_challenges (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL CHECK (purpose IN ('login', 'payment')),
  otp_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS otp_challenges_user_purpose_idx
  ON otp_challenges(user_id, purpose, created_at DESC);
