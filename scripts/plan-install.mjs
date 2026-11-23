import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve("automations");
const names = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

console.log("Install plan. This script prints calls. It does not make them.");
console.log("Import creates a disabled workflow. Enable is a separate yes and is not in this list.");
console.log("");

for (const name of names) {
  const graph = JSON.parse(readFileSync(path.join(root, name, "graph.json"), "utf8"));
  console.log(`# ${name}`);
  console.log(`status: ${graph.status}`);
  const calls = [
    {
      capability_id: "workflow.automations.import_preflight",
      mode: "live",
      effect: "read",
      needs_yes: false,
      credit_ceiling: 0,
      params: { kind: "workflow", document: graph.document },
    },
    {
      capability_id: "workflow.automations.lint",
      mode: "live",
      effect: "read",
      needs_yes: false,
      credit_ceiling: 0,
      params: { kind: "workflow", document: graph.document },
    },
    {
      capability_id: "workflow.automations.import",
      mode: "dry_run",
      effect: "write",
      needs_yes: true,
      credit_ceiling: 0,
      params: { kind: "workflow", name: graph.name, document: graph.document },
    },
  ];
  for (const call of calls) {
    console.log(`- ${call.capability_id}`);
    console.log(`  mode: ${call.mode}`);
    console.log(`  effect: ${call.effect}`);
    console.log(`  needs_yes: ${call.needs_yes}`);
    console.log(`  credit_ceiling: ${call.credit_ceiling}`);
    console.log(`  params.kind: ${call.params.kind}`);
  }
  console.log("- workflow.workflows.enable is not called here. It needs its own yes.");
  console.log("");
}
console.log("Nothing has been imported or enabled.");
