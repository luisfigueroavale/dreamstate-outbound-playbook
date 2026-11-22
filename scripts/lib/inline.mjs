import { readFileSync } from "node:fs";

export function inlineFunction(file) {
  let text = readFileSync(file, "utf8");
  const needsSha = text.includes("sha256Hex");
  text = text.replace(/^import .*$/gm, "").replace(/^export /gm, "").trim();
  if (needsSha) {
    const sha = readFileSync(new URL("./sha256.mjs", import.meta.url), "utf8").replace(/^export /gm, "").trim();
    text = `${sha}\n\n${text}`;
  }
  return `${text}\n`;
}

export function objectSchema(required, properties) {
  return {
    type: "object",
    additionalProperties: false,
    required,
    properties,
  };
}

export function nullable(type) {
  return { anyOf: [{ type }, { type: "null" }] };
}
