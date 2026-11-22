import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve("skills");
const names = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const name of names) {
  const text = readFileSync(path.join(root, name, "SKILL.md"), "utf8");
  const description = text.match(/^description:\s*"(.+)"/m)?.[1] ?? "";
  console.log(`${name}: ${description}`);
}
