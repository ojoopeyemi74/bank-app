import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Home,
  UserPlus,
  Landmark,
  CreditCard,
  Send,
  Bell,
  HelpCircle,
  Settings,
  Search,
  Lock,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Menu,
  ChevronRight,
  Eye,
  Smartphone,
  Receipt,
  User,
  Building2,
  BadgeCheck,
  KeyRound,
  ClipboardList,
  Activity,
  MessageCircle,
  Gauge,
  Database,
  Globe,
  WalletCards,
  BarChart3,
} from "lucide-react";

const sections = [
  {
    id: "public",
    label: "Public Website",
    icon: Globe,
    pages: [
      "Home",
      "Features",
      "Security",
      "Fees",
      "Help Centre",
    ],
  },
  {
    id: "onboarding",
    label: "Registration",
    icon: UserPlus,
    pages: [
      "Open Account",
      "Personal Details",
      "Contact Details",
      "Email Verification",
      "Phone Verification",
      "Create Password",
      "Terms & Consent",
    ],
  },
  {
    id: "kyc",
    label: "KYC Verification",
    icon: BadgeCheck,
    pages: [
      "Identity Intro",
      "Select ID Document",
      "Upload ID Document",
      "Selfie Check",
      "KYC Processing",
      "KYC Approved",
      "KYC Pending",
      "KYC Failed",
    ],
  },
  {
    id: "auth",
    label: "Login & Access",
    icon: Lock,
    pages: [
      "Login",
      "MFA Verification",
      "Biometric Setup",
      "Forgot Password",
      "Password Reset",
    ],
  },
  {
    id: "banking",
    label: "Customer Banking",
    icon: Landmark,
    pages: [
      "Dashboard",
      "Accounts Overview",
      "Account Details",
      "Transaction List",
      "Transaction Details",
      "Send Money",
      "Select Beneficiary",
      "Add Beneficiary",
      "Enter Amount",
      "Review Transfer",
      "Confirm Transfer",
      "Transfer Success",
      "Transfer Failed",
      "Beneficiaries",
      "Beneficiary Details",
    ],
  },
  {
    id: "cards",
    label: "Cards",
    icon: CreditCard,
    pages: [
      "Cards Overview",
      "Card Details",
      "Freeze Card",
      "Report Card Issue",
    ],
  },
  {
    id: "support",
    label: "Documents & Support",
    icon: HelpCircle,
    pages: [
      "Statements",
      "Notifications",
      "Support Centre",
      "Support Ticket",
      "Profile",
      "Security Settings",
    ],
  },
  {
    id: "admin",
    label: "Admin Portal",
    icon: Gauge,
    pages: [
      "Admin Dashboard",
      "Customer Search",
      "KYC Review Queue",
      "Transaction Monitoring",
      "Fraud Alerts",
      "Support Tickets Admin",
      "Audit Logs",
      "Reports",
    ],
  },
];

const pageContent = {
  Home: {
    title: "Banking that keeps you in control",
    subtitle: "Open an account, manage your money, send payments, and track everything securely from your phone or browser.",
    icon: Home,
    cta: "Open an account",
    secondary: "Sign in",
    blocks: [
      ["Fast account opening", "Start your application online with guided identity verification."],
      ["Real-time money view", "See balances, pending payments, recent activity, and alerts in one place."],
      ["Security by default", "Multi-factor sign-in, payment confirmation, device checks, and fraud alerts are built in."],
    ],
  },
  Features: {
    title: "Everything you need for everyday banking",
    subtitle: "A complete digital banking experience for web and mobile customers.",
    icon: WalletCards,
    blocks: [
      ["Accounts", "View current, savings, and joint accounts with available and pending balances."],
      ["Payments", "Send money, manage beneficiaries, schedule transfers, and download receipts."],
      ["Cards", "Freeze cards, report issues, manage limits, and approve sensitive card actions."],
      ["Support", "Raise tickets, chat with support, report fraud, and track requests."],
    ],
  },
  Security: {
    title: "Security designed around you",
    subtitle: "Protect every login, device, payment, document, and admin action.",
    icon: ShieldCheck,
    blocks: [
      ["Secure login", "Password, MFA, biometric access, trusted devices, and session timeout."],
      ["Payment protection", "MFA for new beneficiary payments, clear review screens, and payment limits."],
      ["Fraud monitoring", "Unusual location, high-value transfer, new device, and velocity checks."],
      ["Data protection", "Encryption, masking, audit logs, RBAC, and privacy-first design."],
    ],
  },
  Fees: {
    title: "Clear and simple fees",
    subtitle: "No hidden language. Customers see what applies before they confirm an action.",
    icon: Receipt,
    blocks: [
      ["Account fee", "£0 monthly fee for the standard account."],
      ["Local transfers", "Free standard local transfers. Faster payment charges can be shown before confirmation."],
      ["International transfers", "FX margin and transfer fees are displayed before payment approval."],
      ["Card replacement", "Replacement fee shown before ordering a new physical card."],
    ],
  },
  "Help Centre": {
    title: "How can we help?",
    subtitle: "Search help topics or choose a support category.",
    icon: HelpCircle,
    search: true,
    blocks: [
      ["Getting started", "Open an account, verify your identity, and set up login security."],
      ["Transfers", "Payment timings, failed payments, limits, beneficiaries, and receipts."],
      ["Cards", "Freeze, replace, report lost or stolen cards, and manage limits."],
      ["Security", "Suspicious activity, account protection, trusted devices, and MFA."],
    ],
  },
  "Open Account": {
    title: "Open your account in minutes",
    subtitle: "We’ll ask for a few details and verify your identity to keep your account safe.",
    icon: UserPlus,
    cta: "Start application",
    blocks: [["Application checklist", "Personal details, contact verification, identity check, security setup, and consent."], ["What you need", "A valid ID document, mobile number, email address, and residential address."]],
  },
  "Personal Details": {
    title: "Personal details",
    subtitle: "Enter your details exactly as they appear on your identity document.",
    icon: User,
    form: ["First name", "Middle name", "Last name", "Date of birth", "Nationality", "Country of residence"],
  },
  "Contact Details": {
    title: "Contact details",
    subtitle: "We use these details for verification, alerts, and important account messages.",
    icon: Smartphone,
    form: ["Email address", "Mobile number", "Residential address", "Postcode", "City", "Country"],
  },
  "Email Verification": {
    title: "Verify your email",
    subtitle: "Enter the 6-digit code sent to your email address.",
    icon: Bell,
    form: ["Verification code"],
    cta: "Verify email",
    secondary: "Resend code",
  },
  "Phone Verification": {
    title: "Verify your mobile number",
    subtitle: "Enter the 6-digit code sent by SMS.",
    icon: Smartphone,
    form: ["SMS code"],
    cta: "Verify phone",
    secondary: "Resend code",
  },
  "Create Password": {
    title: "Create a secure password",
    subtitle: "Use a strong password that you do not use on other websites.",
    icon: KeyRound,
    form: ["Password", "Confirm password"],
    blocks: [["Password rules", "At least 12 characters, uppercase, lowercase, number, and symbol."], ["Security tip", "Never share your password or verification codes with anyone, including support staff."]],
  },
  "Terms & Consent": {
    title: "Review and accept",
    subtitle: "Please confirm you understand the terms before continuing.",
    icon: FileText,
    checklist: ["I agree to the Terms and Conditions", "I agree to the Privacy Policy", "I consent to identity verification checks", "I confirm the information provided is accurate"],
  },
  "Identity Intro": {
    title: "Let’s verify your identity",
    subtitle: "To protect your account, we need to check your identity using a valid document and a selfie.",
    icon: BadgeCheck,
    blocks: [["Accepted documents", "Passport, driving licence, national identity card, or residence permit."], ["Before you start", "Use good lighting and make sure your document is clear and valid."]],
  },
  "Select ID Document": {
    title: "Choose your document type",
    subtitle: "Select the document you want to use for verification.",
    icon: ClipboardList,
    options: ["Passport", "Driving licence", "National ID card", "Residence permit"],
  },
  "Upload ID Document": {
    title: "Upload your ID",
    subtitle: "Make sure the document is clear, valid, and fully visible.",
    icon: FileText,
    blocks: [["Photo guidance", "Avoid glare, show all corners, and ensure the text is readable."], ["Upload options", "Take a photo using your camera or upload an existing file."], ["Privacy", "Your document is encrypted and used only for verification and compliance checks."]],
  },
  "Selfie Check": {
    title: "Take a quick selfie",
    subtitle: "This helps confirm that the ID belongs to you.",
    icon: Eye,
    blocks: [["Liveness check", "Face the camera, keep good lighting, and remove sunglasses or face coverings."], ["Why we ask", "This protects your account from identity fraud and unauthorised applications."]],
  },
  "KYC Processing": {
    title: "We’re checking your details",
    subtitle: "This usually takes a few moments. We’ll notify you when your account is ready.",
    icon: Activity,
    checklist: ["Checking document", "Matching selfie", "Running compliance checks", "Finalising account"],
  },
  "KYC Approved": {
    title: "Your account is ready",
    subtitle: "Your identity has been verified and your account has been created.",
    icon: CheckCircle2,
    cta: "Go to dashboard",
  },
  "KYC Pending": {
    title: "We need a little more time",
    subtitle: "Your application is being reviewed by our team. We’ll notify you once the review is complete.",
    icon: AlertTriangle,
    blocks: [["Current status", "Manual review in progress."], ["What happens next", "You may be asked to provide an extra document or confirm details."]],
  },
  "KYC Failed": {
    title: "We couldn’t verify your identity",
    subtitle: "Please check that your document is valid, clear, and matches the details you entered.",
    icon: XCircle,
    cta: "Try again",
    secondary: "Contact support",
  },
  Login: {
    title: "Welcome back",
    subtitle: "Sign in securely to access your account.",
    icon: Lock,
    form: ["Email or customer ID", "Password"],
    cta: "Sign in",
    secondary: "Forgot password?",
    blocks: [["Security note", "Never share your password or verification code with anyone." ]],
  },
  "MFA Verification": {
    title: "Confirm it’s you",
    subtitle: "Enter the code sent to your registered device or approve the login using your authenticator app.",
    icon: ShieldCheck,
    form: ["6-digit code"],
    options: ["SMS code", "Email code", "Authenticator app", "Push approval"],
  },
  "Biometric Setup": {
    title: "Enable faster sign-in",
    subtitle: "Use Face ID, Touch ID, or fingerprint login to access your account quickly and securely.",
    icon: Smartphone,
    cta: "Enable biometrics",
    secondary: "Skip for now",
  },
  "Forgot Password": {
    title: "Reset your password",
    subtitle: "Enter your email address or customer ID and we’ll send reset instructions.",
    icon: KeyRound,
    form: ["Email address or customer ID"],
    cta: "Send reset link",
  },
  "Password Reset": {
    title: "Create a new password",
    subtitle: "Choose a secure password that you have not used before.",
    icon: KeyRound,
    form: ["New password", "Confirm new password"],
    cta: "Update password",
  },
  Dashboard: {
    title: "Good morning, Opeyemi",
    subtitle: "Here’s your money at a glance.",
    icon: BarChart3,
    dashboard: true,
    blocks: [["Available balance", "£4,250.80"], ["Pending payments", "£120.00"], ["Recent activity", "Salary received, grocery payment, card subscription."], ["Security alert", "No unusual activity detected." ]],
  },
  "Accounts Overview": {
    title: "Your accounts",
    subtitle: "View balances and account status across all accounts.",
    icon: Landmark,
    blocks: [["Current Account", "Available balance: £4,250.80. Pending: £120.00."], ["Savings Account", "Available balance: £8,900.00. Interest rate: 3.25% AER."], ["Joint Account", "Available balance: £1,410.45. Shared access enabled." ]],
  },
  "Account Details": {
    title: "Current account",
    subtitle: "Account details, balances, identifiers, and actions.",
    icon: Building2,
    blocks: [["Available balance", "£4,250.80"], ["Account details", "Sort code: 12-34-56. Account number: ****4321. IBAN: GB** **** **** 4321."], ["Actions", "Copy details, share details, view transactions, download statement." ]],
  },
  "Transaction List": {
    title: "Transactions",
    subtitle: "Search, filter, and review account activity.",
    icon: Receipt,
    search: true,
    transactions: true,
  },
  "Transaction Details": {
    title: "Transaction details",
    subtitle: "Full transaction record and available actions.",
    icon: Receipt,
    blocks: [["Amount", "-£46.20"], ["Merchant", "Green Market"], ["Date and time", "13 May 2026, 09:41"], ["Reference", "Card purchase"], ["Status", "Completed"], ["Actions", "Report issue, download receipt, add note." ]],
  },
  "Send Money": {
    title: "Send money",
    subtitle: "Choose how you want to make a payment.",
    icon: Send,
    options: ["Send to existing beneficiary", "Add new beneficiary", "Transfer between my accounts", "International transfer"],
  },
  "Select Beneficiary": {
    title: "Who are you sending money to?",
    subtitle: "Choose a saved beneficiary or add someone new.",
    icon: Users,
    search: true,
    blocks: [["Mum", "Barclays • ****2210"], ["BT Savings", "Internal transfer • ****9341"], ["Household Bills", "NatWest • ****7820" ]],
  },
  "Add Beneficiary": {
    title: "Add a new beneficiary",
    subtitle: "Check details carefully. Payments to the wrong account may be hard to recover.",
    icon: Users,
    form: ["Beneficiary name", "Account number / IBAN", "Sort code / routing number", "Bank name", "Reference nickname"],
  },
  "Enter Amount": {
    title: "How much would you like to send?",
    subtitle: "Available balance: £4,250.80",
    icon: Send,
    form: ["Amount", "Payment reference", "Payment date"],
    checklist: ["Repeat payment", "Save as template", "Notify me when complete"],
  },
  "Review Transfer": {
    title: "Review payment",
    subtitle: "Confirm the details before sending money.",
    icon: ClipboardList,
    blocks: [["From", "Current Account • ****4321"], ["To", "Mum • Barclays • ****2210"], ["Amount", "£250.00"], ["Fee", "£0.00"], ["Estimated arrival", "Usually within minutes." ]],
    cta: "Confirm payment",
    secondary: "Edit details",
  },
  "Confirm Transfer": {
    title: "Confirm this payment",
    subtitle: "For your security, confirm this payment using MFA.",
    icon: ShieldCheck,
    form: ["Authenticator code"],
    cta: "Approve payment",
  },
  "Transfer Success": {
    title: "Payment sent",
    subtitle: "Your payment to Mum for £250.00 has been sent.",
    icon: CheckCircle2,
    cta: "View receipt",
    secondary: "Make another payment",
  },
  "Transfer Failed": {
    title: "Payment could not be completed",
    subtitle: "No money has left your account. Try again or contact support if this continues.",
    icon: XCircle,
    cta: "Try again",
    secondary: "Contact support",
  },
  Beneficiaries: {
    title: "Beneficiaries",
    subtitle: "Manage saved people and businesses.",
    icon: Users,
    search: true,
    blocks: [["Mum", "Last paid: 12 May 2026"], ["Household Bills", "Last paid: 1 May 2026"], ["Savings Account", "Internal transfer recipient" ]],
  },
  "Beneficiary Details": {
    title: "Beneficiary details",
    subtitle: "Review saved recipient information and recent payments.",
    icon: User,
    blocks: [["Name", "Mum"], ["Bank", "Barclays"], ["Account", "****2210"], ["Date added", "10 January 2026"], ["Actions", "Send money, edit, delete." ]],
  },
  "Cards Overview": {
    title: "Your cards",
    subtitle: "Manage card status, limits, replacements, and security.",
    icon: CreditCard,
    blocks: [["Debit Card", "Visa • ****8842 • Active"], ["Virtual Card", "Visa • ****1190 • Active"], ["Card controls", "Freeze, view PIN after MFA, replace, report lost or stolen." ]],
  },
  "Card Details": {
    title: "Card details",
    subtitle: "Sensitive details require MFA before reveal.",
    icon: CreditCard,
    blocks: [["Cardholder", "Opeyemi Ojo"], ["Card number", "**** **** **** 8842"], ["Expiry", "08/29"], ["Status", "Active"], ["Linked account", "Current Account • ****4321" ]],
  },
  "Freeze Card": {
    title: "Freeze this card?",
    subtitle: "Freezing your card blocks new card payments, ATM withdrawals, and online purchases. You can unfreeze it anytime.",
    icon: AlertTriangle,
    cta: "Freeze card",
    secondary: "Cancel",
  },
  "Report Card Issue": {
    title: "Report card issue",
    subtitle: "Tell us what happened so we can protect your account.",
    icon: CreditCard,
    options: ["Lost card", "Stolen card", "Damaged card", "Unrecognised transaction"],
    blocks: [["Next step", "We can block the card permanently, order a replacement, and help review suspicious transactions." ]],
  },
  Statements: {
    title: "Statements and documents",
    subtitle: "Download or email official account documents.",
    icon: FileText,
    form: ["Account", "Month", "Year", "Document type"],
    blocks: [["April 2026 statement", "Current Account • PDF available"], ["March 2026 statement", "Current Account • PDF available" ]],
  },
  Notifications: {
    title: "Notifications",
    subtitle: "Review account, payment, security, and support messages.",
    icon: Bell,
    blocks: [["Payment sent", "£250.00 sent to Mum."], ["Login approved", "New web login confirmed."], ["Statement ready", "Your April 2026 statement is available." ]],
  },
  "Support Centre": {
    title: "How can we help?",
    subtitle: "Contact support, report fraud, or raise a ticket.",
    icon: MessageCircle,
    options: ["Chat with support", "Raise a ticket", "Report fraud", "Report card issue", "View FAQs", "Call us"],
  },
  "Support Ticket": {
    title: "Support request",
    subtitle: "Track messages, status, and attachments for your case.",
    icon: HelpCircle,
    blocks: [["Ticket reference", "SUP-2026-04192"], ["Status", "In progress"], ["Created", "13 May 2026"], ["Latest update", "We are reviewing your card payment query." ]],
  },
  Profile: {
    title: "Profile",
    subtitle: "Manage personal, contact, address, employment, and tax residency details.",
    icon: User,
    blocks: [["Personal details", "Opeyemi Ojo • Date of birth hidden"], ["Contact details", "ojo.opeyemi7474@yahoo.com • Mobile verified"], ["Address", "Residential address verified"], ["Tax residency", "United Kingdom" ]],
  },
  "Security Settings": {
    title: "Security settings",
    subtitle: "Control how your account is protected.",
    icon: Settings,
    blocks: [["Password", "Last changed 42 days ago."], ["MFA", "Authenticator app enabled."], ["Trusted devices", "2 active devices."], ["Login history", "View recent sign-ins and remove suspicious sessions." ]],
  },
  "Admin Dashboard": {
    title: "Admin dashboard",
    subtitle: "Operational overview for applications, payments, risk, support, and system health.",
    icon: Gauge,
    admin: true,
    blocks: [["New applications", "128 today"], ["KYC pending", "34 awaiting review"], ["Fraud alerts", "7 high priority"], ["Open support tickets", "219 active" ]],
  },
  "Customer Search": {
    title: "Customer search",
    subtitle: "Find customers by name, email, phone, customer ID, or account number.",
    icon: Search,
    search: true,
    blocks: [["Customer profile", "KYC status, risk level, account status, login activity, transactions, and support history." ]],
  },
  "KYC Review Queue": {
    title: "KYC review queue",
    subtitle: "Review pending applications and identity verification exceptions.",
    icon: BadgeCheck,
    blocks: [["Pending review", "18 applications require manual checks."], ["Actions", "Approve, reject, request more documents, or escalate."], ["Risk signals", "Document mismatch, selfie mismatch, duplicate profile, sanctions match." ]],
  },
  "Transaction Monitoring": {
    title: "Transaction monitoring",
    subtitle: "Review high-risk payments, unusual behaviour, and compliance alerts.",
    icon: Activity,
    blocks: [["High-value transfers", "12 payments above configured threshold."], ["New beneficiary payments", "22 payments within cooling-off period."], ["Actions", "Hold, release, escalate, or mark as reviewed." ]],
  },
  "Fraud Alerts": {
    title: "Fraud alerts",
    subtitle: "Prioritise suspicious activity using risk scores and rule triggers.",
    icon: AlertTriangle,
    blocks: [["Unusual login location", "Customer logged in from a new country."], ["Velocity alert", "Multiple failed login attempts followed by password reset."], ["Payment risk", "New device plus high-value transfer attempt." ]],
  },
  "Support Tickets Admin": {
    title: "Support tickets",
    subtitle: "Assign, respond, escalate, and close customer requests.",
    icon: MessageCircle,
    blocks: [["Queue", "Card issues, payment disputes, login problems, fraud reports."], ["Agent actions", "Reply to customer, add internal note, attach file, escalate." ]],
  },
  "Audit Logs": {
    title: "Audit logs",
    subtitle: "Every sensitive customer and admin action must be traceable.",
    icon: Database,
    blocks: [["Log fields", "User ID, admin ID, action, timestamp, IP address, device ID, before/after values, result."], ["Example", "Admin updated KYC status from Pending to Approved at 13 May 2026 10:22." ]],
  },
  Reports: {
    title: "Reports",
    subtitle: "Operational, compliance, customer, and payment reporting.",
    icon: BarChart3,
    blocks: [["KYC reports", "Approval rate, rejection rate, manual review time."], ["Payment reports", "Volume, failure rate, provider status, fees."], ["Risk reports", "Fraud alerts, escalations, resolved investigations." ]],
  },
};

const transactions = [
  ["Salary", "Today", "+£3,200.00", "Completed"],
  ["Green Market", "Today", "-£46.20", "Completed"],
  ["Streaming Plus", "Yesterday", "-£12.99", "Completed"],
  ["Transfer to Mum", "12 May", "-£250.00", "Completed"],
  ["Energy Direct Debit", "10 May", "-£89.40", "Pending"],
];

function getPageNumber(name) {
  const allPages = sections.flatMap((s) => s.pages);
  return allPages.indexOf(name) + 1;
}

function Field({ label }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const isPassword = label.toLowerCase().includes("password");
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-800 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={isPassword ? "password" : "text"}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
        placeholder={`Enter ${label.toLowerCase()}`}
        aria-label={label}
      />
    </div>
  );
}

function Button({ children, variant = "primary" }) {
  const base = "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4";
  const styles = variant === "primary"
    ? "bg-blue-800 text-white hover:bg-blue-900 focus:ring-blue-200"
    : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus:ring-slate-200";
  return <button className={`${base} ${styles}`}>{children}</button>;
}

function PageRenderer({ pageName }) {
  const page = pageContent[pageName] || pageContent.Home;
  const Icon = page.icon || FileText;
  const pageNumber = getPageNumber(pageName);

  return (
    <motion.main
      key={pageName}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-[680px]"
      aria-labelledby="page-title"
    >
      <div className="rounded-[2rem] bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/20" aria-hidden="true">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-100">Page {pageNumber || "—"} of 55</p>
              <h1 id="page-title" className="text-3xl font-bold tracking-tight lg:text-5xl">{page.title}</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-blue-50">{page.subtitle}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {page.cta && <Button>{page.cta}</Button>}
            {page.secondary && <Button variant="secondary">{page.secondary}</Button>}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-6" aria-label="Page content">
          {page.search && (
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <label htmlFor="page-search" className="block text-sm font-semibold text-slate-800 mb-2">Search this section</label>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" aria-hidden="true" />
                <input id="page-search" className="w-full rounded-2xl border border-slate-300 py-3 pl-12 pr-4 focus:border-blue-700 focus:ring-4 focus:ring-blue-100" placeholder="Search by keyword, reference, or name" />
              </div>
            </div>
          )}

          {page.dashboard && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {page.blocks.map(([title, body]) => (
                <article key={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-600">{title}</h2>
                  <p className="mt-2 text-2xl font-bold text-slate-950">{body}</p>
                </article>
              ))}
            </div>
          )}

          {page.form && (
            <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" aria-label={`${page.title} form`}>
              <div className="grid gap-4 md:grid-cols-2">
                {page.form.map((field) => <Field key={field} label={field} />)}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button>{page.cta || "Continue"}</Button>
                {page.secondary && <Button variant="secondary">{page.secondary}</Button>}
              </div>
            </form>
          )}

          {page.options && (
            <div className="grid gap-3 md:grid-cols-2" role="list" aria-label="Available options">
              {page.options.map((option) => (
                <button key={option} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100">
                  <span className="font-semibold text-slate-950">{option}</span>
                  <ChevronRight className="h-5 w-5 text-slate-500" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}

          {page.checklist && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Checklist</h2>
              <ul className="mt-4 space-y-3">
                {page.checklist.map((item) => (
                  <li key={item} className="flex gap-3 text-slate-800">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-800" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {page.transactions && (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Recent account transactions</caption>
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th scope="col" className="px-5 py-4">Name</th>
                    <th scope="col" className="px-5 py-4">Date</th>
                    <th scope="col" className="px-5 py-4">Amount</th>
                    <th scope="col" className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map(([name, date, amount, status]) => (
                    <tr key={name}>
                      <td className="px-5 py-4 font-semibold text-slate-950">{name}</td>
                      <td className="px-5 py-4 text-slate-700">{date}</td>
                      <td className="px-5 py-4 font-semibold text-slate-950">{amount}</td>
                      <td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">{status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {page.blocks && !page.dashboard && (
            <div className="grid gap-4 md:grid-cols-2">
              {page.blocks.map(([title, body]) => (
                <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-950">{title}</h2>
                  <p className="mt-2 leading-7 text-slate-700">{body}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-6" aria-label="Page summary">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Accessibility included</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-blue-800" aria-hidden="true" />Semantic headings and landmarks</li>
              <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-blue-800" aria-hidden="true" />Form labels and focus states</li>
              <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-blue-800" aria-hidden="true" />Keyboard-friendly buttons</li>
              <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-blue-800" aria-hidden="true" />Readable copy and clear actions</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
            <div className="flex gap-3">
              <AlertTriangle className="h-6 w-6 shrink-0" aria-hidden="true" />
              <div>
                <h2 className="font-bold">Compliance reminder</h2>
                <p className="mt-2 text-sm leading-6">A real banking product needs a regulated banking, e-money, payment, card, or BaaS partner before handling live customer funds.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </motion.main>
  );
}

export default function App() {
  const allPages = useMemo(() => sections.flatMap((section) => section.pages.map((page) => ({ page, section: section.label }))), []);
  const [activePage, setActivePage] = useState("Home");
  const [query, setQuery] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  const filteredSections = sections.map((section) => ({
    ...section,
    pages: section.pages.filter((page) =>
      `${section.label} ${page}`.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((section) => section.pages.length > 0);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg">
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <button className="rounded-2xl border border-slate-200 p-3 lg:hidden" onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen} aria-controls="app-navigation" aria-label="Toggle navigation">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-800 p-2 text-white" aria-hidden="true"><Landmark className="h-6 w-6" /></div>
            <div>
              <p className="text-lg font-black tracking-tight">TrustBank</p>
              <p className="text-xs font-medium text-slate-600">Accessible bank app prototype</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900">{allPages.length} pages available</span>
            <Button>Preview account</Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <nav id="app-navigation" className={`${navOpen ? "block" : "hidden"} lg:block`} aria-label="Application pages">
          <div className="sticky top-24 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
            <label htmlFor="nav-search" className="block text-sm font-bold text-slate-900 mb-2">Find a page</label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" aria-hidden="true" />
              <input
                id="nav-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 55 pages"
                className="w-full rounded-2xl border border-slate-300 py-3 pl-10 pr-3 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <div className="max-h-[calc(100vh-220px)] space-y-5 overflow-auto pr-1">
              {filteredSections.map((section) => {
                const SectionIcon = section.icon;
                return (
                  <section key={section.id} aria-labelledby={`${section.id}-heading`}>
                    <h2 id={`${section.id}-heading`} className="mb-2 flex items-center gap-2 px-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <SectionIcon className="h-4 w-4" aria-hidden="true" /> {section.label}
                    </h2>
                    <ul className="space-y-1">
                      {section.pages.map((page) => {
                        const selected = activePage === page;
                        return (
                          <li key={page}>
                            <button
                              onClick={() => { setActivePage(page); setNavOpen(false); }}
                              className={`w-full rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${selected ? "bg-blue-800 text-white" : "text-slate-700 hover:bg-slate-100"}`}
                              aria-current={selected ? "page" : undefined}
                            >
                              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">{getPageNumber(page)}</span>
                              {page}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        </nav>

        <div id="main-content">
          <PageRenderer pageName={activePage} />
        </div>
      </div>
    </div>
  );
}
