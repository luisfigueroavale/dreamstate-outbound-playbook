function cleanKeyword(value) {
  return String(value ?? "").trim().toLowerCase();
}

function sameWords(left, right) {
  if (left.length !== right.length) return false;
  return left.every((word, index) => word === right[index]);
}

export function mergeKeywordRule(input = {}) {
  const revision = input.revision ?? null;
  const current = (input.rules ?? []).map((rule) => ({
    id: String(rule.id),
    keywords: (rule.keywords ?? []).map(cleanKeyword).filter(Boolean),
  }));
  const incomingWords = (input.rule?.keywords ?? []).map(cleanKeyword).filter(Boolean);
  if (incomingWords.length === 0) {
    return { ok: false, reason: "the rule has no keyword", expected_revision: revision, rules: current, diff: { added: [], changed: [], kept: current.map((rule) => rule.id) } };
  }
  const incomingId = input.rule?.id ? String(input.rule.id) : `rule:${[...incomingWords].sort().join("+")}`;
  const others = current.filter((rule) => rule.id !== incomingId);
  const clash = others.find((rule) => rule.keywords.some((word) => incomingWords.includes(word)));
  if (clash) {
    return {
      ok: false,
      reason: `keyword already used by ${clash.id}`,
      expected_revision: revision,
      rules: current,
      diff: { added: [], changed: [], kept: current.map((rule) => rule.id) },
    };
  }
  const previous = current.find((rule) => rule.id === incomingId);
  const nextRule = { id: incomingId, keywords: incomingWords };
  const rules = [...others, nextRule].sort((a, b) => a.id.localeCompare(b.id));
  const changed = previous && !sameWords(previous.keywords, incomingWords) ? [incomingId] : [];
  const added = previous ? [] : [incomingId];
  const kept = others.map((rule) => rule.id).sort((a, b) => a.localeCompare(b));
  return {
    ok: true,
    reason: previous ? "rule updated, other rules kept" : "rule added, other rules kept",
    expected_revision: revision,
    rules,
    diff: { added, changed, kept },
  };
}
