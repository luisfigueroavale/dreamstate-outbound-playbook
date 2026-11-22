import { lstatSync, mkdirSync, readlinkSync, rmSync, symlinkSync } from "node:fs";
import path from "node:path";

const links = [
  ["skills", ".agents/skills"],
  ["skills", ".claude/skills"],
];

for (const [target, linkPath] of links) {
  mkdirSync(path.dirname(linkPath), { recursive: true });
  let current = null;
  try {
    current = readlinkSync(linkPath);
  } catch {
    current = null;
  }
  if (current === `../${target}`) continue;
  try {
    const stat = lstatSync(linkPath);
    if (stat.isSymbolicLink()) rmSync(linkPath);
    else {
      console.log(`${linkPath} is a real directory. Leave it in place.`);
      continue;
    }
  } catch {
    // missing is fine
  }
  symlinkSync(`../${target}`, linkPath);
  console.log(`${linkPath} -> ../${target}`);
}
