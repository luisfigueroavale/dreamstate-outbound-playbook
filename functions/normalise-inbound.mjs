import { sha256Hex } from "../scripts/lib/sha256.mjs";

// Consumer mailbox domains. The class is "personal". Work domains are everything else.
const PERSONAL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "ymail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "mail.com",
]);

function looksLikeEmail(value) {
  const at = value.indexOf("@");
  if (at < 1 || at !== value.lastIndexOf("@")) return false;
  const local = value.slice(0, at);
  const host = value.slice(at + 1);
  const dot = host.lastIndexOf(".");
  if (dot < 1 || host.length - dot < 3) return false;
  if (local.includes("..") || host.includes("..") || host.startsWith(".") || host.endsWith(".")) return false;
  return /^[a-z0-9][a-z0-9._%+-]*$/.test(local) && /^[a-z0-9][a-z0-9.-]*$/.test(host);
}

export function normaliseInbound(input = {}) {
  const formId = String(input.form_id ?? "").trim();
  const raw = String(input.email ?? "").trim().toLowerCase();
  if (!raw) {
    return { ok: false, reason: "missing email", email: null, mailbox_class: null, form_id: formId, idempotency_key: null };
  }
  if (!looksLikeEmail(raw)) {
    return { ok: false, reason: "malformed email", email: null, mailbox_class: null, form_id: formId, idempotency_key: null };
  }
  const domain = raw.slice(raw.lastIndexOf("@") + 1);
  const mailboxClass = PERSONAL_DOMAINS.has(domain) ? "personal" : "work";
  return {
    ok: true,
    reason: null,
    email: raw,
    mailbox_class: mailboxClass,
    form_id: formId,
    idempotency_key: sha256Hex(`${raw}\n${formId}`),
  };
}
