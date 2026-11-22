import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { classifyCrmMatch } from "../functions/classify-crm-match.mjs";
import { checkDmText } from "../functions/check-dm-text.mjs";
import { gradeEmailStack } from "../functions/grade-email-stack.mjs";
import { mergeKeywordRule } from "../functions/merge-keyword-rule.mjs";
import { rollUpEngagers } from "../functions/roll-up-engagers.mjs";
import { tierEngagers } from "../functions/tier-engagers.mjs";
import { runChecks } from "./check.mjs";
import { buildCallPlans } from "./lib/call-plans.mjs";
import { buildGraphs } from "./lib/graphs.mjs";
import { loadWordList } from "./lib/words.mjs";

const AS_OF = "2026-11-16T12:00:00.000Z";
const tiers = JSON.parse(readFileSync(new URL("../settings/tiers.json", import.meta.url), "utf8"));

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

function copyTree() {
  const dir = mkdtempSync(path.join(tmpdir(), "playbook-"));
  const skipTop = new Set([".git", "node_modules", "output", "work"]);
  cpSync(repoRoot, dir, {
    recursive: true,
    filter(entryPath) {
      const rel = path.relative(repoRoot, entryPath);
      if (!rel || rel === ".") return true;
      const top = rel.split(path.sep)[0];
      if (skipTop.has(top)) return false;
      if (rel === ".banned-terms.local") return false;
      return true;
    },
  });
  writeFileSync(path.join(dir, ".banned-terms.local"), "zzplaceholder\n");
  return dir;
}

function ids(plan) {
  return plan.steps.map((item) => item.id);
}

test("call plan lists rules before replace and searches before sync", () => {
  const plans = buildCallPlans();
  const keyword = ids(plans["comment-keyword-share"]);
  assert.ok(keyword.indexOf("list-rules") < keyword.indexOf("replace-rules"));
  assert.equal(plans["comment-keyword-share"].steps.find((item) => item.id === "replace-rules").params.rules, "FROM_MERGE");
  const form = plans["form-to-crm"];
  const order = ids(form);
  assert.ok(order.indexOf("search-crm") < order.indexOf("sync-one"));
  assert.ok(order.indexOf("assert-record") < order.indexOf("sync-one"));
  const attach = form.steps.find((item) => item.id === "attach-webhook");
  assert.equal(attach.needs_yes, true);
  assert.equal(attach.params.binding_spec.input_bindings.require_secret.value, true);
  assert.equal(attach.params.binding_spec.definition_id, "source.webhook_source");
});

test("a new class cannot sync until a record id exists", () => {
  const created = classifyCrmMatch({ email: "ada@northledger.example", records: [] });
  assert.equal(created.class, "new");
  assert.equal(created.next, "assert_record");
  assert.equal(created.sync_allowed, false);
  assert.equal(created.record_id, null);
  const ready = classifyCrmMatch({ email: "ben@clearbooks.example", records: [{ id: "rec-ben", email: "ben@clearbooks.example" }] });
  assert.equal(ready.sync_allowed, true);
  assert.equal(ready.next, "sync");
});

test("kept keyword rules stay byte-identical, including dm_message", () => {
  const kept = {
    id: "11111111-1111-4111-8111-111111111111",
    keywords: ["close", "month end"],
    dm_enabled: true,
    dm_message: "hello from the kept rule",
    comment_reply_sent_enabled: false,
    comment_reply_sent: "thanks for the note",
  };
  const other = { id: "22222222-2222-4222-8222-222222222222", keywords: ["hiring"], dm_message: "staff line" };
  const merged = mergeKeywordRule({ expected_revision: 4, rules: [kept, other], rule: { keywords: ["books"], dm_message: "new share" } });
  assert.equal(merged.ok, true);
  const returned = merged.rules.find((rule) => rule.id === kept.id);
  assert.equal(JSON.stringify(returned), JSON.stringify(kept));
  assert.equal(merged.rules.some((rule) => rule.id), true);
  assert.equal(merged.rules.some((rule) => !rule.id), true);
});

test("editing an existing keyword rule is reported as changed", () => {
  const rule = { id: "11111111-1111-4111-8111-111111111111", keywords: ["close"], dm_message: "stay" };
  const edited = mergeKeywordRule({ expected_revision: 2, rules: [rule], rule: { id: rule.id, keywords: ["books"] } });
  assert.deepEqual(edited.diff.changed, [rule.id]);
  assert.equal(edited.rules[0].dm_message, "stay");
  assert.deepEqual(edited.rules[0].keywords, ["books"]);
  assert.equal(mergeKeywordRule({ rules: [rule], rule: { keywords: ["books"] } }).ok, false);
});

test("editing a keyword rule applies the other fields the caller sent", () => {
  const rule = {
    id: "11111111-1111-4111-8111-111111111111",
    keywords: ["close"],
    dm_enabled: true,
    dm_message: "old share",
    comment_reply_sent: "thanks for the note",
  };
  const edited = mergeKeywordRule({
    expected_revision: 3,
    rules: [rule],
    rule: { id: rule.id, keywords: ["close"], dm_message: "new share" },
  });
  assert.equal(edited.ok, true);
  assert.equal(edited.rules[0].dm_message, "new share");
  assert.equal(edited.rules[0].dm_enabled, true);
  assert.equal(edited.rules[0].comment_reply_sent, "thanks for the note");
  assert.deepEqual(edited.diff.changed, [rule.id]);
});

test("provider managed domains are skipped and missing DNS or a high cap is a hold", () => {
  const graded = gradeEmailStack({
    rules: { ...tiers, spf_observed: true, dkim_observed: true, dmarc_observed: true, bounce_7d_max: 0.02, warmup_min_days: 14, daily_cap_max: 40 },
    domains: [
      { domain: "hosted.example", provider_managed: true, spf: "missing", dkim: "missing", dmarc: "missing" },
      { domain: "mail.ledgerlight.example", provider_managed: false, spf: "missing", dkim: "observed", dmarc: "observed" },
      { domain: "send.ledgerlight.example", provider_managed: false, spf: "observed", dkim: "missing", dmarc: "observed" },
    ],
    mailboxes: [
      { id: "mb-cap", domain: "mail.ledgerlight.example", bounce_7d: 0.01, warmup_days: 20, daily_cap: 80 },
    ],
  });
  assert.equal(graded.domains[0].status, "skipped");
  assert.match(graded.domains[1].holds.map((hold) => hold.reason).join(" "), /SPF/);
  assert.match(graded.domains[2].holds.map((hold) => hold.reason).join(" "), /DKIM/);
  assert.match(graded.mailboxes[0].holds.map((hold) => hold.reason).join(" "), /daily cap/);
});

test("tier edges at 75 and 55 hold a teammate", () => {
  const rows = tierEngagers({
    as_of: AS_OF,
    rules: tiers,
    people: [
      { person_id: "edge-top", fit: 75, comment_count: 1, distinct_posts: 1, last_seen: AS_OF },
      { person_id: "edge-mid", fit: 55, comment_count: 0, distinct_posts: 1, last_seen: AS_OF },
      { person_id: "edge-team", fit: 99, comment_count: 2, distinct_posts: 3, last_seen: AS_OF },
    ],
    exclude_person_ids: ["edge-team"],
  }).rows;
  assert.equal(rows.find((row) => row.person_id === "edge-top").tier, "1");
  assert.equal(rows.find((row) => row.person_id === "edge-mid").tier, "2");
  assert.equal(rows.find((row) => row.person_id === "edge-team").tier, "hold");
});

test("DM text catches an open token, an http link, and a banned word", () => {
  const base = { first_name: "Ada", link: "https://files.ledgerlight.example/a", word_limit: 20, banned_words: ["picnic"] };
  assert.match(checkDmText({ ...base, text: "See {{ }} today" }).reason, /unresolved|not allowed/);
  assert.match(checkDmText({ ...base, text: "{{link}}", link: "http://files.ledgerlight.example/a" }).reason, /https/);
  assert.match(checkDmText({ ...base, text: "A picnic {{link}}" }).reason, /banned word/);
});

test("roll up skips a post with no id, keeps the longer name, and reruns match", () => {
  const input = {
    posts: [{ id: "", is_repost: false }, { id: "post-01", is_repost: false }],
    engagements: [
      { person_id: "p", post_id: "", kind: "reaction", reaction: "like", name: "Skip", at: "2026-11-10T12:00:00.000Z" },
      { person_id: "p", post_id: "post-01", kind: "reaction", reaction: "like", name: "Jo", at: "2026-11-10T12:00:00.000Z" },
      { person_id: "p", post_id: "post-01", kind: "reaction", reaction: "like", name: "Jordan Hale", at: "2026-11-10T12:00:00.000Z" },
    ],
  };
  const once = rollUpEngagers(input);
  const twice = rollUpEngagers(input);
  assert.equal(once.touches.length, 1);
  assert.equal(once.people[0].name, "Jordan Hale");
  assert.equal(JSON.stringify(once), JSON.stringify(twice));
});

test("graph code nodes call the function and map a payload", () => {
  const graphs = buildGraphs();
  const plans = buildCallPlans();
  assert.equal(graphs["form-to-crm"].document.nodes.some((node) => node.id === "classify-crm-match"), false);
  assert.equal(graphs["post-engagers-rollup"].document.nodes.some((node) => node.id === "tier-engagers"), false);
  assert.equal(graphs["comment-keyword-share"].document.nodes.some((node) => node.id === "pick-reply-line"), false);
  assert.equal(plans["form-to-crm"].steps.some((item) => item.local_function === "classify-crm-match"), true);
  assert.equal(plans["post-engagers-rollup"].steps.some((item) => item.local_function === "tier-engagers"), true);
  assert.equal(plans["comment-keyword-share"].steps.some((item) => item.local_function === "pick-reply-line"), true);
  const form = plans["form-to-crm"];
  const formOrder = form.steps.map((item) => item.id);
  assert.ok(formOrder.indexOf("list-objects") < formOrder.indexOf("assert-record"));
  assert.equal(form.steps.find((item) => item.id === "assert-record").params.object_key, "RESOLVE_AT_RUN_TIME");
  assert.equal(plans["post-engagers-rollup"].steps.find((item) => item.id === "write-tier").params.subject_id, "PERSON_ID");
  assert.equal(plans["comment-keyword-share"].steps.find((item) => item.id === "log").params.external_key, "COMMENT_ID");
  for (const graph of Object.values(graphs)) {
    const codes = graph.document.nodes.filter((node) => node.data.subtype === "code");
    assert.ok(codes.length > 0);
    for (const node of codes) {
      const source = node.data.config.source;
      assert.match(source, /result = /);
      assert.equal(node.data.config.input_mappings.payload.provenance.kind, "endpoint_schema");
      assert.equal(node.data.config.output_schema.additionalProperties, false);
      const upstream = graph.document.edges.find((edge) => edge.target === node.id);
      const previous = graph.document.nodes.find((item) => item.id === upstream?.source);
      if (previous?.data.subtype === "code") {
        assert.equal(node.data.config.input_mappings.payload.path, `${previous.id}.result`);
        assert.notEqual(node.data.config.input_mappings.payload.path, "trigger.payload");
      }
    }
  }
});

test("strict check fails when the banned file is missing", () => {
  const dir = copyTree();
  rmSync(path.join(dir, ".banned-terms.local"));
  const result = runChecks(dir, { strict: true });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((message) => message.includes("--strict")));
  rmSync(dir, { recursive: true, force: true });
});

test("check rejects a banned term and a dash in a temp copy", () => {
  const banned = copyTree();
  writeFileSync(path.join(banned, ".banned-terms.local"), "zzmarker\n");
  writeFileSync(path.join(banned, "docs/scratch.md"), "A zzmarker slipped in.\n");
  const bannedResult = runChecks(banned, { strict: true });
  assert.ok(bannedResult.errors.some((message) => message.includes("banned term")));
  rmSync(banned, { recursive: true, force: true });

  const dashed = copyTree();
  writeFileSync(path.join(dashed, "docs/scratch.md"), "A line " + String.fromCharCode(0x2014) + " here\n");
  const dashResult = runChecks(dashed, { strict: false });
  assert.ok(dashResult.errors.some((message) => message.includes("dash")));
  rmSync(dashed, { recursive: true, force: true });
});

test("check rejects a write without a yes, an enabled graph, a profile id, a vendor id, and drift", () => {
  const writer = copyTree();
  const planPath = path.join(writer, "automations/form-to-crm/call-plan.json");
  const plan = JSON.parse(readFileSync(planPath, "utf8"));
  plan.steps.find((item) => item.effect === "write").needs_yes = false;
  writeFileSync(planPath, JSON.stringify(plan, null, 2) + "\n");
  assert.ok(runChecks(writer, { strict: false }).errors.some((message) => message.includes("needs a yes")));
  rmSync(writer, { recursive: true, force: true });

  const enabled = copyTree();
  const graphPath = path.join(enabled, "automations/form-to-crm/graph.json");
  const graph = JSON.parse(readFileSync(graphPath, "utf8"));
  graph.status = "enabled";
  writeFileSync(graphPath, JSON.stringify(graph, null, 2) + "\n");
  assert.ok(runChecks(enabled, { strict: false }).errors.some((message) => message.includes("not disabled")));
  rmSync(enabled, { recursive: true, force: true });

  const profile = copyTree();
  const marker = ["linkedin.com", "in", "someone"].join("/");
  writeFileSync(path.join(profile, "docs/scratch.md"), marker + "\n");
  assert.ok(runChecks(profile, { strict: false }).errors.some((message) => message.includes("LinkedIn")));
  rmSync(profile, { recursive: true, force: true });

  const vendor = copyTree();
  const vendorId = loadWordList(path.join(vendor, "scripts/vendor-ids.json"))[0];
  writeFileSync(path.join(vendor, "docs/scratch.md"), `See ${vendorId} in a file.\n`);
  assert.ok(runChecks(vendor, { strict: false }).errors.some((message) => message.includes("vendor")));
  rmSync(vendor, { recursive: true, force: true });

  const drift = copyTree();
  const driftedPath = path.join(drift, "automations/form-to-crm/graph.json");
  const drifted = JSON.parse(readFileSync(driftedPath, "utf8"));
  drifted.summary = drifted.summary + " extra";
  writeFileSync(driftedPath, JSON.stringify(drifted, null, 2) + "\n");
  assert.ok(runChecks(drift, { strict: false }).errors.some((message) => message.includes("does not match the generator")));
  rmSync(drift, { recursive: true, force: true });
});
