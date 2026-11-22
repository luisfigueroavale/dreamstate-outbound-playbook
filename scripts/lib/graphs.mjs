import { inlineFunction, nullable, objectSchema } from "./inline.mjs";

function codeNode(id, y, file, fnName, schema) {
  const body = inlineFunction(new URL(`../../functions/${file}.mjs`, import.meta.url));
  const source = `${body}\nresult = ${fnName}(typeof payload === "undefined" ? {} : payload);\n`;
  return {
    id,
    type: "action",
    position: { x: 0, y },
    data: {
      kind: "action",
      subtype: "code",
      label: id,
      config: {
        source,
        output_schema: schema,
        input_mappings: {
          payload: {
            path: "trigger.payload",
            provenance: { kind: "endpoint_schema", source_ref: "trigger.payload" },
          },
        },
      },
    },
  };
}

function trigger(y = 0) {
  return {
    id: "trigger",
    type: "trigger",
    position: { x: 0, y },
    data: {
      kind: "trigger",
      subtype: "manual_run",
      label: "Run by hand",
      config: { target: "none" },
    },
  };
}

function approval(id, y, title, body) {
  return {
    id,
    type: "action",
    position: { x: 0, y },
    data: {
      kind: "action",
      subtype: "request_approval",
      label: title,
      config: {
        title,
        body,
        assignee: "owner",
        outcomes: ["approve", "hold"],
        on_expiry: "hold",
      },
    },
  };
}

function edge(source, target, handle) {
  return { id: `${source}-to-${target}${handle ? `-${handle}` : ""}`, source, target, ...(handle ? { sourceHandle: handle } : {}) };
}

const normaliseSchema = objectSchema(
  ["ok", "reason", "email", "mailbox_class", "form_id", "idempotency_key"],
  {
    ok: { type: "boolean" },
    reason: nullable("string"),
    email: nullable("string"),
    mailbox_class: nullable("string"),
    form_id: { type: "string" },
    idempotency_key: nullable("string"),
  },
);

const rollSchema = objectSchema(["touches", "people"], {
  touches: { type: "array" },
  people: { type: "array" },
});

const mergeSchema = objectSchema(["ok", "reason", "expected_revision", "rules", "diff"], {
  ok: { type: "boolean" },
  reason: { type: "string" },
  expected_revision: nullable("number"),
  rules: { type: "array" },
  diff: { type: "object" },
});

export function buildGraphs() {
  return {
    "form-to-crm": {
      kind: "workflow",
      status: "disabled",
      name: "form-to-crm",
      summary: "Normalise one inbound form, then wait. Classify and the sync live in the call plan.",
      import_with: "workflow.automations.import",
      preflight_with: "workflow.automations.import_preflight",
      lint_with: "workflow.automations.lint",
      document: {
        description: "Manual in the graph. The webhook source is attached on a worksheet, with a secret, before this runs. classify-crm-match stays in the call plan. This graph has no CRM search results to pass into it.",
        nodes: [
          trigger(0),
          codeNode("normalise-inbound", 160, "normalise-inbound", "normaliseInbound", normaliseSchema),
          approval("approve-sync", 320, "Approve one CRM sync", "Show the class and the one record from the call plan. Approve is one integrations.sync. Hold sends nothing. Queued is not done."),
        ],
        edges: [
          edge("trigger", "normalise-inbound"),
          edge("normalise-inbound", "approve-sync"),
        ],
      },
    },
    "post-engagers-rollup": {
      kind: "workflow",
      status: "disabled",
      name: "post-engagers-rollup",
      summary: "Roll up engagers of your own posts. The tier lives in the call plan. Harvest and the fit column each wait for a yes.",
      import_with: "workflow.automations.import",
      preflight_with: "workflow.automations.import_preflight",
      lint_with: "workflow.automations.lint",
      document: {
        description: "Manual trigger. A schedule is a standing action and needs its own yes. Post ids and account ids are resolved at run time. tier-engagers stays in the call plan. This graph has no fit rules or score to pass into it.",
        nodes: [
          trigger(0),
          codeNode("roll-up-engagers", 160, "roll-up-engagers", "rollUpEngagers", rollSchema),
          approval("approve-score", 320, "Approve the fit score quote", "Show rows, credits, and quote_hash for one row. The live run uses max_credits from the brief. Default ceiling 50."),
        ],
        edges: [
          edge("trigger", "roll-up-engagers"),
          edge("roll-up-engagers", "approve-score"),
        ],
      },
    },
    "comment-keyword-share": {
      kind: "workflow",
      status: "disabled",
      name: "comment-keyword-share",
      summary: "Merge one keyword rule without dropping the others. The reply line lives in the call plan.",
      import_with: "workflow.automations.import",
      preflight_with: "workflow.automations.import_preflight",
      lint_with: "workflow.automations.lint",
      document: {
        description: "Manual trigger. The asset text comes from the funnel skill send-lead-magnet. This graph does not write that text. pick-reply-line stays in the call plan. This graph has no reply list to pass into it.",
        nodes: [
          trigger(0),
          codeNode("merge-keyword-rule", 160, "merge-keyword-rule", "mergeKeywordRule", mergeSchema),
          approval("approve-rules", 320, "Approve the rule diff", "Show added, changed, and kept. Replace sends the full set and expected_revision. A keyword clash stops. The reply yes is a later call-plan step."),
        ],
        edges: [
          edge("trigger", "merge-keyword-rule"),
          edge("merge-keyword-rule", "approve-rules"),
        ],
      },
    },
  };
}
