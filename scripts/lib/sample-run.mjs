import { classifyCrmMatch } from "../../functions/classify-crm-match.mjs";
import { checkDmText } from "../../functions/check-dm-text.mjs";
import { checkQuickstart } from "../../functions/check-quickstart.mjs";
import { gradeEmailStack } from "../../functions/grade-email-stack.mjs";
import { mergeKeywordRule } from "../../functions/merge-keyword-rule.mjs";
import { normaliseInbound } from "../../functions/normalise-inbound.mjs";
import { pickReplyLine } from "../../functions/pick-reply-line.mjs";
import { rollUpEngagers } from "../../functions/roll-up-engagers.mjs";
import { tierEngagers } from "../../functions/tier-engagers.mjs";
import {
  AS_OF,
  buildEngagements,
  commentIds,
  crmSearches,
  dmGood,
  domains,
  excludePersonIds,
  fitByPerson,
  forms,
  keywordAdd,
  keywordClash,
  keywordRules,
  mailboxes,
  posts,
  quickstartPass,
  quickstartWrong,
  replyLines,
} from "../../examples/sample-week/week.mjs";

export function routeForms() {
  const seen = new Set();
  return forms.map((form) => {
    const normalised = normaliseInbound(form);
    if (!normalised.ok) {
      return { id: form.id, route: "hold", reason: normalised.reason, sync: false, idempotency_key: null };
    }
    if (seen.has(normalised.idempotency_key)) {
      return { id: form.id, route: "hold", reason: "duplicate form", sync: false, idempotency_key: normalised.idempotency_key };
    }
    seen.add(normalised.idempotency_key);
    if (normalised.mailbox_class === "personal") {
      return { id: form.id, route: "hold", reason: "personal mailbox", sync: false, idempotency_key: normalised.idempotency_key };
    }
    const search = crmSearches[normalised.email] ?? { status: "ok", records: [] };
    const classified = classifyCrmMatch({ ...search, email: normalised.email });
    if (!classified.sync_allowed) {
      return { id: form.id, route: "hold", reason: classified.reason, sync: false, idempotency_key: normalised.idempotency_key, class: classified.class };
    }
    return {
      id: form.id,
      route: "sync",
      reason: classified.reason,
      sync: true,
      class: classified.class,
      record_id: classified.record_id,
      idempotency_key: normalised.idempotency_key,
    };
  });
}

export function runSample(stackRules, tierRules) {
  const formRoutes = routeForms();
  const rolled = rollUpEngagers({
    posts,
    engagements: buildEngagements(),
    exclude_person_ids: excludePersonIds,
    as_of: AS_OF,
  });
  const people = rolled.people.map((person) => ({
    ...person,
    fit: Object.prototype.hasOwnProperty.call(fitByPerson, person.person_id) ? fitByPerson[person.person_id] : null,
  }));
  const tiered = tierEngagers({ people, rules: tierRules, exclude_person_ids: excludePersonIds, as_of: AS_OF });
  const added = mergeKeywordRule({ ...keywordRules, rule: keywordAdd });
  const clashed = mergeKeywordRule({ ...keywordRules, rule: keywordClash });
  const replies = commentIds.map((commentId) => ({ comment_id: commentId, ...pickReplyLine({ comment_id: commentId, lines: replyLines }) }));
  const dm = checkDmText({ ...dmGood, banned_words: [] });
  const stack = gradeEmailStack({ domains, mailboxes, rules: stackRules, as_of: AS_OF });
  const quickstart = {
    pass: checkQuickstart(quickstartPass),
    wrong_workspace: checkQuickstart(quickstartWrong),
  };
  const tierCounts = { "1": 0, "2": 0, "3": 0, hold: 0 };
  for (const row of tiered.rows) tierCounts[row.tier] += 1;
  const holdReasons = {};
  const addHold = (reason) => {
    holdReasons[reason] = (holdReasons[reason] ?? 0) + 1;
  };
  for (const form of formRoutes) if (!form.sync) addHold(form.reason);
  for (const row of tiered.rows) if (row.tier === "hold") addHold(row.reason);
  if (!clashed.ok) addHold(clashed.reason);
  for (const domain of stack.domains) for (const hold of domain.holds) addHold(`${domain.domain}: ${hold.reason}`);
  for (const mailbox of stack.mailboxes) for (const hold of mailbox.holds) addHold(`${mailbox.mailbox_id}: ${hold.reason}`);
  if (!quickstart.wrong_workspace.ok) addHold(quickstart.wrong_workspace.stops[0]);

  return {
    as_of: AS_OF,
    credits: 0,
    sent: 0,
    forms: formRoutes.length,
    syncs_proposed: formRoutes.filter((form) => form.sync).length,
    form_routes: formRoutes,
    touches: rolled.touches.length,
    people: rolled.people.length,
    rolled,
    tiers: tierCounts,
    tier_rows: tiered.rows,
    keyword: { added, clashed },
    replies,
    dm,
    stack,
    quickstart,
    hold_reasons: holdReasons,
  };
}

export function renderReport(result) {
  const lines = [];
  lines.push("Fictional example. No real companies or people.");
  lines.push("");
  lines.push("# Ledgerlight sample week");
  lines.push("");
  lines.push("Ledgerlight is a fictional bookkeeping close tool for accounting firms with 5 to 80 staff in the US. Every person and company below is invented. Credits are 0 because this run never calls Dreamstate.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Item | Count |");
  lines.push("| --- | --- |");
  lines.push(`| Forms | ${result.forms} |`);
  lines.push(`| Syncs proposed | ${result.syncs_proposed} |`);
  lines.push(`| Touches | ${result.touches} |`);
  lines.push(`| People | ${result.people} |`);
  lines.push(`| Tier 1 | ${result.tiers["1"]} |`);
  lines.push(`| Tier 2 | ${result.tiers["2"]} |`);
  lines.push(`| Tier 3 | ${result.tiers["3"]} |`);
  lines.push(`| Hold | ${result.tiers.hold} |`);
  lines.push(`| Replies previewed | ${result.replies.filter((row) => row.ok).length} |`);
  lines.push("| Credits | 0 |");
  lines.push("| Sent | 0 |");
  lines.push("");
  lines.push("## Forms");
  lines.push("");
  for (const form of result.form_routes) {
    lines.push(`- ${form.id}: ${form.route}. ${form.reason}.`);
  }
  lines.push("");
  lines.push("Queued is not done. A proposed sync still waits for a yes, then a health read.");
  lines.push("");
  lines.push("## Warm people");
  lines.push("");
  lines.push(`Touches kept: ${result.touches}. People kept: ${result.people}. A repeated like on the same post is one touch. The teammate is absent. The repost is absent.`);
  lines.push("");
  const interesting = result.tier_rows.filter((row) => row.person_id.startsWith("w-"));
  for (const row of interesting) {
    lines.push(`- ${row.person_id}: tier ${row.tier}. ${row.reason}.`);
  }
  lines.push("");
  lines.push("## Keyword replies");
  lines.push("");
  lines.push(result.keyword.added.ok ? `Added rule. Kept ${result.keyword.added.diff.kept.join(", ")}.` : "Add failed.");
  lines.push(result.keyword.clashed.ok ? "Clash was accepted." : `Clash rejected: ${result.keyword.clashed.reason}.`);
  for (const reply of result.replies) {
    lines.push(`- ${reply.comment_id}: ${reply.line}`);
  }
  lines.push("");
  lines.push("## Email stack");
  lines.push("");
  for (const domain of result.stack.domains) {
    const extra = domain.note ? ` ${domain.note}.` : "";
    const why = domain.holds.map((hold) => hold.reason).join("; ");
    lines.push(`- ${domain.domain}: ${domain.status}.${extra}${why ? ` ${why}.` : ""}`);
  }
  for (const mailbox of result.stack.mailboxes) {
    const why = mailbox.holds.map((hold) => `${hold.reason} (${hold.seat})`).join("; ");
    lines.push(`- ${mailbox.mailbox_id}: ${mailbox.status}.${why ? ` ${why}.` : ""}`);
  }
  if (result.stack.notes.length) lines.push(`- Note: ${result.stack.notes.join(" ")}`);
  lines.push("");
  lines.push("## Quickstart check");
  lines.push("");
  lines.push(result.quickstart.pass.ok ? "- Matching workspace: pass." : "- Matching workspace: stop.");
  lines.push(result.quickstart.wrong_workspace.ok ? "- Other workspace: pass." : `- Other workspace: stop. ${result.quickstart.wrong_workspace.stops.join(" ")}.`);
  lines.push("");
  lines.push("## Holds by reason");
  lines.push("");
  lines.push("| Reason | Count |");
  lines.push("| --- | --- |");
  for (const reason of Object.keys(result.hold_reasons).sort()) {
    lines.push(`| ${reason} | ${result.hold_reasons[reason]} |`);
  }
  lines.push("");
  lines.push("Nothing was sent. Nothing was spent.");
  lines.push("");
  return lines.join("\n");
}
