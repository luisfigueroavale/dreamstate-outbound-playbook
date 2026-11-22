import { readFileSync } from "node:fs";

const DASH = /[\u2013\u2014]/;

export function loadWordList(file) {
  const body = JSON.parse(readFileSync(file, "utf8"));
  return (body.encoded ?? []).map((item) => Buffer.from(item, "base64").toString("utf8"));
}

export function dashLines(text) {
  return String(text).split(/\n/).flatMap((line, index) => (DASH.test(line) ? [index + 1] : []));
}

export function findListedWords(text, words) {
  const hay = String(text).toLowerCase();
  const found = [];
  for (const word of words) {
    const escaped = word.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`).test(hay)) found.push(word);
  }
  return found;
}
