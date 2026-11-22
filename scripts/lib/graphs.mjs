import { inlineFunction, nullable, objectSchema } from "./inline.mjs";

function codeNode(id, y, file, schema) {
  return {
    id,
    type: "action",
    position: { x: 0, y },
    data: {
      kind: "action",
      subtype: "code",
      label: id,
      config: {
        source: inlineFunction(new URL(`../../functions/${file}.mjs`, import.meta.url)),
        output_schema: schema,
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

const classSchema = objectSchema(
  ["class", "reason", "sync_allowed", "record_id"],
  {
    class: { type: "string" },
    reason: { type: "string" },
    sync_allowed: { type: "boolean" },
    record_id: nullable("string"),
  },
);

const rollSchema = objectSchema(["touches", "people"], {
  touches: { type: "array" },
  people: { type: "array" },
});

const tierSchema = objectSchema(["rows", "rules"], {
  rows: { type: "array" },
  rules: { type: "object" },
});

const mergeSchema = objectSchema(["ok", "reason", "expected_revision", "rules", "diff"], {
  ok: { type: "boolean" },
  reason: { type: "string" },
  expected_revision: nullable("number"),
  rules: { type: "array" },
  diff: { type: "object" },
});

const pickSchema = objectSchema(["ok", "reason", "line", "index"], {
  ok: { type: "boolean" },
  reason: nullable("string"),
  line: nullable("string"),
  index: nullable("number"),
});

export function buildGraphs() {
  return {
    "form-to-crm": {
      kind: "workflow",
      status: "disabled",
      name: "form-to-crm",
      summary: "Classify one inbound form, then wait. A sync is a separate yes.",
      import_with: "workflow.automations.import",
      preflight_with: "workflow.automations.import_preflight",
      lint_with: "workflow.automations.lint",
      document: {
        description: "Manual in the graph. The webhook source is attached on a worksheet, with a secret, before this runs.",
        nodes: [
          trigger(0),
          codeNode("normalise-inbound", 160, "normalise-inbound", normaliseSchema),
          codeNode("classify-crm-match", 320, "classify-crm-match", classSchema),
          approval("approve-sync", 480, "Approve one CRM sync", "Show the class and the one record. Approve is one integrations.sync. Hold sends nothing. Queued is not done."),
        ],
        edges: [
          edge("trigger", "normalise-inbound"),
          edge("normalise-inbound", "classify-crm-match"),
          edge("classify-crm-match", "approve-sync"),
        ],
      },
    },
    "post-engagers-rollup": {
      kind: "workflow",
      status: "disabled",
      name: "post-engagers-rollup",
      summary: "Roll up engagers of your own posts and tier them. Harvest and the fit column each wait for a yes.",
      import_with: "workflow.automations.import",
      preflight_with: "workflow.automations.import_preflight",
      lint_with: "workflow.automations.lint",
      document: {
        description: "Manual trigger. A schedule is a standing action and needs its own yes. Post ids and account ids are resolved at run time.",
        nodes: [
          trigger(0),
          codeNode("roll-up-engagers", 160, "roll-up-engagers", rollSchema),
          codeNode("tier-engagers", 320, "tier-engagers", tierSchema),
          approval("approve-score", 480, "Approve the fit score quote", "Show rows, credits, and quote_hash for one row. The live run uses max_credits from the brief. Default ceiling 50."),
        ],
        edges: [
          edge("trigger", "roll-up-engagers"),
          edge("roll-up-engagers", "tier-engagers"),
          edge("tier-engagers", "approve-score"),
        ],
      },
    },
    "comment-keyword-share": {
      kind: "workflow",
      status: "disabled",
      name: "comment-keyword-share",
      summary: "Merge one keyword rule without dropping the others, then preview each reply.",
      import_with: "workflow.automations.import",
      preflight_with: "workflow.automations.import_preflight",
      lint_with: "workflow.automations.lint",
      document: {
        description: "Manual trigger. The asset text comes from the funnel skill send-lead-magnet. This graph does not write that text.",
        nodes: [
          trigger(0),
          codeNode("merge-keyword-rule", 160, "merge-keyword-rule", mergeSchema),
          approval("approve-rules", 320, "Approve the rule diff", "Show added, changed, and kept. Replace sends the full set and expected_revision. A keyword clash stops."),
          codeNode("pick-reply-line", 480, "pick-reply-line", pickSchema),
          approval("approve-reply", 640, "Approve this exact reply", "Show the frozen line. Approve posts that text. Any DM is a separate yes."),
        ],
        edges: [
          edge("trigger", "merge-keyword-rule"),
          edge("merge-keyword-rule", "approve-rules"),
          edge("approve-rules", "pick-reply-line", "approve"),
          edge("pick-reply-line", "approve-reply"),
        ],
      },
    },
  };
}
