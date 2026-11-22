import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { lstatSync, mkdirSync, mkdtempSync, readFileSync, readlinkSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

function run(script) {
  return spawnSync(process.execPath, [script], { encoding: "utf8" });
}

test("quickstart and plan-install print and do not call out", () => {
  for (const script of ["scripts/quickstart.mjs", "scripts/plan-install.mjs"]) {
    const result = run(script);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /does not make them|does not call/i);
    assert.equal(result.stdout.includes("PRIVATE"), false);
  }
  const joined = ["scripts/quickstart.mjs", "scripts/plan-install.mjs", "scripts/demo.mjs", "scripts/cards.mjs", "scripts/grade-stack.mjs"].join(" ");
  assert.ok(joined.includes("quickstart"));
});

test("skills link repair stays inside a temp copy", () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), "skills-link-"));
  try {
    mkdirSync(path.join(dir, "skills"), { recursive: true });
    const result = spawnSync(process.execPath, ["scripts/skills-link.mjs", dir], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readlinkSync(path.join(dir, ".agents/skills")), "../skills");
    const again = spawnSync(process.execPath, ["scripts/skills-link.mjs", dir], { encoding: "utf8" });
    assert.equal(again.status, 0, again.stderr);
    rmSync(path.join(dir, ".claude/skills"));
    mkdirSync(path.join(dir, ".claude/skills"));
    writeFileSync(path.join(dir, ".claude/skills/kept.txt"), "keep\n");
    const third = spawnSync(process.execPath, ["scripts/skills-link.mjs", dir], { encoding: "utf8" });
    assert.equal(third.status, 0, third.stderr);
    const kept = path.join(dir, ".claude/skills");
    assert.equal(lstatSync(kept).isSymbolicLink(), false);
    assert.equal(readFileSync(path.join(kept, "kept.txt"), "utf8"), "keep\n");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
