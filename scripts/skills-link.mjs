import { lstatSync, mkdirSync, readlinkSync, rmSync, symlinkSync } from "node:fs";
import path from "node:path";

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const links = [
  ["skills", ".agents/skills"],
  ["skills", ".claude/skills"],
];

for (const [target, linkPath] of links) {
  const full = path.join(root, linkPath);
  mkdirSync(path.dirname(full), { recursive: true });
  let current = null;
  try {
    current = readlinkSync(full);
  } catch {
    current = null;
  }
  if (current === `../${target}`) continue;
  try {
    const stat = lstatSync(full);
    if (stat.isSymbolicLink()) rmSync(full);
    else {
      console.log(`${linkPath} is a real directory. Leave it in place.`);
      continue;
    }
  } catch {
    // missing is fine
  }
  symlinkSync(`../${target}`, full);
  console.log(`${linkPath} -> ../${target}`);
}
