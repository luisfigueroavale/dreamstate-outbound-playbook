const WORKSPACE = "0a13cecd-d194-46e5-94cc-328825aef631";

const steps = [
  {
    n: 1,
    capability_id: "whoami",
    mode: "live",
    effect: "read",
    needs_yes: false,
    credit_ceiling: 0,
    params: {},
    show: `Stop unless the workspace is ${WORKSPACE}, or the id in settings.local if the owner has written one.`,
  },
  {
    n: 2,
    capability_id: "tools_search",
    mode: "live",
    effect: "read",
    needs_yes: false,
    credit_ceiling: 0,
    params: { goal: "find a verified work email", toolset: "tables" },
    show: "Show the top three matches.",
  },
  {
    n: 3,
    capability_id: "tools_get",
    mode: "live",
    effect: "read",
    needs_yes: false,
    credit_ceiling: 0,
    params: { capability_id: "tables.contacts.verify_email" },
    show: "Show the cost line in plain words.",
  },
  {
    n: 4,
    capability_id: "tables.findable_catalog.list",
    mode: "live",
    effect: "read",
    needs_yes: false,
    credit_ceiling: 0,
    params: { query: "engaged" },
    show: "Show each source with its per-row price.",
  },
  {
    n: 5,
    capability_id: "workspace.usage.status_get",
    mode: "live",
    effect: "read",
    needs_yes: false,
    credit_ceiling: 0,
    params: {},
    show: "Read the workspace plan from this response. Do not quote a plan price from memory.",
  },
  {
    n: 6,
    capability_id: "workspace.usage.spend_breakdown",
    mode: "live",
    effect: "read",
    needs_yes: false,
    credit_ceiling: 0,
    params: { from: "ONE_HOUR_AGO_ISO" },
    show: "Show 0 credits from this check. Replace ONE_HOUR_AGO_ISO with the real timestamp.",
  },
  {
    n: 7,
    capability_id: "tables.workbooks.create",
    mode: "dry_run",
    effect: "write",
    needs_yes: true,
    credit_ceiling: 0,
    params: { name: "Sandbox: quickstart", row_origin: "user_supplied" },
    show: "Optional. Wait for a yes. Then two fictional rows and tables.rows.query. Deleting the sandbox is a separate yes.",
  },
];

console.log("Free quickstart. This script prints the calls. It does not make them.");
console.log("");
for (const step of steps) {
  console.log(`${step.n}. ${step.capability_id}`);
  console.log(`   mode: ${step.mode}`);
  console.log(`   effect: ${step.effect}`);
  console.log(`   needs_yes: ${step.needs_yes}`);
  console.log(`   credit_ceiling: ${step.credit_ceiling}`);
  console.log(`   params: ${JSON.stringify(step.params)}`);
  console.log(`   show: ${step.show}`);
  console.log("");
}
console.log("Save the responses under work/quickstart/ and run check-quickstart. Nothing has been sent or spent.");
