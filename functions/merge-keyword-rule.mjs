const MAX_RULES = 20;
const MAX_KEYWORDS = 20;

function cleanKeyword(value) {
  return String(value ?? "").trim().toLowerCase();
}

function keywordsOf(rule) {
  return (rule.keywords ?? []).map(cleanKeyword).filter(Boolean);
}

function sameKeywords(left, right) {
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return false;
  }
  return true;
}

function byCodePoint(left, right) {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

function copyRule(rule) {
  return JSON.parse(JSON.stringify(rule));
}

function stopped(reason, rules, revision) {
  return {
    ok: false,
    reason,
    expected_revision: revision ?? null,
    rules,
    diff: { added: [], changed: [], kept: rules.map((rule) => rule.id).filter(Boolean).sort(byCodePoint) },
  };
}

export function mergeKeywordRule(input = {}) {
  const revision = input.expected_revision;
  const current = Array.isArray(input.rules) ? input.rules.map(copyRule) : [];
  if (!Number.isInteger(revision) || revision < 1) {
    return stopped("expected_revision must be an integer above 0", current, revision);
  }
  if (current.length > MAX_RULES) return stopped("at most 20 rules", current, revision);
  for (const rule of current) {
    if (!rule.id) return stopped("an existing rule is missing its id", current, revision);
    const count = keywordsOf(rule).length;
    if (count < 1 || count > MAX_KEYWORDS) return stopped("each rule needs 1 to 20 keywords", current, revision);
  }
  const incoming = input.rule ?? {};
  const incomingWords = keywordsOf(incoming);
  if (incomingWords.length < 1 || incomingWords.length > MAX_KEYWORDS) {
    return stopped("a rule needs 1 to 20 keywords", current, revision);
  }
  const incomingId = incoming.id ? String(incoming.id) : "";
  const others = current.filter((rule) => String(rule.id) !== incomingId);
  const clash = others.find((rule) => keywordsOf(rule).some((word) => incomingWords.includes(word)));
  if (clash) return stopped(`keyword already used by ${clash.id}`, current, revision);
  const previous = incomingId ? current.find((rule) => String(rule.id) === incomingId) : null;
  if (incomingId && !previous) return stopped("that rule id is not in the current set", current, revision);
  if (!previous && current.length >= MAX_RULES) return stopped("at most 20 rules", current, revision);

  let nextRule;
  let changed = [];
  let added = [];
  if (previous) {
    const before = keywordsOf(previous);
    nextRule = copyRule(previous);
    nextRule.keywords = incomingWords;
    if (!sameKeywords(before, incomingWords)) changed = [String(previous.id)];
  } else {
    nextRule = copyRule(incoming);
    delete nextRule.id;
    nextRule.keywords = incomingWords;
    added = ["new"];
  }
  const rules = [...others, nextRule].sort((left, right) => byCodePoint(String(left.id ?? ""), String(right.id ?? "")));
  const kept = others.map((rule) => String(rule.id)).sort(byCodePoint);
  return {
    ok: true,
    reason: previous ? "rule updated, other rules kept" : "rule added, other rules kept",
    expected_revision: revision,
    rules,
    diff: { added, changed, kept },
  };
}
