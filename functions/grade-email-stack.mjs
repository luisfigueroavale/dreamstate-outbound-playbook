const SEAT = "Sequences & Deliverability";

function domainGrade(domain, rules) {
  if (domain.provider_managed) {
    return {
      domain: domain.domain,
      status: "skipped",
      holds: [],
      note: "provider managed domain, DNS is not ours to fix",
    };
  }
  const holds = [];
  for (const record of ["spf", "dkim", "dmarc"]) {
    if (!rules[`${record}_observed`]) continue;
    if (domain[record] !== "observed") {
      holds.push({
        reason: `${record.toUpperCase()} is ${domain[record] || "missing"}`,
        seat: SEAT,
      });
    }
  }
  return {
    domain: domain.domain,
    status: holds.length ? "hold" : "pass",
    holds,
    note: null,
  };
}

function mailboxGrade(mailbox, rules) {
  const holds = [];
  if (mailbox.bounce_7d === null || mailbox.bounce_7d === undefined) {
    holds.push({ reason: "7 day bounce was not measured", seat: SEAT });
  } else if (Number(mailbox.bounce_7d) > rules.bounce_7d_max) {
    holds.push({ reason: `7 day bounce ${mailbox.bounce_7d} is over ${rules.bounce_7d_max}`, seat: SEAT });
  }
  if (mailbox.warmup_days === null || mailbox.warmup_days === undefined) {
    holds.push({ reason: "warmup age was not measured", seat: SEAT });
  } else if (Number(mailbox.warmup_days) < rules.warmup_min_days) {
    holds.push({ reason: `warmup is ${mailbox.warmup_days} days and the minimum is ${rules.warmup_min_days}`, seat: SEAT });
  }
  if (mailbox.daily_cap === null || mailbox.daily_cap === undefined) {
    holds.push({ reason: "no daily cap is set", seat: SEAT });
  } else if (rules.daily_cap_max !== null && rules.daily_cap_max !== undefined && Number(mailbox.daily_cap) > rules.daily_cap_max) {
    holds.push({ reason: `daily cap ${mailbox.daily_cap} is over ${rules.daily_cap_max}`, seat: SEAT });
  }
  return {
    mailbox_id: mailbox.id,
    domain: mailbox.domain,
    status: holds.length ? "hold" : "pass",
    holds,
  };
}

export function gradeEmailStack(input = {}) {
  const rules = input.rules ?? {};
  const notes = [];
  if (rules.daily_cap_max === null || rules.daily_cap_max === undefined) {
    notes.push("daily cap figure is to-check");
  }
  const domains = (input.domains ?? []).map((domain) => domainGrade(domain, rules));
  const mailboxes = (input.mailboxes ?? []).map((mailbox) => mailboxGrade(mailbox, rules));
  return { domains, mailboxes, notes, rules_status: rules.status ?? null };
}
