export function classifyCrmMatch(input = {}) {
  if (input.status === "error" || input.error) {
    return {
      class: "failed",
      reason: String(input.error || "search error"),
      sync_allowed: false,
      record_id: null,
    };
  }
  const email = String(input.email ?? "").trim().toLowerCase();
  const records = Array.isArray(input.records) ? input.records : [];
  const exact = records.filter((record) => String(record.email ?? "").trim().toLowerCase() === email && email);
  if (exact.length === 1) {
    return {
      class: "existing",
      reason: "one exact email match",
      sync_allowed: true,
      record_id: exact[0].id ?? null,
    };
  }
  if (exact.length > 1) {
    return {
      class: "ambiguous",
      reason: "more than one exact email match",
      sync_allowed: false,
      record_id: null,
    };
  }
  if (records.length > 0) {
    return {
      class: "ambiguous",
      reason: "name match without one exact email",
      sync_allowed: false,
      record_id: null,
    };
  }
  return {
    class: "new",
    reason: "no matching record",
    sync_allowed: true,
    record_id: null,
  };
}
