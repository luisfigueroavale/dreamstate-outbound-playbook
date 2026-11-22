import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
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

test("skills link repair is idempotent", () => {
  const result = run("scripts/skills-link.mjs");
  assert.equal(result.status, 0, result.stderr);
  const again = run("scripts/skills-link.mjs");
  assert.equal(again.status, 0, again.stderr);
});
