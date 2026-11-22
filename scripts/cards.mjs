import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const WIDTH = 1080;
const HEIGHT = 1350;
const MARGIN = 72;

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderCard(card) {
  const boxes = card.boxes ?? [];
  if (boxes.length > 6) throw new Error(`${card.id} has more than six boxes`);
  const top = 196;
  const gap = 16;
  const bottom = 1240;
  const boxHeight = boxes.length
    ? Math.floor((bottom - top - gap * (boxes.length - 1)) / boxes.length)
    : 160;
  const titleSize = card.title.length > 42 ? 32 : 36;
  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img">`);
  parts.push("<title>" + escapeXml(card.title) + "</title>");
  parts.push("<style>");
  parts.push(":root{--color-bg:#ffffff;--color-fg:#111111;--color-accent:#111111;--color-muted:#555555;--font-sans:Georgia,serif}");
  parts.push("text{font-family:var(--font-sans)}");
  parts.push("</style>");
  parts.push(`<rect width="${WIDTH}" height="${HEIGHT}" fill="var(--color-bg)"/>`);
  parts.push(`<text x="${MARGIN}" y="84" fill="var(--color-fg)" font-size="${titleSize}">${escapeXml(card.title)}</text>`);
  const subtitle = wrap(card.subtitle ?? "", 58).slice(0, 2);
  subtitle.forEach((line, index) => {
    parts.push(`<text x="${MARGIN}" y="${128 + index * 28}" fill="var(--color-muted)" font-size="22">${escapeXml(line)}</text>`);
  });
  boxes.forEach((box, index) => {
    const y = top + index * (boxHeight + gap);
    const lines = (box.lines ?? []).slice(0, 3);
    parts.push(`<rect x="${MARGIN}" y="${y}" width="${WIDTH - MARGIN * 2}" height="${boxHeight}" fill="var(--color-bg)" stroke="var(--color-fg)" stroke-width="2"/>`);
    parts.push(`<text x="${MARGIN + 24}" y="${y + 42}" fill="var(--color-fg)" font-size="28">${box.n}. ${escapeXml(box.name)}</text>`);
    lines.forEach((line, lineIndex) => {
      parts.push(`<text x="${MARGIN + 24}" y="${y + 78 + lineIndex * 26}" fill="var(--color-muted)" font-size="20">${escapeXml(line)}</text>`);
    });
  });
  parts.push(`<text x="${MARGIN}" y="${HEIGHT - 48}" fill="var(--color-fg)" font-size="20">${escapeXml(card.footer ?? "")}</text>`);
  parts.push("</svg>");
  return parts.join("\n") + "\n";
}

function wrap(text, size) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > size && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function main() {
  const dir = path.resolve("cards");
  const files = readdirSync(dir).filter((name) => name.endsWith(".json")).sort();
  for (const name of files) {
    const card = JSON.parse(readFileSync(path.join(dir, name), "utf8"));
    const svg = renderCard(card);
    writeFileSync(path.join(dir, `${card.id}.svg`), svg);
  }
}

if (import.meta.url === new URL(`file://${process.argv[1]}`).href || process.argv[1]?.endsWith("cards.mjs")) {
  main();
}
