const DAY = 86400000;

function ageDays(asOf, seen) {
  const end = Date.parse(asOf);
  const start = Date.parse(seen);
  if (Number.isNaN(end) || Number.isNaN(start)) return null;
  return (end - start) / DAY;
}

function baseTier(person, rules) {
  if (person.in_team) return { tier: "hold", reason: "person is on the team list" };
  if (person.fit === null || person.fit === undefined || person.fit === "") {
    return { tier: "hold", reason: "fit is unknown" };
  }
  const fit = Number(person.fit);
  const commented = Number(person.comment_count || 0) > 0;
  const repeated = Number(person.distinct_posts || 0) >= 2;
  if (fit >= rules.top_fit && (commented || repeated)) {
    return { tier: "1", reason: "fit is at the top line and they engaged more than once or left a comment" };
  }
  if (fit >= rules.middle_fit) {
    return { tier: "2", reason: "fit is at the middle line" };
  }
  return { tier: "3", reason: "fit is under the middle line" };
}

function dropOne(tier) {
  if (tier === "1") return "2";
  if (tier === "2") return "3";
  return tier;
}

export function tierEngagers(input = {}) {
  const rules = {
    top_fit: 75,
    middle_fit: 55,
    recency_days: 30,
    tier_1_cap_per_week: 10,
    ...input.rules,
  };
  const team = new Set((input.exclude_person_ids ?? []).map((id) => String(id)));
  const rows = (input.people ?? []).map((person) => {
    const inTeam = Boolean(person.in_team) || team.has(person.person_id);
    const decided = baseTier({ ...person, in_team: inTeam }, rules);
    let tier = decided.tier;
    let reason = decided.reason;
    const age = ageDays(input.as_of, person.last_seen);
    if (tier !== "hold" && age !== null && age > rules.recency_days) {
      const next = dropOne(tier);
      if (next !== tier) {
        reason = `${reason}. Last touch is outside ${rules.recency_days} days, so the tier drops from ${tier} to ${next}`;
        tier = next;
      } else {
        reason = `${reason}. Last touch is outside ${rules.recency_days} days and this is already the lowest tier`;
      }
    }
    return {
      person_id: person.person_id,
      fit: person.fit ?? null,
      tier,
      reason,
      last_seen: person.last_seen ?? null,
    };
  });

  const tierOne = rows
    .filter((row) => row.tier === "1")
    .sort((a, b) => {
      const fitDelta = Number(b.fit) - Number(a.fit);
      if (fitDelta !== 0) return fitDelta;
      const seen = String(b.last_seen).localeCompare(String(a.last_seen));
      if (seen !== 0) return seen;
      return a.person_id.localeCompare(b.person_id);
    });
  const overflow = new Set(tierOne.slice(rules.tier_1_cap_per_week).map((row) => row.person_id));
  for (const row of rows) {
    if (!overflow.has(row.person_id)) continue;
    row.reason = `${row.reason}. Over the weekly cap of ${rules.tier_1_cap_per_week}, so this row moves to tier 2`;
    row.tier = "2";
  }
  rows.sort((a, b) => a.person_id.localeCompare(b.person_id));
  return { rows, rules };
}
