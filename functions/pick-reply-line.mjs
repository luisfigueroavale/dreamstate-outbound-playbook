import { sha256Hex } from "../scripts/lib/sha256.mjs";

export function pickReplyLine(input = {}) {
  const lines = (input.lines ?? []).map((line) => String(line).trim()).filter(Boolean);
  if (lines.length === 0) {
    return { ok: false, reason: "no reply lines", line: null, index: null };
  }
  const commentId = String(input.comment_id ?? "");
  if (!commentId) {
    return { ok: false, reason: "missing comment id", line: null, index: null };
  }
  const index = Number.parseInt(sha256Hex(commentId).slice(0, 8), 16) % lines.length;
  return { ok: true, reason: null, line: lines[index], index };
}
