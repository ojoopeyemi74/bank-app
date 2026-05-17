# TrustBank Local Full-Stack Setup

This project uses:

- React/Vite frontend in `src/bank-app`
- Node/Express API in `backend`
- PostgreSQL database through Docker Compose
- Local file storage for uploaded ID documents through a Docker volume

## Run with Docker for database/API

From the repository root:

```bash
docker compose up --build
```

The API will run on:

```text
http://localhost:4000
```

PostgreSQL will run on:

```text
localhost:5432
```

## Email OTP setup

Login and payment confirmation now use server-generated email OTPs. For local development, if SMTP is not configured, the API prints the OTP email to the API logs. To send real email, set these environment variables on the API service:

```text
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
MAIL_FROM=OceanicFirst <no-reply@example.com>
OTP_SECRET=replace-with-a-long-random-secret
```

Use a real email provider such as Amazon SES, SendGrid SMTP, Mailgun SMTP, Postmark SMTP, or Resend SMTP.

## Run the frontend

In a second terminal:

```bash
cd src/bank-app
npm run dev
```

Open:

```text
http://localhost:5173
```

## Data persistence

Docker volumes persist:

- `postgres_data`: database records
- `id_uploads`: uploaded ID files

Do not remove those Docker volumes unless you intentionally want to delete stored data.

## Security note

This is still a local prototype. It hashes passwords and stores data in PostgreSQL, but a real banking product needs stronger controls, audited infrastructure, encryption strategy, backups, monitoring, HTTPS, legal compliance, and secure identity verification.
