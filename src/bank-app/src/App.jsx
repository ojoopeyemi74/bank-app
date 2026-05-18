import { useEffect, useState } from "react";
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
  Mail,
  Menu,
  ChevronDown,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Plus,
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

const appAreas = [
  {
    id: "public",
    label: "Public",
    icon: Globe,
    groups: [
      { id: "website", label: "Website", pages: ["Home", "Features", "Security", "Fees"] },
      { id: "public-help", label: "Help", pages: ["Help Centre"] },
    ],
  },
  {
    id: "open-account",
    label: "Open Account",
    icon: UserPlus,
    groups: [
      { id: "application", label: "Application", pages: ["Open Account", "Personal Details", "Contact Details"] },
      { id: "contact-checks", label: "Contact Checks", pages: ["Email Verification", "Phone Verification"] },
      { id: "security-setup", label: "Security Setup", pages: ["Create Password", "Terms & Consent"] },
    ],
  },
  {
    id: "identity",
    label: "Identity",
    icon: BadgeCheck,
    groups: [
      { id: "document-check", label: "Document Check", pages: ["Identity Intro", "Select ID Document", "Upload ID Document"] },
      { id: "selfie-review", label: "Selfie & Review", pages: ["Selfie Check", "KYC Processing"] },
      { id: "kyc-outcomes", label: "Outcomes", pages: ["KYC Approved", "KYC Pending", "KYC Failed"] },
    ],
  },
  {
    id: "access",
    label: "Access",
    icon: Lock,
    groups: [
      { id: "sign-in", label: "Login", pages: ["Login", "MFA Verification", "Biometric Setup"] },
      { id: "recovery", label: "Recovery", pages: ["Forgot Password", "Password Reset"] },
    ],
  },
  {
    id: "money",
    label: "Money",
    icon: Landmark,
    groups: [
      { id: "overview", label: "Overview", pages: ["Dashboard"] },
      { id: "accounts", label: "Accounts", pages: ["Accounts Overview", "Account Details"] },
      { id: "transactions", label: "Transactions", pages: ["Transaction Details"] },
      { id: "payments", label: "Payments", pages: ["Pay & transfer", "Review Transfer", "Transfer Success", "Transfer Failed", "View transaction"] },
      { id: "beneficiaries", label: "Beneficiaries", pages: ["Beneficiaries", "Beneficiary Details"] },
    ],
  },
  {
    id: "apply",
    label: "Apply",
    icon: ClipboardList,
    groups: [
      { id: "applications", label: "Applications", pages: ["Apply", "Investment Application", "Savings Application", "Retirement Application"] },
    ],
  },
  {
    id: "cards",
    label: "Cards",
    icon: CreditCard,
    groups: [
      { id: "card-management", label: "Card Management", pages: ["Cards Overview", "Card Details", "Freeze Card", "Report Card Issue"] },
    ],
  },
  {
    id: "support",
    label: "Support",
    icon: HelpCircle,
    groups: [
      { id: "documents", label: "Documents", pages: ["Statements"] },
      { id: "messages", label: "Messages", pages: ["Notifications", "Support Centre", "Support Ticket"] },
      { id: "profile-security", label: "Profile & Security", pages: ["Profile", "Security Settings"] },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    icon: Gauge,
    groups: [
      { id: "admin-overview", label: "Overview", pages: ["Admin Dashboard", "Customer Search"] },
      { id: "risk-operations", label: "Risk Operations", pages: ["KYC Review Queue", "Transaction Monitoring", "Fraud Alerts"] },
      { id: "service-operations", label: "Service Operations", pages: ["Support Tickets Admin"] },
      { id: "governance", label: "Governance", pages: ["Audit Logs", "Reports"] },
    ],
  },
];

const hiddenNavigationPages = new Set(["Review Transfer", "Transfer Success", "Transfer Failed"]);
const SESSION_IDLE_TIMEOUT_MS = 3 * 60 * 1000;

const pageContent = {
  Home: {
    title: "Money tools that keep you in control",
    subtitle: "Open an account, manage your money, send payments, and track everything securely from your phone or browser.",
    icon: Home,
    cta: "Open an account",
    secondary: "Login",
    blocks: [
      ["Fast account opening", "Start your application online with guided identity verification."],
      ["Real-time money view", "See balances, pending payments, recent activity, and alerts in one place."],
      ["Security by default", "Multi-factor login, payment confirmation, device checks, and fraud alerts are built in."],
    ],
  },
  Features: {
    title: "Everything you need for everyday money",
    subtitle: "A complete digital money experience for web and mobile customers.",
    icon: WalletCards,
    blocks: [
      ["Accounts", "View checking and savings accounts with available and pending balances."],
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
    subtitle: "Login securely to access your account.",
    icon: Lock,
    form: ["Email or customer ID", "Password"],
    cta: "Login",
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
    title: "Enable faster login",
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
    title: "Dashboard",
    subtitle: "Here’s your money at a glance.",
    icon: BarChart3,
    dashboard: true,
    blocks: [["Available balance", "$0.00"], ["Pending payments", "$0.00"], ["Recent activity", "No activity yet."], ["Security alert", "No unusual activity detected." ]],
  },
  "Accounts Overview": {
    title: "Your accounts",
    subtitle: "View balances and account status across all accounts.",
    icon: Landmark,
    blocks: [["Checking Account", "Account details load from your signed-in profile."], ["Savings Account", "Account details load from your signed-in profile." ]],
  },
  "Account Details": {
    title: "Checking account",
    subtitle: "Account details, balances, identifiers, and actions.",
    icon: Building2,
    blocks: [["Account details", "Choose an account to view its balance and identifiers." ]],
  },
  Apply: {
    title: "Apply",
    subtitle: "Choose what you want to apply for.",
    icon: ClipboardList,
    options: ["Investment Application", "Savings Application", "Retirement Application"],
  },
  "Investment Application": {
    title: "Investment application",
    subtitle: "Start a simple request to discuss investment options.",
    icon: BarChart3,
    form: ["Investment goal", "Starting amount", "Monthly contribution"],
    cta: "Submit request",
  },
  "Savings Application": {
    title: "Savings application",
    subtitle: "Open or request a savings product that fits your goal.",
    icon: WalletCards,
    form: ["Savings goal", "Starting deposit", "Target date"],
    cta: "Submit request",
  },
  "Retirement Application": {
    title: "Retirement application",
    subtitle: "Tell us the basics so we can prepare retirement options.",
    icon: FileText,
    form: ["Retirement goal", "Expected retirement age", "Monthly contribution"],
    cta: "Submit request",
  },
  "View transaction": {
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
    blocks: [["Details", "Choose a transaction to view its full details." ]],
  },
  "Pay & transfer": {
    title: "Pay & transfer",
    subtitle: "Enter the payment details and continue to review.",
    icon: Send,
    paymentStart: true,
  },
  "Select Beneficiary": {
    title: "Who are you sending money to?",
    subtitle: "Choose a saved beneficiary or add someone new.",
    icon: Users,
    search: true,
    blocks: [["No saved beneficiaries", "Beneficiaries you add will appear here." ]],
  },
  "Add Beneficiary": {
    title: "Add a new beneficiary",
    subtitle: "Check details carefully. Payments to the wrong account may be hard to recover.",
    icon: Users,
    form: ["Beneficiary name", "Account number / IBAN", "Sort code / routing number", "Institution name", "Reference nickname"],
  },
  "Enter Amount": {
    title: "How much would you like to send?",
    subtitle: "Enter the amount and payment reference.",
    icon: Send,
    form: ["Amount", "Payment reference", "Payment date"],
    checklist: ["Repeat payment", "Save as template", "Notify me when complete"],
  },
  "Review Transfer": {
    title: "Review payment",
    subtitle: "Confirm the details before sending money.",
    icon: ClipboardList,
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
    subtitle: "Your payment was sent successfully.",
    icon: CheckCircle2,
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
    blocks: [["No saved beneficiaries", "People or businesses you add will appear here." ]],
  },
  "Beneficiary Details": {
    title: "Beneficiary details",
    subtitle: "Review saved recipient information and recent payments.",
    icon: User,
    blocks: [["Details", "Choose a saved beneficiary to view details." ]],
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
    blocks: [["Card number", "No active card yet"], ["Status", "Not issued"], ["Linked account", "No linked card account yet" ]],
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
    blocks: [["No statements yet", "Statements will appear after account activity starts." ]],
  },
  Notifications: {
    title: "Notifications",
    subtitle: "Review account, payment, security, and support messages.",
    icon: Bell,
    blocks: [["No messages", "Payment, security, and account messages will appear here." ]],
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
    subtitle: "Review the details provided during signup.",
    icon: User,
  },
  "Security Settings": {
    title: "Security settings",
    subtitle: "Control how your account is protected.",
    icon: Settings,
    blocks: [["Password", "Last changed 42 days ago."], ["MFA", "Authenticator app enabled."], ["Trusted devices", "2 active devices."], ["Login history", "View recent logins and remove suspicious sessions." ]],
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

const CURRENT_USER_STORAGE_KEY = "oceanicfirst-current-user";
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new Error("The server is not running. Start Docker Desktop, then run `docker compose up --build`.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

function getPageFromUrl() {
  if (typeof window === "undefined") {
    return "Home";
  }

  const page = new URLSearchParams(window.location.search).get("page");
  return page || "Home";
}

function updateBrowserHistory(page, mode = "push") {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  if (page === "Home") {
    url.searchParams.delete("page");
  } else {
    url.searchParams.set("page", page);
  }

  const state = { page };
  if (mode === "replace") {
    window.history.replaceState(state, "", url);
    return;
  }

  window.history.pushState(state, "", url);
}

function getDisplayAccounts(user) {
  const accounts = user?.accounts?.length ? user.accounts : [];

  return accounts
    .map((account) => ({
      ...account,
      type: account.id === "current" || account.type === "Current account" ? "Checking account" : account.type,
    }))
    .sort((firstAccount, secondAccount) => {
      if (firstAccount.id === "savings") return -1;
      if (secondAccount.id === "savings") return 1;
      return 0;
    });
}

function getSelectedAccount(user, selectedAccountId = "savings") {
  const accounts = getDisplayAccounts(user);
  return accounts.find((account) => account.id === selectedAccountId) || accounts[0];
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatAccountType(accountType) {
  if (accountType === "current") return "Checking account";
  if (accountType === "savings") return "Savings account";
  return "Account";
}

function formatOtpEmail(maskedEmail) {
  return maskedEmail || "your registered email address";
}

function findPageContext(pageName) {
  for (const area of appAreas) {
    for (const group of area.groups) {
      if (group.pages.includes(pageName)) {
        return { area, group };
      }
    }
  }

  return { area: appAreas[0], group: appAreas[0].groups[0] };
}

function getPageGroup(pageName) {
  return findPageContext(pageName).group;
}

function getNextPageInGroup(pageName) {
  const group = getPageGroup(pageName);
  const currentIndex = group.pages.indexOf(pageName);

  if (currentIndex >= 0 && currentIndex < group.pages.length - 1) {
    return group.pages[currentIndex + 1];
  }

  return "Dashboard";
}

function getPreviousPageInGroup(pageName) {
  const group = getPageGroup(pageName);
  const currentIndex = group.pages.indexOf(pageName);

  if (currentIndex > 0) {
    return group.pages[currentIndex - 1];
  }

  return "Dashboard";
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
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
        placeholder={`Enter ${label.toLowerCase()}`}
        aria-label={label}
      />
    </div>
  );
}

function Button({ children, variant = "primary", type = "button", ...props }) {
  const base = "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4";
  const styles = variant === "primary"
    ? "bg-black text-white hover:bg-slate-900 focus:ring-emerald-200"
    : "border border-black bg-white text-black hover:bg-emerald-50 focus:ring-emerald-200";
  return <button type={type} className={`${base} ${styles}`} {...props}>{children}</button>;
}

function OceanicFirstLogoMark({ className = "h-7 w-7" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="currentColor" opacity="0" />
      <path d="M10 25c4.5-6 9-9 14-9s9.5 3 14 9" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 29c4 4 8 6 12 6s8-2 12-6" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 10v27" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M17 18c2.2-2.1 4.5-3.1 7-3.1s4.8 1 7 3.1" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

function HomePage({ onSignIn, onOpenAccount }) {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-emerald-950 bg-emerald-500">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-black p-2 text-emerald-400" aria-hidden="true">
              <OceanicFirstLogoMark className="h-7 w-7" />
            </div>
            <span className="text-2xl font-black tracking-tight">OceanicFirst</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAccount}
              className="hidden rounded-xl border border-black px-5 py-3 text-sm font-black text-black transition hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:inline-flex"
            >
              Open account
            </button>
            <button
              onClick={onSignIn}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-black text-white transition hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              Login
            </button>
          </div>
        </div>
      </header>

      <section className="bg-emerald-500">
        <div className="mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl items-center gap-10 px-5 py-10 sm:py-12 lg:grid-cols-[1fr_460px] lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-black uppercase tracking-wide text-emerald-950">Personal banking</p>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-black sm:text-5xl lg:text-7xl">
              Everyday banking with OceanicFirst.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-emerald-950 sm:text-xl">
              View your balances, manage your accounts, and access secure online banking whenever you need it.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onSignIn}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-7 py-4 text-base font-black text-white transition hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-white"
              >
                <Lock className="h-5 w-5" aria-hidden="true" />
                Login
              </button>
              <button
                onClick={onOpenAccount}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-black text-black transition hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-white"
              >
                Open account
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="relative hidden min-h-[520px] lg:block" aria-hidden="true">
            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-white/30" />
            <div className="absolute bottom-12 right-8 w-96 rounded-[2rem] bg-black p-8 text-white shadow-2xl">
              <ShieldCheck className="h-14 w-14 text-emerald-400" />
              <h2 className="mt-8 text-3xl font-black">Secure banking from wherever you are.</h2>
              <p className="mt-4 text-lg font-semibold leading-7 text-slate-300">
                Bank with confidence using protected online access and account verification.
              </p>
            </div>
            <div className="absolute left-4 top-24 w-72 rounded-[2rem] border border-emerald-900 bg-white p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-700" />
                <div>
                  <p className="font-black text-black">Account opening</p>
                  <p className="text-sm font-medium text-slate-600">Start your secure application online.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function LoginPage({ onVerifyLogin, onVerifyLoginOtp, onCompleteLogin, onHome, onOpenAccount, onNavigate }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [pendingChallenge, setPendingChallenge] = useState(null);
  const [rememberUserId, setRememberUserId] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (pendingChallenge) {
      if (!/^\d{6}$/.test(otp.trim())) {
        setError("Enter the 6-digit code sent to your email.");
        return;
      }

      const result = await onVerifyLoginOtp(userId, pendingChallenge.challengeId, otp);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      onCompleteLogin(result.user);
      setError("");
      return;
    }

    const result = await onVerifyLogin(userId, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setPendingChallenge(result.challenge);
    setOtp("");
    setError("");
  }

  const otpEmail = formatOtpEmail(pendingChallenge?.maskedEmail);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="bg-emerald-800 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <button
            type="button"
            onClick={onHome}
            className="flex w-fit items-center gap-3 text-left focus:outline-none focus:ring-4 focus:ring-emerald-300"
            aria-label="Go to OceanicFirst home"
          >
            <div className="bg-white p-2 text-black" aria-hidden="true">
              <OceanicFirstLogoMark className="h-8 w-8" />
            </div>
            <span className="text-2xl font-black tracking-tight">OCEANICFIRST</span>
          </button>
          <div className="flex flex-col gap-3 text-sm font-bold sm:flex-row sm:items-center">
            <button type="button" onClick={onOpenAccount} className="underline underline-offset-4">
              Register online
            </button>
            <span className="hidden text-emerald-200 sm:inline">|</span>
            <button type="button" onClick={() => onNavigate("Security")} className="underline underline-offset-4">
              Cookie policy
            </button>
            <div className="flex items-center gap-3 border border-white px-4 py-3">
              <Lock className="h-5 w-5" aria-hidden="true" />
              <div>
                <p className="font-black">You are logging into a secure site</p>
                <p className="text-xs underline underline-offset-4">How can I tell this site is secure?</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <section className="max-w-3xl">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-6xl">
            Welcome to online account access
          </h1>
          <p className="mt-6 text-lg text-slate-700">
            If you do not already use online access, it is simple to{" "}
            <button type="button" onClick={onOpenAccount} className="font-bold text-emerald-800 underline underline-offset-4">
              register online
            </button>
            .
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-7" aria-label="Online account login">
            {error && (
              <div className="max-w-xl border-l-4 border-red-700 bg-red-50 p-4 text-red-900" role="alert">
                <p className="font-black">We could not sign you in</p>
                <p className="mt-1 text-sm font-semibold">{error}</p>
              </div>
            )}

            {pendingChallenge && (
              <div className="max-w-xl border-l-4 border-emerald-700 bg-emerald-50 p-4 text-emerald-950" role="status">
                <p className="font-black">{pendingChallenge.firstLogin ? "Activation code sent" : "OTP sent"}</p>
                <p className="mt-1 text-sm font-semibold">
                  {pendingChallenge.firstLogin
                    ? "An OTP was sent to your account officer for first-time login. Ask your account officer for the 6-digit account activation code. Enter the 6-digit code to continue."
                    : `An OTP was sent to ${otpEmail}. Enter the 6-digit code to continue.`}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="login-user-id" className="mb-3 block text-base font-black text-slate-900">
                Username:
              </label>
              <input
                id="login-user-id"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                disabled={Boolean(pendingChallenge)}
                className="w-full max-w-xl border-2 border-slate-400 px-4 py-4 text-lg outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className="mb-3 block text-base font-black text-slate-900">
                Password:
              </label>
              <div className="flex w-full max-w-xl border-2 border-slate-400 focus-within:border-emerald-700 focus-within:ring-4 focus-within:ring-emerald-100">
                <input
                  id="login-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  disabled={Boolean(pendingChallenge)}
                  className="min-w-0 flex-1 px-4 py-4 text-lg outline-none"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-4 font-black text-emerald-800 underline underline-offset-4"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {pendingChallenge && (
              <div>
                <label htmlFor="login-otp" className="mb-3 block text-base font-black text-slate-900">
                  OTP code:
                </label>
                <input
                  id="login-otp"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full max-w-xl border-2 border-slate-400 px-4 py-4 text-lg tracking-[0.35em] outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                  placeholder="000000"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                />
              </div>
            )}

            <label className="flex max-w-xl items-center gap-3 text-base text-slate-800">
              <input
                type="checkbox"
                checked={rememberUserId}
                onChange={(event) => setRememberUserId(event.target.checked)}
                className="h-7 w-7 border-2 border-slate-400 accent-emerald-700"
              />
              <span>Remember my User ID</span>
              <HelpCircle className="h-5 w-5 text-emerald-800" aria-hidden="true" />
            </label>

            <p className="max-w-xl text-base text-slate-700">
              <strong className="text-slate-900">Warning:</strong> Do not tick this box if you are using a public or shared computer.
            </p>

            <div className="flex max-w-xl flex-col gap-5 border-y border-slate-300 py-7 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={() => onNavigate("Forgot Password")} className="w-fit font-black text-emerald-800 underline underline-offset-4">
                Forgotten your logon details?
              </button>
              <button
                type="submit"
                className="w-fit bg-emerald-800 px-7 py-4 text-lg font-black text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-200"
              >
                {pendingChallenge ? "Log in" : "Continue"}
              </button>
            </div>
          </form>

          <div className="mt-10 flex max-w-xl gap-5 border-b border-slate-300 pb-8">
            <Smartphone className="h-16 w-16 shrink-0 text-emerald-800" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-black text-emerald-800">Why not try our secure mobile app?</h2>
              <p className="mt-3 leading-7 text-slate-700">
                Get access to extra features like card controls, PIN checks, payment approvals, and account alerts.
              </p>
            </div>
          </div>
        </section>

        <aside className="space-y-4" aria-label="Login support">
          <button
            type="button"
            onClick={() => onNavigate("Help Centre")}
            className="flex w-full items-center justify-between border border-slate-300 bg-white p-5 text-left text-xl font-black text-emerald-800"
          >
            Help & Support
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate("Support Centre")}
            className="flex w-full items-center justify-between border border-slate-300 bg-white p-5 text-left text-xl font-black text-emerald-800"
          >
            Contact Us
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="border border-slate-300 bg-white p-8 text-center">
            <ShieldCheck className="mx-auto h-20 w-20 text-emerald-800" aria-hidden="true" />
            <p className="mt-4 text-2xl font-black text-emerald-800">Protected</p>
            <p className="mt-3 text-sm font-semibold text-slate-600">Your eligible deposits are protected by the financial services compensation scheme.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SignUpPage({ onCreateAccount, onHome, onSignIn }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ssn, setSsn] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [idType, setIdType] = useState("Driver's license");
  const [idDocument, setIdDocument] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [createdUsername, setCreatedUsername] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (!phone.trim()) {
      setError("Enter your phone number.");
      return;
    }

    if (!/^\d{3}-?\d{2}-?\d{4}$/.test(ssn.trim())) {
      setError("Enter a valid 9-digit SSN.");
      return;
    }

    if (!streetAddress.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      setError("Enter your full home address.");
      return;
    }

    if (!/^\d{5}(-\d{4})?$/.test(zipCode.trim())) {
      setError("Enter a valid ZIP code.");
      return;
    }

    if (!idDocument) {
      setError("Upload a driver's license or passport image.");
      return;
    }

    const result = await onCreateAccount({
      fullName,
      email,
      phone,
      ssn,
      homeAddress: {
        street: streetAddress,
        city,
        state,
        zipCode,
      },
      idVerification: {
        idType,
      },
      idDocument,
      username,
      password,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setCreatedUsername(username.trim());
    setError("");
  }

  if (createdUsername) {
    return (
      <main className="min-h-screen bg-white text-slate-950">
        <header className="border-b border-emerald-950 bg-emerald-500">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
            <button type="button" onClick={onHome} className="flex items-center gap-3 text-left focus:outline-none focus:ring-4 focus:ring-emerald-200">
              <div className="rounded-xl bg-black p-2 text-emerald-400" aria-hidden="true">
                <OceanicFirstLogoMark className="h-7 w-7" />
              </div>
              <span className="text-2xl font-black tracking-tight">OceanicFirst</span>
            </button>
            <button
              type="button"
              onClick={onSignIn}
              className="rounded-xl bg-black px-5 py-3 text-sm font-black text-white transition hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              Login
            </button>
          </div>
        </header>

        <section className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm">
            <CheckCircle2 className="h-14 w-14 text-emerald-700" aria-hidden="true" />
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Your account has been created
            </h1>
            <p className="mt-4 text-lg font-semibold leading-8 text-slate-700">
              Login with username <span className="font-black text-slate-950">{createdUsername}</span> and the password you created.
            </p>
            <p className="mt-3 text-base font-semibold leading-7 text-slate-700">
              Because this is your first login, you will need to request your account activation code from your account officer.
            </p>
            <button
              type="button"
              onClick={onSignIn}
              className="mt-7 rounded-2xl bg-black px-6 py-4 text-base font-black text-white transition hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              Continue to login
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-emerald-950 bg-emerald-500">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <button type="button" onClick={onHome} className="flex items-center gap-3 text-left focus:outline-none focus:ring-4 focus:ring-emerald-200">
            <div className="rounded-xl bg-black p-2 text-emerald-400" aria-hidden="true">
              <OceanicFirstLogoMark className="h-7 w-7" />
            </div>
            <span className="text-2xl font-black tracking-tight">OceanicFirst</span>
          </button>
          <button
            type="button"
            onClick={onSignIn}
            className="rounded-xl bg-black px-5 py-3 text-sm font-black text-white transition hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-200"
          >
            Login
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-8 sm:py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.7fr)] lg:px-8">
        <section>
          <p className="text-sm font-black uppercase tracking-wide text-emerald-800">New customer application</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-6xl">
            Open a personal checking and savings account.
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700">
            To help protect your account, we collect the identity information required to review and open your account.
          </p>
          <div className="mt-8 rounded-3xl bg-emerald-50 p-6">
            <h2 className="text-xl font-black text-slate-950">What happens next</h2>
            <ul className="mt-4 space-y-3 text-slate-700">
              <li className="flex gap-3"><CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-700" aria-hidden="true" />Submit your personal and identity information for secure review.</li>
              <li className="flex gap-3"><CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-700" aria-hidden="true" />Use your username and password to access online banking.</li>
              <li className="flex gap-3"><CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-700" aria-hidden="true" />Receive your checking and savings account numbers after approval.</li>
            </ul>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl" aria-label="Create account form">
          <h2 className="text-2xl font-black text-slate-950">Your details</h2>

          {error && (
            <div className="mt-5 border-l-4 border-red-700 bg-red-50 p-4 text-red-900" role="alert">
              <p className="font-black">Account not created</p>
              <p className="mt-1 text-sm font-semibold">{error}</p>
            </div>
          )}

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="signup-name" className="mb-2 block text-sm font-black text-slate-900">Full name</label>
              <input
                id="signup-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-ssn" className="mb-2 block text-sm font-black text-slate-900">Social Security number</label>
              <input
                id="signup-ssn"
                value={ssn}
                onChange={(event) => setSsn(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                placeholder="123-45-6789"
                inputMode="numeric"
                autoComplete="off"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="signup-email" className="mb-2 block text-sm font-black text-slate-900">Email address</label>
                <input
                  id="signup-email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label htmlFor="signup-phone" className="mb-2 block text-sm font-black text-slate-900">Phone number</label>
                <input
                  id="signup-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  type="tel"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                  placeholder="Phone number"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            <fieldset className="rounded-2xl border border-slate-200 p-4">
              <legend className="px-2 text-sm font-black text-slate-900">Home address</legend>
              <div className="mt-3 space-y-4">
                <input
                  value={streetAddress}
                  onChange={(event) => setStreetAddress(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                  placeholder="Street address"
                  autoComplete="street-address"
                  required
                />
                <div className="grid gap-4 sm:grid-cols-[1fr_96px_130px]">
                  <input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                    placeholder="City"
                    autoComplete="address-level2"
                    required
                  />
                  <input
                    value={state}
                    onChange={(event) => setState(event.target.value.toUpperCase().slice(0, 2))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 uppercase outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                    placeholder="State"
                    autoComplete="address-level1"
                    required
                  />
                  <input
                    value={zipCode}
                    onChange={(event) => setZipCode(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                    placeholder="ZIP code"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    required
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="rounded-2xl border border-slate-200 p-4">
              <legend className="px-2 text-sm font-black text-slate-900">Government ID</legend>
              <div className="mt-3 space-y-4">
                <label htmlFor="signup-id-type" className="block text-sm font-black text-slate-900">ID type</label>
                <select
                  id="signup-id-type"
                  value={idType}
                  onChange={(event) => setIdType(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                >
                  <option>Driver's license</option>
                  <option>Passport</option>
                </select>

                <label htmlFor="signup-id-document" className="block text-sm font-black text-slate-900">Upload ID document</label>
                <input
                  id="signup-id-document"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setIdDocument(event.target.files?.[0] || null)}
                  className="w-full rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-black file:px-4 file:py-2 file:font-black file:text-white focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                  required
                />
                <p className="text-sm font-semibold text-slate-600">Accepted: any clear image of your driver's license or passport.</p>
              </div>
            </fieldset>

            <div>
              <label htmlFor="signup-username" className="mb-2 block text-sm font-black text-slate-900">Username</label>
              <input
                id="signup-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                placeholder="Choose a username"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="mb-2 block text-sm font-black text-slate-900">Password</label>
              <input
                id="signup-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                placeholder="Create a password"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-confirm-password" className="mb-2 block text-sm font-black text-slate-900">Confirm password</label>
              <input
                id="signup-confirm-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type="password"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-7 w-full rounded-2xl bg-black px-5 py-4 text-base font-black text-white transition hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-200"
          >
            Create account
          </button>

          <p className="mt-4 text-center text-sm text-slate-600">
            Already registered?{" "}
            <button type="button" onClick={onSignIn} className="font-black text-emerald-800 underline underline-offset-4">
              Login
            </button>
          </p>
        </form>
      </div>
    </main>
  );
}

function AccountHomePage({ onNavigate, onLogout, user, selectedAccountId, onSelectAccount, onOpenAccountDetails }) {
  const orderedAccounts = getDisplayAccounts(user);
  const selectedAccount = orderedAccounts.find((account) => account.id === selectedAccountId) || orderedAccounts[0];
  const moreForYou = [
    { icon: Globe, title: "Stay safe from scams", action: "Prevent fraud", color: "bg-violet-400", page: "Fraud Alerts" },
    { icon: Landmark, title: "Got other accounts?", action: "Link external accounts", color: "bg-orange-300", page: "Accounts Overview" },
    { icon: Gauge, title: "What is your credit score?", action: "View here", color: "bg-pink-300", page: "Reports" },
    { icon: Send, title: "Plan, book, spend, enjoy", action: "Explore Travel Hub", color: "bg-teal-300", page: "Features" },
  ];

  return (
    <main className="min-h-screen bg-emerald-50 text-slate-950">
      <header className="border-b border-emerald-950 bg-emerald-500">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-3 py-3 sm:gap-6 sm:px-6 sm:py-5 lg:px-8">
          <button
            type="button"
            onClick={() => onNavigate("Dashboard")}
            className="flex items-center gap-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
            aria-label="Open account dashboard"
          >
            <span className="rounded-xl bg-black p-2 text-emerald-400" aria-hidden="true">
              <OceanicFirstLogoMark className="h-5 w-5 sm:h-7 sm:w-7" />
            </span>
            <span className="text-xl font-black tracking-tight sm:text-2xl">OceanicFirst</span>
          </button>
          <nav className="hidden items-center gap-2 md:flex" aria-label="Account navigation">
            {[
              ["Home", "Dashboard"],
              ["Apply", "Apply"],
              ["Payments", "Pay & transfer"],
              ["Search", "View transaction"],
              ["Cards", "Cards Overview"],
            ].map(([label, page]) => (
              <button
                key={label}
                type="button"
                onClick={() => onNavigate(page)}
                className={`rounded-xl px-4 py-2 text-sm font-black ${label === "Home" ? "bg-black text-white" : "text-emerald-950 hover:bg-emerald-100 hover:text-slate-950"}`}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-5">
            <button
              type="button"
              onClick={() => onNavigate("Notifications")}
              className="rounded-xl p-2 text-slate-950 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-200"
              aria-label="Open inbox"
            >
              <Mail className="h-5 w-5 sm:h-7 sm:w-7" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("Support Centre")}
              className="hidden rounded-xl p-2 text-emerald-950 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:block"
              aria-label="Open support centre"
            >
              <HelpCircle className="h-7 w-7" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("Security Settings")}
              className="hidden rounded-xl p-2 text-emerald-950 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:block"
              aria-label="Open security settings"
            >
              <Settings className="h-7 w-7" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl bg-white px-3 py-2 text-xs font-black text-black hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:px-4 sm:text-sm"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-400 sm:text-sm">Everyday money</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-4xl lg:text-6xl">Welcome {user?.fullName || "Customer"}</h1>
          </div>
          <nav className="hidden gap-3 overflow-x-auto sm:flex" aria-label="Account sections">
            {[
              ["Summary", "Accounts Overview"],
              ["Everyday", "Dashboard"],
              ["Save & Invest", "Accounts Overview"],
              ["Borrow", "Fees"],
            ].map(([tab, page]) => (
              <button
                key={tab}
                type="button"
                onClick={() => onNavigate(page)}
                className={`shrink-0 rounded-2xl border px-5 py-3 text-sm font-black sm:px-7 sm:text-base ${tab === "Everyday" ? "border-emerald-400 bg-emerald-500 text-black" : "border-slate-300 text-slate-950 hover:bg-white"}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-4 grid gap-6 sm:mt-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <section aria-labelledby="accounts-title">
            <div className="mb-3 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 id="accounts-title" className="text-xl font-black sm:text-3xl">Accounts</h2>
              <div className="flex gap-3 overflow-x-auto" role="tablist" aria-label="Choose account">
                {orderedAccounts.map((account) => {
                  const selected = selectedAccount?.id === account.id;
                  return (
                    <button
                      key={account.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => onSelectAccount(account.id)}
                      className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-black sm:rounded-2xl sm:px-5 sm:py-3 ${
                        selected ? "border-emerald-400 bg-emerald-500 text-black" : "border-slate-300 text-slate-950 hover:bg-white"
                      }`}
                    >
                      {account.type}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedAccount && (
              <>
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black sm:text-xl">{selectedAccount.type}</h3>
                        <p className="mt-1 text-sm font-semibold text-slate-600 sm:text-lg">
                          Routing {selectedAccount.routingNumber} / Account {selectedAccount.accountNumber}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenAccountDetails(selectedAccount.id)}
                        className="rounded-xl p-2 text-slate-950 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                        aria-label={`Open ${selectedAccount.type} details`}
                      >
                        <MoreHorizontal className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-4 flex items-end justify-between sm:mt-8">
                      <p className="text-3xl font-black sm:text-5xl">{formatCurrency(selectedAccount.balance)}</p>
                      <button
                        type="button"
                        onClick={() => onOpenAccountDetails(selectedAccount.id)}
                        className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-emerald-50 text-xs font-black text-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:h-14 sm:w-14 sm:text-sm"
                        aria-label={`Open ${selectedAccount.type} details`}
                      >
                        RB
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 border-t border-slate-200">
                    <button onClick={() => onNavigate("Pay & transfer")} className="border-r border-slate-200 px-3 py-3 text-sm font-black hover:bg-emerald-50 sm:py-5 sm:text-lg">
                      Pay & transfer
                    </button>
                    <button onClick={() => onNavigate("Beneficiaries")} className="px-3 py-3 text-sm font-black hover:bg-emerald-50 sm:py-5 sm:text-lg">
                      Regular payments
                    </button>
                  </div>
                </article>
                <article className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-xl font-black">Account activity</h3>
                        <p className="mt-1 text-sm font-semibold leading-6 text-slate-600 sm:text-base">
                          Review recent transfers, incoming credits, and upcoming payments for this account.
                        </p>
                      </div>
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-200 text-emerald-950">
                        <Activity className="h-7 w-7" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-200 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => onNavigate("View transaction")}
                      className="flex w-full items-center justify-between px-4 py-4 text-left font-black hover:bg-emerald-50 sm:px-6"
                    >
                      <span className="flex items-center gap-3">
                        <Receipt className="h-6 w-6 text-slate-700" aria-hidden="true" />
                        View transactions
                      </span>
                      <ChevronRight className="h-6 w-6 text-slate-600" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate("Beneficiaries")}
                      className="flex w-full items-center justify-between px-4 py-4 text-left font-black hover:bg-emerald-50 sm:px-6"
                    >
                      <span className="flex items-center gap-3">
                        <BarChart3 className="h-6 w-6 text-slate-700" aria-hidden="true" />
                        Regular payments
                      </span>
                      <ChevronRight className="h-6 w-6 text-slate-600" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              </>
            )}
          </section>

          <aside className="space-y-5">
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">Rewards</h2>
              <div className="mt-5 flex items-center gap-5">
                <div className="flex -space-x-3">
                  {[
                    { icon: CreditCard, page: "Cards Overview", label: "Open card rewards" },
                    { icon: Receipt, page: "Statements", label: "Open statement rewards" },
                    { icon: WalletCards, page: "Notifications", label: "Open cashback offers" },
                  ].map(({ icon: RewardIcon, page, label }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => onNavigate(page)}
                      className="grid h-16 w-16 place-items-center rounded-full bg-emerald-200 text-black ring-4 ring-white focus:outline-none focus:ring-4 focus:ring-emerald-200"
                      aria-label={label}
                    >
                      <RewardIcon className="h-8 w-8" aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <p className="text-lg font-semibold leading-7 text-slate-600">Activate your offers, earn cashback and more</p>
              </div>
            </article>

            <button
              type="button"
              onClick={() => onNavigate("Cards Overview")}
              className="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm hover:bg-emerald-50"
            >
              <span className="flex items-center gap-5">
                <span className="grid h-20 w-20 place-items-center rounded-2xl bg-emerald-200 text-emerald-900">
                  <CreditCard className="h-11 w-11" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xl font-black">Manage Cards</span>
                  <span className="mt-1 block text-lg font-semibold text-slate-600">View PIN, freeze card and more</span>
                </span>
              </span>
              <ChevronRight className="h-8 w-8" aria-hidden="true" />
            </button>

            <section aria-labelledby="more-for-you-title">
              <h2 id="more-for-you-title" className="mb-5 text-2xl font-black sm:text-3xl">More for you</h2>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                {moreForYou.map((item) => {
                  const TileIcon = item.icon;
                  return (
                    <button
                      key={item.action}
                      type="button"
                      onClick={() => onNavigate(item.page)}
                      className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:bg-emerald-50"
                    >
                      <span className={`grid h-14 w-14 place-items-center rounded-full ${item.color} text-black`}>
                        <TileIcon className="h-7 w-7" aria-hidden="true" />
                      </span>
                      <span className="mt-5 block text-lg font-semibold leading-6 text-slate-600">{item.title}</span>
                      <span className="mt-2 block text-xl font-black leading-6 text-slate-950">{item.action}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-6 hidden rounded-3xl border border-dashed border-slate-300 bg-white p-6 shadow-sm sm:block">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black">Need a new credit card?</h2>
              <p className="mt-2 text-lg font-semibold leading-7 text-slate-600">Use our eligibility checker to see what cards you are pre-approved for.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("Cards Overview")}
              className="inline-flex w-fit items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-3 font-black text-black"
            >
              <Plus className="h-6 w-6" aria-hidden="true" />
              Check eligibility
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function PaymentStartForm({ initialPayment, accounts, selectedAccount, onReviewPayment }) {
  const orderedAccounts = accounts.length ? accounts : [selectedAccount].filter(Boolean);
  const initialSourceAccountId = initialPayment?.fromAccountId || selectedAccount?.id || orderedAccounts[0]?.id || "savings";
  const [fromAccountId, setFromAccountId] = useState(initialSourceAccountId);
  const [beneficiaryName, setBeneficiaryName] = useState(initialPayment?.beneficiaryName || "");
  const [routingNumber, setRoutingNumber] = useState(initialPayment?.routingNumber || "");
  const [accountNumber, setAccountNumber] = useState(initialPayment?.accountNumber || "");
  const [amount, setAmount] = useState(initialPayment?.amount || "");
  const [reference, setReference] = useState(initialPayment?.reference || "");
  const sourceAccount = orderedAccounts.find((account) => account.id === fromAccountId) || orderedAccounts[0] || selectedAccount;

  function handleSubmit(event) {
    event.preventDefault();
    onReviewPayment({
      fromAccountId: sourceAccount?.id || "savings",
      fromAccountType: sourceAccount?.type || "Savings account",
      beneficiaryName,
      routingNumber,
      accountNumber,
      amount,
      reference,
    });
  }

  return (
    <form
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      aria-label="Send money form"
      onSubmit={handleSubmit}
    >
      <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
        <label htmlFor="payment-from-account" className="block text-sm font-black text-emerald-950">From account</label>
        <select
          id="payment-from-account"
          value={fromAccountId}
          onChange={(event) => setFromAccountId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 font-bold text-slate-950 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
        >
          {orderedAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.type} - {formatCurrency(account.balance)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <label htmlFor="payment-beneficiary-name" className="mb-2 block text-sm font-black text-slate-900">Beneficiary name</label>
          <input
            id="payment-beneficiary-name"
            value={beneficiaryName}
            onChange={(event) => setBeneficiaryName(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
            placeholder="Full name or business name"
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label htmlFor="payment-routing" className="mb-2 block text-sm font-black text-slate-900">Routing number</label>
          <input
            id="payment-routing"
            value={routingNumber}
            onChange={(event) => setRoutingNumber(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
            placeholder="123456789"
            inputMode="numeric"
            required
          />
        </div>

        <div>
          <label htmlFor="payment-account" className="mb-2 block text-sm font-black text-slate-900">Account number</label>
          <input
            id="payment-account"
            value={accountNumber}
            onChange={(event) => setAccountNumber(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
            placeholder="Account number"
            inputMode="numeric"
            required
          />
        </div>

        <div>
          <label htmlFor="payment-amount" className="mb-2 block text-sm font-black text-slate-900">Amount</label>
          <div className="flex w-full rounded-xl border border-slate-300 focus-within:border-emerald-700 focus-within:ring-4 focus-within:ring-emerald-100">
            <span className="grid w-12 place-items-center border-r border-slate-300 font-black text-slate-700" aria-hidden="true">$</span>
            <input
              id="payment-amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              type="number"
              min="0.01"
              step="0.01"
              className="min-w-0 flex-1 rounded-r-xl px-4 py-3 outline-none"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="payment-ref" className="mb-2 block text-sm font-black text-slate-900">Ref</label>
          <input
            id="payment-ref"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
            placeholder="Payment reference"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit">Review payment</Button>
      </div>
    </form>
  );
}

function PaymentReview({ payment, onEdit, onRequestPaymentOtp, onSendPayment }) {
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpChallenge, setOtpChallenge] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const amountValue = Number(payment?.amount || 0);
  const otpEmail = formatOtpEmail(otpChallenge?.maskedEmail);

  useEffect(() => {
    let isActive = true;

    async function requestOtp() {
      if (!payment) {
        return;
      }

      setIsSendingOtp(true);
      const result = await onRequestPaymentOtp();

      if (!isActive) {
        return;
      }

      setIsSendingOtp(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setOtpChallenge(result.challenge);
      setError("");
    }

    requestOtp();

    return () => {
      isActive = false;
    };
  }, [payment, onRequestPaymentOtp]);

  async function handleSendPayment() {
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Enter the 6-digit code sent to your email to send this payment.");
      return;
    }

    if (!otpChallenge?.challengeId) {
      setError("Request a new verification code before sending this payment.");
      return;
    }

    const result = await onSendPayment({
      otpChallengeId: otpChallenge.challengeId,
      otp,
    });

    if (!result.ok) {
      setError(result.error);
    }
  }

  if (!payment) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-lg font-black text-slate-950">No payment details to review.</p>
        <p className="mt-2 text-slate-700">Go back to Pay & transfer and enter the beneficiary details.</p>
        <div className="mt-6">
          <Button onClick={onEdit}>Enter payment details</Button>
        </div>
      </div>
    );
  }

  const rows = [
    ["From", payment.fromAccountType || (payment.fromAccountId === "current" ? "Checking account" : "Savings account")],
    ["Beneficiary name", payment.beneficiaryName],
    ["Routing number", payment.routingNumber],
    ["Account number", payment.accountNumber],
    ["Amount", Number.isFinite(amountValue) ? formatCurrency(amountValue) : payment.amount],
    ["Ref", payment.reference || "No reference"],
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {error && (
        <div className="mb-5 border-l-4 border-red-700 bg-red-50 p-4 text-red-900" role="alert">
          <p className="font-black">Payment not sent</p>
          <p className="mt-1 text-sm font-semibold">{error}</p>
          </div>
      )}

      <div className="mb-5 border-l-4 border-emerald-700 bg-emerald-50 p-4 text-emerald-950" role="status">
        <p className="font-black">{isSendingOtp ? "Sending OTP" : "OTP sent"}</p>
        <p className="mt-1 text-sm font-semibold">
          {isSendingOtp
            ? "Sending a verification code to your registered email address."
            : `An OTP was sent to ${otpEmail}. Enter the 6-digit code to confirm this transfer.`}
        </p>
      </div>

      <dl className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-5">
            <dt className="text-sm font-black text-slate-600">{label}</dt>
            <dd className="break-words text-base font-bold text-slate-950">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 max-w-sm">
        <label htmlFor="payment-otp" className="mb-2 block text-sm font-black text-slate-900">OTP code</label>
        <input
          id="payment-otp"
          value={otp}
          onChange={(event) => {
            setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
            setError("");
          }}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg font-bold tracking-[0.35em] outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
          placeholder="000000"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={handleSendPayment}>Send payment</Button>
        <Button variant="secondary" onClick={onEdit}>Edit details</Button>
      </div>
    </div>
  );
}

function TransferReceipt({ payment }) {
  const amountValue = Number(payment?.amount || 0);
  const amount = Number.isFinite(amountValue) ? formatCurrency(amountValue) : payment?.amount;
  const transferDate = payment?.createdAt ? new Date(payment.createdAt) : new Date();
  const rows = [
    ["Receipt number", payment?.transactionId || "-"],
    ["Status", payment?.status === "failed" ? "Failed" : "Successful"],
    ["Date", transferDate.toLocaleString()],
    ["From", payment?.fromAccountType || formatAccountType(payment?.sourceAccountType)],
    ["Beneficiary", payment?.beneficiaryName || "-"],
    ["Routing number", payment?.routingNumber || "-"],
    ["Account number", payment?.accountNumber || "-"],
    ["Amount", amount || "-"],
    ["Reference", payment?.reference || "No reference"],
  ];

  return (
    <section className="mt-6 border border-slate-300 bg-white p-6" aria-label="Transfer receipt">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-emerald-800">OceanicFirst transfer receipt</p>
          <h3 className="mt-2 text-2xl font-black text-slate-950">{payment?.transactionId || "Transfer receipt"}</h3>
          <p className="mt-2 text-sm font-semibold text-slate-600">Generated {new Date().toLocaleString()}</p>
        </div>
        <span className="w-fit rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-800">
          Successful
        </span>
      </div>

      <dl className="mt-5 divide-y divide-slate-200">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 py-3 sm:grid-cols-[180px_1fr] sm:gap-5">
            <dt className="text-sm font-black text-slate-600">{label}</dt>
            <dd className="break-words text-base font-bold text-slate-950">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 border-t border-slate-200 pt-4 text-sm font-semibold leading-6 text-slate-600">
        Keep this receipt for your records. It confirms that OceanicFirst accepted and processed this transfer.
      </p>
    </section>
  );
}

function PaymentSuccess({ payment, onViewTransactions, onMakeAnotherPayment }) {
  const [receiptVisible, setReceiptVisible] = useState(false);
  const amountValue = Number(payment?.amount || 0);
  const amount = Number.isFinite(amountValue) ? formatCurrency(amountValue) : payment?.amount;

  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-700 bg-white shadow-sm" aria-label="Payment successful">
      <div className="bg-emerald-600 p-8 text-white">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-white text-emerald-700" aria-hidden="true">
            <CheckCircle2 className="h-12 w-12" />
          </span>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-emerald-100">Payment successful</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {amount} sent
            </h2>
            <p className="mt-2 text-lg font-semibold text-emerald-50">
              Your payment to {payment?.beneficiaryName || "the beneficiary"} was sent successfully.
            </p>
          </div>
        </div>
      </div>

      <dl className="grid gap-0 divide-y divide-slate-200 p-6">
        <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-5">
          <dt className="text-sm font-black text-slate-600">Transaction ID</dt>
          <dd className="font-bold text-slate-950">{payment?.transactionId || "-"}</dd>
        </div>
        <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-5">
          <dt className="text-sm font-black text-slate-600">Beneficiary</dt>
          <dd className="font-bold text-slate-950">{payment?.beneficiaryName || "-"}</dd>
        </div>
        <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-5">
          <dt className="text-sm font-black text-slate-600">From</dt>
          <dd className="font-bold text-slate-950">
            {payment?.fromAccountType || formatAccountType(payment?.sourceAccountType)}
          </dd>
        </div>
        <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-5">
          <dt className="text-sm font-black text-slate-600">Account</dt>
          <dd className="font-bold text-slate-950">
            Routing {payment?.routingNumber || "-"} / Account {payment?.accountNumber || "-"}
          </dd>
        </div>
        <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-5">
          <dt className="text-sm font-black text-slate-600">Ref</dt>
          <dd className="font-bold text-slate-950">{payment?.reference || "No reference"}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-3 border-t border-slate-200 p-6">
        <Button onClick={() => setReceiptVisible(true)}>Generate receipt</Button>
        <Button onClick={onViewTransactions}>View transactions</Button>
        <Button variant="secondary" onClick={onMakeAnotherPayment}>Make another payment</Button>
      </div>

      {receiptVisible && (
        <div className="border-t border-slate-200 p-6">
          <TransferReceipt payment={payment} />
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => window.print()}>Print receipt</Button>
            <Button variant="secondary" onClick={() => setReceiptVisible(false)}>Hide receipt</Button>
          </div>
        </div>
      )}
    </section>
  );
}

function TransactionDetails({ transaction, onBack }) {
  if (!transaction) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-lg font-black text-slate-950">No transaction selected.</p>
        <p className="mt-2 text-slate-700">Choose a previous transaction to see the full details.</p>
        <div className="mt-6">
          <Button onClick={onBack}>View transactions</Button>
        </div>
      </div>
    );
  }

  const successful = transaction.status === "successful" || transaction.status === "created";
  const direction = transaction.direction || "outgoing";
  const accountLabel = formatAccountType(transaction.sourceAccountType);
  const amountLabel = `${direction === "incoming" ? "+" : "-"}${formatCurrency(transaction.amount)}`;
  const rows = [
    ["Transaction ID", transaction.transactionId],
    ["Status", successful ? "Successful" : "Failed"],
    ["Account", accountLabel],
    ["Type", direction === "incoming" ? "Incoming" : "Outgoing"],
    ["Description", transaction.beneficiaryName],
    ...(transaction.routingNumber ? [["Routing number", transaction.routingNumber]] : []),
    ...(transaction.accountNumber ? [["Account number", transaction.accountNumber]] : []),
    ["Amount", amountLabel],
    ["Ref", transaction.reference || "No reference"],
    ["Date", new Date(transaction.createdAt).toLocaleString()],
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Transaction details">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-slate-500">Transaction ID</p>
          <h2 className="mt-1 break-words text-2xl font-black text-slate-950">{transaction.transactionId}</h2>
        </div>
        <span className={`w-fit rounded-full px-4 py-2 text-sm font-black ${
          successful ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
        }`}>
          {successful ? "Successful" : "Failed"}
        </span>
      </div>

      <dl className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-5">
            <dt className="text-sm font-black text-slate-600">{label}</dt>
            <dd className="break-words text-base font-bold text-slate-950">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <Button onClick={onBack}>Back to transactions</Button>
      </div>
    </section>
  );
}

function TransactionsTable({ user, onSelectTransaction }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      if (!user?.username) {
        setPayments([]);
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest(`/payments?username=${encodeURIComponent(user.username)}`);
        if (active) {
          setPayments(data.payments || []);
          setError("");
        }
      } catch (apiError) {
        if (active) {
          setError(apiError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPayments();

    return () => {
      active = false;
    };
  }, [user?.username]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="font-black text-slate-950">Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-l-4 border-red-700 bg-red-50 p-4 text-red-900" role="alert">
        <p className="font-black">Transactions not loaded</p>
        <p className="mt-1 text-sm font-semibold">{error}</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-lg font-black text-slate-950">No transfers yet.</p>
        <p className="mt-2 text-slate-700">Successful and failed transfers will appear here after you send a payment.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-[760px] w-full text-left text-sm">
        <caption className="sr-only">Transfer transactions</caption>
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th scope="col" className="px-5 py-4">Transaction ID</th>
            <th scope="col" className="px-5 py-4">Beneficiary</th>
            <th scope="col" className="px-5 py-4">Date</th>
            <th scope="col" className="px-5 py-4">Amount</th>
            <th scope="col" className="px-5 py-4">Ref</th>
            <th scope="col" className="px-5 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {payments.map((payment) => {
            const successful = payment.status === "successful" || payment.status === "created";
            const direction = payment.direction || "outgoing";
            const accountLabel = formatAccountType(payment.sourceAccountType);
            const amountLabel = `${direction === "incoming" ? "+" : "-"}${formatCurrency(payment.amount)}`;
            return (
              <tr
                key={payment.id}
                tabIndex={0}
                role="button"
                onClick={() => onSelectTransaction(payment)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectTransaction(payment);
                  }
                }}
                className="cursor-pointer transition hover:bg-emerald-50 focus:bg-emerald-50 focus:outline-none"
                aria-label={`Open transaction ${payment.transactionId}`}
              >
                <td className="px-5 py-4 font-black text-emerald-800">{payment.transactionId}</td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-950">{payment.beneficiaryName}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {payment.routingNumber && payment.accountNumber
                      ? `Routing ${payment.routingNumber} / Account ${payment.accountNumber}`
                      : `${accountLabel} / ${direction === "incoming" ? "Incoming" : "Outgoing"}`}
                  </p>
                </td>
                <td className="px-5 py-4 text-slate-700">{new Date(payment.createdAt).toLocaleString()}</td>
                <td className={`px-5 py-4 font-semibold ${direction === "incoming" ? "text-emerald-700" : "text-slate-950"}`}>
                  {amountLabel}
                </td>
                <td className="px-5 py-4 text-slate-700">{payment.reference || "-"}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    successful ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                  }`}>
                    {successful ? "Successful" : "Failed"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AccountDetailsView({ account, onViewTransactions, onStatements }) {
  if (!account) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-lg font-black text-slate-950">No account selected.</p>
      </div>
    );
  }

  const blocks = [
    ["Available balance", formatCurrency(account.balance)],
    ["Account details", `Routing number: ${account.routingNumber}. Account number: ${account.accountNumber}.`],
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {blocks.map(([title, body]) => (
        <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          <p className="mt-2 break-words leading-7 text-slate-700">{body}</p>
        </article>
      ))}
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={onViewTransactions}>View transactions</Button>
          <Button variant="secondary" onClick={onStatements}>Statements</Button>
        </div>
      </article>
    </div>
  );
}

function AccountsOverviewView({ accounts, onOpenAccount }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {accounts.map((account) => (
        <article key={account.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">{account.type}</h2>
              <p className="mt-2 text-3xl font-black text-slate-950">{formatCurrency(account.balance)}</p>
              <p className="mt-3 break-words text-sm font-semibold leading-6 text-slate-600">
                Routing {account.routingNumber} / Account {account.accountNumber}
              </p>
            </div>
            <Button variant="secondary" onClick={() => onOpenAccount(account.id)}>Details</Button>
          </div>
        </article>
      ))}
    </div>
  );
}

function ProfileView({ user }) {
  const address = user?.homeAddress
    ? [user.homeAddress.street, user.homeAddress.city, user.homeAddress.state, user.homeAddress.zipCode].filter(Boolean).join(", ")
    : "No address saved";
  const rows = [
    ["Full name", user?.fullName || "No name saved"],
    ["Username", user?.username || "No username saved"],
    ["Email address", user?.email || "No email saved"],
    ["Phone number", user?.phone || "No phone saved"],
    ["Home address", address],
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <dl className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-5">
            <dt className="text-sm font-black text-slate-600">{label}</dt>
            <dd className="break-words text-base font-bold text-slate-950">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function PageRenderer({
  pageName,
  context,
  onSelectPage,
  user,
  selectedAccount,
  pendingPayment,
  sentPayment,
  selectedTransaction,
  onReviewPayment,
  onRequestPaymentOtp,
  onSendPayment,
  onSelectTransaction,
  onSelectAccount,
}) {
  const page = pageContent[pageName] || pageContent.Home;
  const Icon = page.icon || FileText;
  const firstName = user?.fullName?.trim().split(/\s+/)[0] || "there";
  const pageTitle = pageName === "Accounts Overview"
    ? `Hi ${firstName}`
    : pageName === "Account Details" && selectedAccount ? selectedAccount.type : page.title;
  const pageSubtitle = pageName === "Accounts Overview"
    ? ""
    : pageName === "Account Details" && selectedAccount
      ? `Balance ${formatCurrency(selectedAccount.balance)}. Routing ${selectedAccount.routingNumber} / Account ${selectedAccount.accountNumber}.`
      : page.subtitle;
  const pageEyebrow = pageName === "Accounts Overview" ? "" : null;
  const area = context?.area || findPageContext(pageName).area;
  const group = context?.group || findPageContext(pageName).group;
  const nestedPages = group.pages.filter((page) => page !== pageName && !hiddenNavigationPages.has(page));

  return (
    <motion.main
      key={pageName}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-[680px]"
      aria-labelledby="page-title"
    >
      <div className="rounded-3xl border border-emerald-950 bg-emerald-500 p-5 text-black shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-black p-3 text-emerald-400 ring-1 ring-black" aria-hidden="true">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              {pageEyebrow !== "" && (
                <p className="mb-2 text-sm font-black uppercase tracking-wide text-emerald-950">{area.label} / {group.label}</p>
              )}
              <h1 id="page-title" className="text-2xl font-black tracking-tight lg:text-4xl">{pageTitle}</h1>
              {pageSubtitle && (
                <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-emerald-950 sm:text-base">{pageSubtitle}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {page.cta && <Button onClick={() => onSelectPage(getNextPageInGroup(pageName))}>{page.cta}</Button>}
            {page.secondary && <Button variant="secondary" onClick={() => onSelectPage(getPreviousPageInGroup(pageName))}>{page.secondary}</Button>}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <section className="space-y-6" aria-label="Page content">
          {nestedPages.length > 0 && !page.paymentStart && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-black text-slate-900">In {group.label}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white" aria-current="page">
                  {pageName}
                </span>
                {nestedPages.map((nestedPage) => (
                  <button
                    key={nestedPage}
                    onClick={() => onSelectPage(nestedPage)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  >
                    {nestedPage}
                  </button>
                ))}
              </div>
            </div>
          )}

          {page.search && (
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <label htmlFor="page-search" className="block text-sm font-semibold text-slate-800 mb-2">Search this section</label>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" aria-hidden="true" />
                <input id="page-search" className="w-full rounded-2xl border border-slate-300 py-3 pl-12 pr-4 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100" placeholder="Search by keyword, reference, or name" />
              </div>
            </div>
          )}

          {page.paymentStart && (
            <PaymentStartForm
              initialPayment={pendingPayment}
              accounts={getDisplayAccounts(user)}
              selectedAccount={selectedAccount}
              onReviewPayment={onReviewPayment}
            />
          )}

          {pageName === "Review Transfer" && (
            <PaymentReview
              payment={pendingPayment}
              onEdit={() => onSelectPage("Pay & transfer")}
              onRequestPaymentOtp={onRequestPaymentOtp}
              onSendPayment={onSendPayment}
            />
          )}

          {pageName === "Transfer Success" && (
            <PaymentSuccess
              payment={sentPayment}
              onViewTransactions={() => onSelectPage("View transaction")}
              onMakeAnotherPayment={() => onSelectPage("Pay & transfer")}
            />
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
            <form
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              aria-label={`${page.title} form`}
              onSubmit={(event) => {
                event.preventDefault();
                onSelectPage(getNextPageInGroup(pageName));
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                {page.form.map((field) => <Field key={field} label={field} />)}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button type="submit">{page.cta || "Continue"}</Button>
                {page.secondary && <Button variant="secondary" onClick={() => onSelectPage(getPreviousPageInGroup(pageName))}>{page.secondary}</Button>}
              </div>
            </form>
          )}

          {page.options && (
            <div className="grid gap-3 md:grid-cols-2" role="list" aria-label="Available options">
              {page.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSelectPage(pageContent[option] ? option : getNextPageInGroup(pageName))}
                  className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-emerald-500 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                >
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
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {page.transactions && (
            <TransactionsTable user={user} onSelectTransaction={onSelectTransaction} />
          )}

          {pageName === "Transaction Details" && (
            <TransactionDetails
              transaction={selectedTransaction}
              onBack={() => onSelectPage("View transaction")}
            />
          )}

          {pageName === "Account Details" && (
            <AccountDetailsView
              account={selectedAccount}
              onViewTransactions={() => onSelectPage("View transaction")}
              onStatements={() => onSelectPage("Statements")}
            />
          )}

          {pageName === "Accounts Overview" && (
            <AccountsOverviewView
              accounts={getDisplayAccounts(user)}
              onOpenAccount={(accountId) => {
                onSelectAccount(accountId);
                onSelectPage("Account Details");
              }}
            />
          )}

          {pageName === "Profile" && (
            <ProfileView user={user} />
          )}

          {page.blocks && !page.dashboard && pageName !== "Review Transfer" && pageName !== "Transfer Success" && pageName !== "Transaction Details" && pageName !== "Account Details" && pageName !== "Accounts Overview" && pageName !== "Profile" && (
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

      </div>
    </motion.main>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      return JSON.parse(window.localStorage.getItem(CURRENT_USER_STORAGE_KEY));
    } catch {
      return null;
    }
  });
  const [activePage, setActivePage] = useState(() => getPageFromUrl());
  const [activeAreaId, setActiveAreaId] = useState(() => findPageContext(getPageFromUrl()).area.id);
  const [query, setQuery] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [pendingPayment, setPendingPayment] = useState(null);
  const [sentPayment, setSentPayment] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState("savings");

  const activeArea = appAreas.find((area) => area.id === activeAreaId) || appAreas[0];
  const activeContext = findPageContext(activePage);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleAreas = normalizedQuery
    ? appAreas.map((area) => ({
      ...area,
      groups: area.groups.map((group) => ({
        ...group,
        pages: group.pages.filter((page) =>
          !hiddenNavigationPages.has(page) &&
          `${area.label} ${group.label} ${page}`.toLowerCase().includes(normalizedQuery)
        ),
      })).filter((group) => group.pages.length > 0),
    })).filter((area) => area.groups.length > 0)
    : [{
      ...activeArea,
      groups: activeArea.groups
        .filter((group) => group.id === activeContext.group.id)
        .map((group) => ({
          ...group,
          pages: group.pages.filter((page) => !hiddenNavigationPages.has(page)),
        })),
    }];

  useEffect(() => {
    updateBrowserHistory(getPageFromUrl(), "replace");

    function handlePopState(event) {
      const page = event.state?.page || getPageFromUrl();
      const nextContext = findPageContext(page);
      setActiveAreaId(nextContext.area.id);
      setActivePage(page);
      setNavOpen(false);
      setQuery("");
      setCollapsedGroups({});
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!currentUser || typeof window === "undefined") {
      return undefined;
    }

    let timeoutId;
    const activityEvents = ["click", "keydown", "mousemove", "scroll", "touchstart", "focus"];

    function expireSession() {
      setCurrentUser(null);
      setPendingPayment(null);
      setSentPayment(null);
      setSelectedTransaction(null);
      setSelectedAccountId("savings");
      window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      selectPage("Login");
    }

    function resetIdleTimer() {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(expireSession, SESSION_IDLE_TIMEOUT_MS);
    }

    resetIdleTimer();
    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetIdleTimer, { passive: true });
    });

    return () => {
      window.clearTimeout(timeoutId);
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetIdleTimer);
      });
    };
  }, [currentUser]);

  function selectPage(page) {
    const nextContext = findPageContext(page);
    setActiveAreaId(nextContext.area.id);
    setActivePage(page);
    setNavOpen(false);
    setQuery("");
    updateBrowserHistory(page);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }

  function toggleGroup(groupId) {
    setCollapsedGroups((current) => ({
      ...current,
      [groupId]: !current[groupId],
    }));
  }

  function reviewPayment(payment) {
    setPendingPayment(payment);
    setSentPayment(null);
    selectPage("Review Transfer");
  }

  function openTransactionDetails(transaction) {
    setSelectedTransaction(transaction);
    selectPage("Transaction Details");
  }

  function openAccountDetails(accountId) {
    setSelectedAccountId(accountId || "savings");
    selectPage("Account Details");
  }

  function logout() {
    setCurrentUser(null);
    setPendingPayment(null);
    setSentPayment(null);
    setSelectedTransaction(null);
    setSelectedAccountId("savings");
    window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    selectPage("Home");
  }

  async function requestPaymentOtp() {
    try {
      const data = await apiRequest("/payments/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser?.username,
        }),
      });

      return {
        ok: true,
        challenge: {
          challengeId: data.challengeId,
          maskedEmail: data.maskedEmail,
          expiresAt: data.expiresAt,
          firstLogin: Boolean(data.firstLogin),
        },
      };
    } catch (apiError) {
      return { ok: false, error: apiError.message };
    }
  }

  async function sendPayment({ otpChallengeId, otp } = {}) {
    if (!pendingPayment) {
      return { ok: false, error: "Enter payment details before sending." };
    }

    try {
      const data = await apiRequest("/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser?.username,
          ...pendingPayment,
          otpChallengeId,
          otp,
        }),
      });
      if (data.user) {
        setCurrentUser(data.user);
        window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(data.user));
      }
      setSentPayment(data.payment || pendingPayment);
      setPendingPayment(null);
      selectPage("Transfer Success");
      return { ok: true };
    } catch (apiError) {
      return { ok: false, error: apiError.message };
    }
  }

  async function createAccount({ fullName, email, phone, ssn, homeAddress, idVerification, idDocument, username, password }) {
    const cleanedName = fullName.trim();
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedPhone = phone.trim();
    const cleanedUsername = normalizeUsername(username);
    const cleanedSsn = ssn.trim();
    const cleanedAddress = {
      street: homeAddress.street.trim(),
      city: homeAddress.city.trim(),
      state: homeAddress.state.trim().toUpperCase(),
      zipCode: homeAddress.zipCode.trim(),
    };

    if (!cleanedName) {
      return { ok: false, error: "Enter your full name." };
    }

    if (!cleanedUsername) {
      return { ok: false, error: "Choose a username." };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
      return { ok: false, error: "Enter a valid email address." };
    }

    if (!cleanedPhone) {
      return { ok: false, error: "Enter your phone number." };
    }

    if (!/^\d{3}-?\d{2}-?\d{4}$/.test(cleanedSsn)) {
      return { ok: false, error: "Enter a valid 9-digit SSN." };
    }

    if (!cleanedAddress.street || !cleanedAddress.city || !cleanedAddress.state || !cleanedAddress.zipCode) {
      return { ok: false, error: "Enter your full home address." };
    }

    if (!idDocument) {
      return { ok: false, error: "Upload a driver's license or passport image." };
    }

    if (!idDocument.type?.startsWith("image/")) {
      return { ok: false, error: "Upload an image file for your driver's license or passport." };
    }

    const formData = new FormData();
    formData.append("fullName", cleanedName);
    formData.append("email", cleanedEmail);
    formData.append("phone", cleanedPhone);
    formData.append("username", cleanedUsername);
    formData.append("password", password);
    formData.append("ssn", cleanedSsn);
    formData.append("street", cleanedAddress.street);
    formData.append("city", cleanedAddress.city);
    formData.append("state", cleanedAddress.state);
    formData.append("zipCode", cleanedAddress.zipCode);
    formData.append("idType", idVerification.idType);
    formData.append("idDocument", idDocument);

    try {
      await apiRequest("/register", {
        method: "POST",
        body: formData,
      });

      setPendingPayment(null);
      setSentPayment(null);
      setSelectedTransaction(null);
      setSelectedAccountId("savings");

      return { ok: true };
    } catch (apiError) {
      return { ok: false, error: apiError.message };
    }
  }

  async function verifyLogin(username, password) {
    try {
      const data = await apiRequest("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      return {
        ok: true,
        challenge: {
          challengeId: data.challengeId,
          maskedEmail: data.maskedEmail,
          expiresAt: data.expiresAt,
          firstLogin: Boolean(data.firstLogin),
        },
      };
    } catch (apiError) {
      return { ok: false, error: apiError.message };
    }
  }

  async function verifyLoginOtp(username, challengeId, otp) {
    try {
      const data = await apiRequest("/login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, challengeId, otp }),
      });

      return { ok: true, user: data.user };
    } catch (apiError) {
      return { ok: false, error: apiError.message };
    }
  }

  function completeLogin(user) {
      setCurrentUser(user);
      setPendingPayment(null);
      setSentPayment(null);
      setSelectedTransaction(null);
      setSelectedAccountId("savings");
      window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      selectPage("Dashboard");
  }

  if (activePage === "Home") {
    if (currentUser) {
      return (
        <AccountHomePage
          onNavigate={selectPage}
          onLogout={logout}
          user={currentUser}
          selectedAccountId={selectedAccountId}
          onSelectAccount={setSelectedAccountId}
          onOpenAccountDetails={openAccountDetails}
        />
      );
    }

    return (
      <HomePage
        onSignIn={() => selectPage("Login")}
        onOpenAccount={() => selectPage("Open Account")}
      />
    );
  }

  if (activePage === "Login") {
    return (
      <LoginPage
        onVerifyLogin={verifyLogin}
        onVerifyLoginOtp={verifyLoginOtp}
        onCompleteLogin={completeLogin}
        onHome={() => selectPage("Home")}
        onOpenAccount={() => selectPage("Open Account")}
        onNavigate={selectPage}
      />
    );
  }

  if (activePage === "Open Account" && !currentUser) {
    return (
      <SignUpPage
        onCreateAccount={createAccount}
        onHome={() => selectPage("Home")}
        onSignIn={() => selectPage("Login")}
      />
    );
  }

  if (!currentUser) {
    return (
        <LoginPage
          onVerifyLogin={verifyLogin}
          onVerifyLoginOtp={verifyLoginOtp}
          onCompleteLogin={completeLogin}
          onHome={() => selectPage("Home")}
        onOpenAccount={() => selectPage("Open Account")}
        onNavigate={selectPage}
      />
    );
  }

  if (activePage === "Dashboard") {
    return (
      <AccountHomePage
        onNavigate={selectPage}
        onLogout={logout}
        user={currentUser}
        selectedAccountId={selectedAccountId}
        onSelectAccount={setSelectedAccountId}
        onOpenAccountDetails={openAccountDetails}
      />
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-950">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg">
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 w-full border-b border-emerald-950 bg-emerald-500">
        <div className="flex w-full items-center gap-3 px-4 py-3 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-4">
          <button className="shrink-0 rounded-2xl border border-black p-3 text-black lg:hidden" onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen} aria-controls="app-navigation" aria-label="Toggle navigation">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => selectPage("Dashboard")}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl text-left focus:outline-none focus:ring-4 focus:ring-emerald-200"
            aria-label="Open account dashboard"
          >
            <span className="shrink-0 rounded-2xl bg-black p-2 text-emerald-400" aria-hidden="true">
              <OceanicFirstLogoMark className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-black tracking-tight">OceanicFirst</p>
              <p className="text-xs font-bold text-emerald-950">Personal banking</p>
            </div>
          </button>
          <div className="hidden items-center gap-3 md:flex">
            <Button onClick={() => selectPage("Dashboard")}>Home</Button>
            {currentUser && <Button variant="secondary" onClick={logout}>Log out</Button>}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[300px_1fr] lg:px-8">
        <nav id="app-navigation" className={`${navOpen ? "block" : "hidden"} lg:block`} aria-label="Application pages">
          <div className="sticky top-24 rounded-3xl border border-emerald-950 bg-white p-4 shadow-sm">
            <label htmlFor="nav-search" className="block text-sm font-bold text-slate-900 mb-2">Find a screen</label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" aria-hidden="true" />
              <input
                id="nav-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search journeys and screens"
                className="w-full rounded-2xl border border-slate-300 py-3 pl-10 pr-3 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <div className="max-h-[calc(100vh-250px)] space-y-3 overflow-auto pr-1">
              {visibleAreas.map((area) => {
                const AreaIcon = area.icon;
                return (
                  <section key={area.id} aria-labelledby={`${area.id}-heading`}>
                    <h2 id={`${area.id}-heading`} className="mb-2 flex items-center gap-2 px-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <AreaIcon className="h-4 w-4" aria-hidden="true" /> {normalizedQuery ? area.label : activeContext.group.label}
                    </h2>
                    <div className="space-y-2">
	                      {area.groups.map((group) => {
	                        const expanded = normalizedQuery || !collapsedGroups[group.id];
	                        return (
	                          <div key={group.id} className="rounded-2xl border border-emerald-100 bg-emerald-50 p-2">
	                            <button
	                              type="button"
	                              onClick={() => toggleGroup(group.id)}
	                              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-black text-slate-900 hover:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100"
	                              aria-expanded={expanded}
	                            >
                              <span>{group.label}</span>
                              {expanded ? <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden="true" /> : <ChevronRight className="h-4 w-4 text-slate-500" aria-hidden="true" />}
                            </button>
                            {expanded && (
                              <ul className="mt-1 space-y-1">
                                {group.pages.map((page) => {
                                  const selected = activePage === page;
                                  return (
                                    <li key={page}>
                                      <button
                                        onClick={() => selectPage(page)}
                                        className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-emerald-100 ${selected ? "bg-black text-white" : "text-slate-700 hover:bg-white"}`}
                                        aria-current={selected ? "page" : undefined}
                                      >
                                        {page}
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </nav>

        <div id="main-content">
          <PageRenderer
            pageName={activePage}
            context={activeContext}
            onSelectPage={selectPage}
            user={currentUser}
            selectedAccount={getSelectedAccount(currentUser, selectedAccountId)}
            pendingPayment={pendingPayment}
            sentPayment={sentPayment}
            selectedTransaction={selectedTransaction}
            onReviewPayment={reviewPayment}
            onRequestPaymentOtp={requestPaymentOtp}
            onSendPayment={sendPayment}
            onSelectTransaction={openTransactionDetails}
            onSelectAccount={setSelectedAccountId}
          />
        </div>
      </div>
    </div>
  );
}
