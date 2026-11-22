// Fictional example. No real companies or people.

export const AS_OF = "2026-11-16T12:00:00.000Z";
export const FORM_ID = "close-form";
export const WORKSPACE_ID = "0a13cecd-d194-46e5-94cc-328825aef631";

export const forms = [
  { id: "form-1", form_id: FORM_ID, email: "ada@northledger.example", name: "Ada North" },
  { id: "form-2", form_id: FORM_ID, email: "ben@clearbooks.example", name: "Ben Clear" },
  { id: "form-3", form_id: FORM_ID, email: "cara@mixedfile.example", name: "Cara Mixed" },
  { id: "form-4", form_id: FORM_ID, email: "", name: "No Address" },
  { id: "form-5", form_id: FORM_ID, email: "dana@gmail.com", name: "Dana Post" },
  { id: "form-6", form_id: FORM_ID, email: "ada@northledger.example", name: "Ada North" },
];

export const crmSearches = {
  "ada@northledger.example": { status: "ok", records: [] },
  "ben@clearbooks.example": { status: "ok", records: [{ id: "rec-ben", email: "ben@clearbooks.example", name: "Ben Clear" }] },
  "cara@mixedfile.example": {
    status: "ok",
    records: [
      { id: "rec-cara-1", email: "", name: "Cara Mixed" },
      { id: "rec-cara-2", email: "cara.other@mixedfile.example", name: "Cara Mixed" },
    ],
  },
  "dana@gmail.com": { status: "ok", records: [] },
};

export const posts = [
  { id: "post-01", is_repost: false },
  { id: "post-02", is_repost: false },
  { id: "post-03", is_repost: false },
  { id: "post-04", is_repost: false },
  { id: "post-05", is_repost: false },
  { id: "post-06", is_repost: false },
  { id: "post-07", is_repost: true },
];

function pad(n) {
  return String(n).padStart(2, "0");
}

export function buildEngagements() {
  const rows = [];
  const push = (row) => rows.push(row);
  for (let n = 1; n <= 9; n += 1) {
    const personId = `w-${pad(n)}`;
    push({ person_id: personId, post_id: "post-01", kind: "comment", reaction: "", name: `Person ${personId}`, at: "2026-11-15T15:00:00.000Z" });
  }
  for (const postId of ["post-01", "post-02", "post-03"]) {
    push({ person_id: "w-10", post_id: postId, kind: "reaction", reaction: "like", name: "Person w-10", at: "2026-11-15T16:00:00.000Z" });
  }
  push({ person_id: "w-11", post_id: "post-01", kind: "comment", reaction: "", name: "Person w-11", at: "2026-11-15T15:00:00.000Z" });
  push({ person_id: "w-stale", post_id: "post-02", kind: "comment", reaction: "", name: "Person Stale", at: "2026-10-01T12:00:00.000Z" });
  push({ person_id: "w-mid-1", post_id: "post-03", kind: "reaction", reaction: "like", name: "Person Mid One", at: "2026-11-12T12:00:00.000Z" });
  push({ person_id: "w-mid-2", post_id: "post-03", kind: "reaction", reaction: "like", name: "Person Mid Two", at: "2026-11-12T12:00:00.000Z" });
  push({ person_id: "w-low", post_id: "post-05", kind: "reaction", reaction: "like", name: "Person Low", at: "2026-11-11T12:00:00.000Z" });
  push({ person_id: "w-hold", post_id: "post-03", kind: "comment", reaction: "like", name: "Person Hold", at: "2026-11-14T12:00:00.000Z" });
  for (let n = 1; n <= 42; n += 1) {
    const personId = `f-${pad(n)}`;
    const name = n === 2 ? "Jo" : `Person ${personId}`;
    push({ person_id: personId, post_id: "post-04", kind: "reaction", reaction: "like", name, at: "2026-11-10T12:00:00.000Z" });
  }
  push({ person_id: "f-02", post_id: "post-04", kind: "reaction", reaction: "like", name: "Jordan Hale", at: "2026-11-10T12:00:00.000Z" });
  push({ person_id: "f-01", post_id: "post-04", kind: "reaction", reaction: "like", name: "Person f-01", at: "2026-11-10T12:05:00.000Z" });
  push({ person_id: "w-team", post_id: "post-01", kind: "reaction", reaction: "like", name: "Teammate Lane", at: "2026-11-15T15:00:00.000Z" });
  for (const personId of ["f-03", "f-04", "f-05"]) {
    push({ person_id: personId, post_id: "post-07", kind: "reaction", reaction: "like", name: `Person ${personId}`, at: "2026-11-09T12:00:00.000Z" });
  }
  return rows;
}

export const fitByPerson = Object.fromEntries([
  ...Array.from({ length: 11 }, (_, index) => [`w-${pad(index + 1)}`, 90]),
  ["w-10", 90],
  ["w-stale", 92],
  ["w-mid-1", 60],
  ["w-mid-2", 60],
  ["w-low", 40],
  ["w-hold", null],
  ...Array.from({ length: 42 }, (_, index) => [`f-${pad(index + 1)}`, 30]),
]);

export const excludePersonIds = ["w-team"];

export const replyLines = [
  "The close checklist is the short page.",
  "Here is the one page we use with firms.",
  "Start with the close list.",
  "The checklist covers the last week of the month.",
];

export const commentIds = ["cmt-1", "cmt-2", "cmt-3", "cmt-4"];

export const keywordRules = {
  expected_revision: 4,
  rules: [
    {
      id: "11111111-1111-4111-8111-111111111111",
      keywords: ["close", "month end"],
      dm_enabled: false,
      dm_message: "kept close note",
      comment_reply_sent_enabled: false,
    },
    {
      id: "22222222-2222-4222-8222-222222222222",
      keywords: ["hiring"],
      dm_enabled: true,
      dm_message: "kept hiring note",
    },
  ],
};

export const keywordAdd = { keywords: ["books"], dm_enabled: false, dm_message: "share the checklist" };
export const keywordClash = { keywords: ["close"] };

export const dmGood = {
  text: "{{first_name}}, the close checklist is here: {{link}}",
  first_name: "Ada",
  link: "https://files.ledgerlight.example/close-checklist",
  word_limit: 40,
};

export const domains = [
  { domain: "mail.ledgerlight.example", provider_managed: false, spf: "observed", dkim: "observed", dmarc: "observed" },
  { domain: "send.ledgerlight.example", provider_managed: false, spf: "observed", dkim: "observed", dmarc: "missing" },
  { domain: "mailbox.example", provider_managed: true, spf: "missing", dkim: "missing", dmarc: "missing" },
];

export const mailboxes = [
  { id: "mb-steady", domain: "mail.ledgerlight.example", bounce_7d: 0.01, warmup_days: 20, daily_cap: 30 },
  { id: "mb-bounce", domain: "mail.ledgerlight.example", bounce_7d: 0.08, warmup_days: 21, daily_cap: 30 },
  { id: "mb-young", domain: "send.ledgerlight.example", bounce_7d: 0.0, warmup_days: 3, daily_cap: 20 },
  { id: "mb-hosted", domain: "mailbox.example", bounce_7d: 0.01, warmup_days: 20, daily_cap: 25 },
];

export const quickstartPass = {
  workspace_id: WORKSPACE_ID,
  expected_workspace_id: WORKSPACE_ID,
  contracts_returned: true,
  spend_credits: 0,
  writes: 0,
  sandbox_approved: false,
};

export const quickstartWrong = {
  workspace_id: "11111111-1111-4111-8111-111111111111",
  expected_workspace_id: WORKSPACE_ID,
  contracts_returned: true,
  spend_credits: 0,
  writes: 0,
  sandbox_approved: false,
};
