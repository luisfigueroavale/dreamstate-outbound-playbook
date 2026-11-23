const TOKEN = /\{\{\s*([a-z0-9_]+)\s*\}\}/gi;

function wordsOf(text) {
  return String(text).trim().split(/\s+/).filter(Boolean);
}

export function checkDmText(input = {}) {
  const template = String(input.text ?? "");
  const firstName = String(input.first_name ?? "").trim();
  const link = String(input.link ?? "").trim();
  const limit = Number(input.word_limit ?? 80);
  const banned = (input.banned_words ?? []).map((word) => String(word).toLowerCase());
  const used = new Set();
  for (const match of template.matchAll(TOKEN)) used.add(match[1].toLowerCase());
  if (used.has("first_name") && !firstName) {
    return { ok: false, dropped: true, reason: "line dropped because the row has no first name", text: null };
  }
  const allowed = new Set(["link", "first_name"]);
  for (const token of used) {
    if (!allowed.has(token)) {
      return { ok: false, dropped: false, reason: `token {{${token}}} is not allowed`, text: null };
    }
  }
  if (!link.startsWith("https://")) {
    return { ok: false, dropped: false, reason: "link must start with https://", text: null };
  }
  let text = template.replace(TOKEN, (_, name) => (name.toLowerCase() === "link" ? link : firstName));
  if (/\{\{/.test(text)) {
    return { ok: false, dropped: false, reason: "a token was left unresolved", text: null };
  }
  const count = wordsOf(text).length;
  if (count > limit) {
    return { ok: false, dropped: false, reason: `text is ${count} words and the limit is ${limit}`, text: null };
  }
  const hay = text.toLowerCase();
  for (const word of banned) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`).test(hay)) {
      return { ok: false, dropped: false, reason: "text uses a banned word", text: null };
    }
  }
  return { ok: true, dropped: false, reason: null, text, word_count: count };
}
