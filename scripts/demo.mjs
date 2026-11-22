import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderReport, runSample } from "./lib/sample-run.mjs";

const tiers = JSON.parse(readFileSync(new URL("../settings/tiers.json", import.meta.url), "utf8"));
const stack = JSON.parse(readFileSync(new URL("../settings/stack-rules.json", import.meta.url), "utf8"));
const result = runSample(stack, tiers);
const report = renderReport(result);
const summary = {
  fictional: true,
  as_of: result.as_of,
  forms: result.forms,
  syncs_proposed: result.syncs_proposed,
  touches: result.touches,
  people: result.people,
  tiers: result.tiers,
  replies_previewed: result.replies.filter((row) => row.ok).length,
  holds_by_reason: result.hold_reasons,
  credits: 0,
  sent: 0,
  form_routes: result.form_routes,
  keyword_added: result.keyword.added.ok,
  keyword_clash_rejected: !result.keyword.clashed.ok,
  replies: result.replies.map((row) => ({ comment_id: row.comment_id, index: row.index, line: row.line })),
  stack: result.stack,
  quickstart: result.quickstart,
};

mkdirSync("output/demo", { recursive: true });
writeFileSync("output/demo/report.md", report);
writeFileSync("output/demo/results.json", `${JSON.stringify(summary, null, 2)}\n`);
writeFileSync("examples/sample-week/report.md", report);
console.log("demo wrote examples/sample-week/report.md and output/demo/");
console.log(`forms ${summary.forms}, syncs ${summary.syncs_proposed}, touches ${summary.touches}, people ${summary.people}, credits 0, sent 0`);
