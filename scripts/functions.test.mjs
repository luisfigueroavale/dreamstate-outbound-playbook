import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createHash } from "node:crypto";
import { checkDmText } from "../functions/check-dm-text.mjs";
import { checkQuickstart } from "../functions/check-quickstart.mjs";
import { classifyCrmMatch } from "../functions/classify-crm-match.mjs";
import { gradeEmailStack } from "../functions/grade-email-stack.mjs";
import { mergeKeywordRule } from "../functions/merge-keyword-rule.mjs";
import { normaliseInbound } from "../functions/normalise-inbound.mjs";
import { pickReplyLine } from "../functions/pick-reply-line.mjs";
import { rollUpEngagers, touchKey } from "../functions/roll-up-engagers.mjs";
import { tierEngagers } from "../functions/tier-engagers.mjs";
import { sha256Hex } from "./lib/sha256.mjs";
import { runSample } from "./lib/sample-run.mjs";
import { buildEngagements, FORM_ID, WORKSPACE_ID } from "../examples/sample-week/week.mjs";

const tiers = JSON.parse(readFileSync(new URL("../settings/tiers.json", import.meta.url), "utf8"));
const stackRules = JSON.parse(readFileSync(new URL("../settings/stack-rules.json", import.meta.url), "utf8"));

test("sha256 matches node crypto", () => {
  assert.equal(sha256Hex("abc"), createHash("sha256").update("abc").digest("hex"));
});

test("normalise rejects missing and malformed, marks personal, and keys the email", () => {
  assert.equal(normaliseInbound({ email: "  ", form_id: FORM_ID }).reason, "missing email");
  assert.equal(normaliseInbound({ email: "not-an-email", form_id: FORM_ID }).reason, "malformed email");
  assert.equal(normaliseInbound({ email: "ada@acme.12", form_id: FORM_ID }).reason, "malformed email");
  const personal = normaliseInbound({ email: "Dana@gmail.com", form_id: FORM_ID });
  assert.equal(personal.mailbox_class, "personal");
  assert.equal(personal.email, "dana@gmail.com");
  const work = normaliseInbound({ email: "Ada@Northledger.example", form_id: FORM_ID });
  assert.equal(work.mailbox_class, "work");
  assert.equal(work.idempotency_key, sha256Hex("ada@northledger.example\n" + FORM_ID));
});

test("classify allows one sync only for new or one exact email", () => {
  assert.equal(classifyCrmMatch({ status: "error", error: "timeout", records: [] }).class, "failed");
  assert.equal(classifyCrmMatch({ email: "a@b.example", records: [] }).class, "new");
  const existing = classifyCrmMatch({ email: "a@b.example", records: [{ id: "1", email: "A@b.example" }] });
  assert.equal(existing.class, "existing");
  assert.equal(existing.sync_allowed, true);
  assert.equal(existing.record_id, "1");
  assert.equal(classifyCrmMatch({ email: "a@b.example", records: [{ id: "1", email: "a@b.example" }, { id: "2", email: "a@b.example" }] }).class, "ambiguous");
  const named = classifyCrmMatch({ email: "a@b.example", records: [{ id: "1", email: "", name: "Ada" }] });
  assert.equal(named.class, "ambiguous");
  assert.equal(named.sync_allowed, false);
});

test("roll up skips reposts, team, and a repeated reaction", () => {
  const rolled = rollUpEngagers({
    posts: [
      { id: "post-01", is_repost: false },
      { id: "", is_repost: false },
      { id: "post-07", is_repost: true },
    ],
    exclude_person_ids: ["w-team"],
    engagements: [
      { person_id: "p", post_id: "post-01", kind: "reaction", reaction: "like", name: "Jo", at: "2026-11-10T12:00:00.000Z" },
      { person_id: "p", post_id: "post-01", kind: "reaction", reaction: "like", name: "Jordan Hale", at: "2026-11-10T12:00:00.000Z" },
      { person_id: "p", post_id: "post-01", kind: "comment", reaction: "like", name: "Jo", at: "2026-11-11T12:00:00.000Z" },
      { person_id: "w-team", post_id: "post-01", kind: "reaction", reaction: "like", name: "Team", at: "2026-11-11T12:00:00.000Z" },
      { person_id: "p", post_id: "post-07", kind: "reaction", reaction: "like", name: "Jo", at: "2026-11-11T12:00:00.000Z" },
    ],
  });
  assert.equal(rolled.touches.length, 2);
  assert.equal(touchKey("p", "post-01", "comment", "like").endsWith("|"), true);
  assert.equal(rolled.people.length, 1);
  assert.equal(rolled.people[0].name, "Jordan Hale");
  assert.equal(rolled.people[0].comment_count, 1);
  assert.equal(rolled.people[0].best_evidence, "comment");
  assert.deepEqual(rollUpEngagers({ posts: [], engagements: buildEngagements() }), rollUpEngagers({ posts: [], engagements: buildEngagements() }));
});

test("tiers cover the edges, a recency drop, and one overflow", () => {
  const sample = runSample(stackRules, tiers);
  assert.equal(sample.touches, 60);
  assert.equal(sample.people, 58);
  assert.equal(sample.tiers["1"], 10);
  assert.equal(sample.tiers["2"], 4);
  assert.equal(sample.tiers["3"], 43);
  assert.equal(sample.tiers.hold, 1);
  assert.equal(sample.tier_rows.find((row) => row.person_id === "w-11").tier, "2");
  assert.match(sample.tier_rows.find((row) => row.person_id === "w-stale").reason, /drops from 1 to 2/);
  assert.equal(sample.tier_rows.find((row) => row.person_id === "w-hold").tier, "hold");
  assert.equal(sample.rolled.people.find((row) => row.person_id === "w-team"), undefined);
  assert.equal(sample.rolled.people.find((row) => row.person_id === "w-10").distinct_posts, 3);
  const edge = tierEngagers({
    as_of: "2026-11-16T12:00:00.000Z",
    rules: tiers,
    people: [{ person_id: "edge", fit: 55, comment_count: 0, distinct_posts: 1, last_seen: "2026-11-16T12:00:00.000Z" }],
  });
  assert.equal(edge.rows[0].tier, "2");
  const under = tierEngagers({
    as_of: "2026-11-16T12:00:00.000Z",
    rules: tiers,
    people: [{ person_id: "under", fit: 54, comment_count: 1, distinct_posts: 3, last_seen: "2026-11-16T12:00:00.000Z" }],
  });
  assert.equal(under.rows[0].tier, "3");
});

test("keyword merge keeps other rules and rejects a clash", () => {
  const current = {
    expected_revision: 4,
    rules: [
      { id: "11111111-1111-4111-8111-111111111111", keywords: ["close"], dm_message: "kept" },
      { id: "22222222-2222-4222-8222-222222222222", keywords: ["hiring"], dm_message: "also kept" },
    ],
  };
  const added = mergeKeywordRule({ ...current, rule: { keywords: ["Books"], dm_message: "new note" } });
  assert.equal(added.ok, true);
  assert.deepEqual(added.diff.kept, ["11111111-1111-4111-8111-111111111111", "22222222-2222-4222-8222-222222222222"]);
  assert.equal(added.expected_revision, 4);
  assert.equal(added.rules.length, 3);
  assert.equal(added.rules.find((rule) => !rule.id).dm_message, "new note");
  const clash = mergeKeywordRule({ ...current, rule: { keywords: ["CLOSE"] } });
  assert.equal(clash.ok, false);
  assert.equal(clash.rules.length, 2);
  assert.equal(clash.rules[0].dm_message, "kept");
  assert.equal(mergeKeywordRule({ expected_revision: 2, rules: current.rules, rule: { keywords: "books" } }).ok, false);
  assert.equal(mergeKeywordRule({ expected_revision: "4", rules: current.rules, rule: { keywords: ["books"] } }).expected_revision, null);
});

test("reply pick is stable and an empty list stops", () => {
  const lines = ["one", "two", "three"];
  const first = pickReplyLine({ comment_id: "cmt-1", lines });
  const second = pickReplyLine({ comment_id: "cmt-1", lines });
  assert.deepEqual(first, second);
  assert.equal(first.ok, true);
  assert.equal(pickReplyLine({ comment_id: "cmt-1", lines: [] }).ok, false);
});

test("DM tokens, https, the word limit, and a missing first name", () => {
  const good = checkDmText({ text: "{{first_name}} {{link}}", first_name: "Ada", link: "https://files.ledgerlight.example/a", word_limit: 10, banned_words: [] });
  assert.equal(good.ok, true);
  assert.match(good.text, /^Ada https:/);
  const dropped = checkDmText({ text: "Hi {{first_name}}", first_name: "", link: "https://files.ledgerlight.example/a", word_limit: 10, banned_words: [] });
  assert.equal(dropped.dropped, true);
  assert.equal(checkDmText({ text: "{{link}}", first_name: "", link: "http://files.ledgerlight.example/a", word_limit: 10, banned_words: [] }).ok, false);
  assert.equal(checkDmText({ text: "{{company}} {{link}}", first_name: "Ada", link: "https://files.ledgerlight.example/a", word_limit: 10, banned_words: [] }).ok, false);
  assert.equal(checkDmText({ text: "one two three {{link}}", first_name: "", link: "https://files.ledgerlight.example/a", word_limit: 2, banned_words: [] }).ok, false);
  assert.match(checkDmText({ text: "This is picnic {{link}}", first_name: "", link: "https://files.ledgerlight.example/a", word_limit: 20, banned_words: ["picnic"] }).reason, /banned word/);
});

test("email stack holds the missing DMARC, the high bounce, and the young mailbox", () => {
  const sample = runSample(stackRules, tiers);
  const send = sample.stack.domains.find((row) => row.domain === "send.ledgerlight.example");
  assert.equal(send.status, "hold");
  assert.equal(sample.stack.domains.find((row) => row.domain === "mailbox.example").status, "skipped");
  assert.equal(sample.stack.mailboxes.find((row) => row.mailbox_id === "mb-bounce").status, "hold");
  assert.equal(sample.stack.mailboxes.find((row) => row.mailbox_id === "mb-young").status, "hold");
  assert.equal(sample.stack.mailboxes.find((row) => row.mailbox_id === "mb-steady").status, "hold");
  assert.match(sample.stack.mailboxes.find((row) => row.mailbox_id === "mb-steady").holds.map((hold) => hold.reason).join(" "), /to-check/);
  const unknown = gradeEmailStack({
    rules: stackRules,
    domains: [],
    mailboxes: [{ id: "mb-unknown", domain: "mail.ledgerlight.example", bounce_7d: null, warmup_days: 20, daily_cap: 10 }],
  });
  assert.match(unknown.mailboxes[0].holds[0].reason, /not measured/);
});

test("quickstart passes the right workspace and stops the wrong one", () => {
  assert.equal(checkQuickstart({ workspace_id: WORKSPACE_ID, expected_workspace_id: WORKSPACE_ID, contracts_returned: true, spend_credits: 0, writes: 0 }).ok, true);
  assert.equal(checkQuickstart({ workspace_id: "other", expected_workspace_id: WORKSPACE_ID, contracts_returned: true, spend_credits: 0, writes: 0 }).ok, false);
  assert.equal(checkQuickstart({ workspace_id: WORKSPACE_ID, expected_workspace_id: WORKSPACE_ID, contracts_returned: true, spend_credits: 1, writes: 0 }).ok, false);
  assert.equal(checkQuickstart({ workspace_id: WORKSPACE_ID, expected_workspace_id: WORKSPACE_ID, contracts_returned: true, spend_credits: 0, writes: 1, sandbox_approved: false }).ok, false);
  assert.equal(checkQuickstart({ workspace_id: WORKSPACE_ID, expected_workspace_id: WORKSPACE_ID, contracts_returned: true, spend_credits: 0, writes: 1, sandbox_approved: true }).ok, true);
  assert.equal(checkQuickstart({ contracts_returned: true, spend_credits: 0, writes: 0 }).ok, false);
  assert.equal(classifyCrmMatch({ email: "", records: [] }).class, "failed");
});

test("sample week forms and replies", () => {
  const sample = runSample(stackRules, tiers);
  assert.equal(sample.forms, 6);
  assert.equal(sample.syncs_proposed, 2);
  assert.equal(sample.replies.length, 4);
  assert.equal(new Set(sample.replies.map((row) => `${row.comment_id}:${row.index}`)).size, 4);
  assert.equal(sample.keyword.clashed.ok, false);
  assert.equal(sample.keyword.added.ok, true);
  assert.equal(sample.credits, 0);
  assert.equal(sample.sent, 0);
});
