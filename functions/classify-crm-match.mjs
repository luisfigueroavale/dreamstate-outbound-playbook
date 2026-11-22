function result(fields) {
  return {
    class: fields.class,
    reason: fields.reason,
    sync_allowed: Boolean(fields.record_id),
    record_id: fields.record_id ?? null,
    next: fields.next,
  };
}

export function classifyCrmMatch(input = {}) {
  if (input.status === "error" || input.error) {
    return result({
      class: "failed",
      reason: String(input.error || "search error"),
      record_id: null,
      next: "hold",
    });
  }
  const email = String(input.email ?? "").trim().toLowerCase();
  const records = Array.isArray(input.records) ? input.records : [];
  const exact = records.filter((record) => String(record.email ?? "").trim().toLowerCase() === email && email);
  if (exact.length === 1) {
    const recordId = exact[0].id ?? null;
    return result({
      class: "existing",
      reason: recordId ? "one exact email match" : "one exact email match without a record id",
      record_id: recordId,
      next: recordId ? "sync" : "hold",
    });
  }
  if (exact.length > 1) {
    return result({
      class: "ambiguous",
      reason: "more than one exact email match",
      record_id: null,
      next: "hold",
    });
  }
  if (records.length > 0) {
    return result({
      class: "ambiguous",
      reason: "name match without one exact email",
      record_id: null,
      next: "hold",
    });
  }
  return result({
    class: "new",
    reason: "no matching record",
    record_id: null,
    next: "assert_record",
  });
}
