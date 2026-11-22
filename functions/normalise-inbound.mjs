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

function charsOk(value, allowDash) {
  if (!value) return false;
  for (const char of value) {
    const code = char.codePointAt(0);
    const digit = code >= 48 && code <= 57;
    const letter = code >= 97 && code <= 122;
    if (letter || digit) continue;
    if (allowDash && char === "-") continue;
    return false;
  }
  return true;
}

function labelOk(label, last) {
  if (!label || label.length > 63) return false;
  if (label.startsWith("-") || label.endsWith("-")) return false;
  if (!charsOk(label, true)) return false;
  if (!last) return true;
  if (label.startsWith("xn--")) return label.length >= 6 && charsOk(label.slice(4), false);
  if (label.length < 2) return false;
  return charsOk(label, false) && ![...label].some((char) => char >= "0" && char <= "9");
}

function hostOk(host) {
  if (!host || host.includes("..") || host.startsWith(".") || host.endsWith(".")) return false;
  const labels = host.split(".");
  if (labels.length < 2) return false;
  const allNumeric = labels.every((label) => label.length > 0 && [...label].every((char) => char >= "0" && char <= "9"));
  if (allNumeric) return false;
  return labels.every((label, index) => labelOk(label, index === labels.length - 1));
}

function looksLikeEmail(value) {
  const at = value.indexOf("@");
  if (at < 1 || at !== value.lastIndexOf("@")) return false;
  const local = value.slice(0, at);
  const host = value.slice(at + 1);
  if (!local || local.includes("..") || local.startsWith(".") || local.endsWith(".")) return false;
  if (!/^[a-z0-9][a-z0-9._%+-]*$/.test(local)) return false;
  return hostOk(host);
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
