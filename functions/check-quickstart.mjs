export function checkQuickstart(input = {}) {
  const stops = [];
  if (input.workspace_id !== input.expected_workspace_id) stops.push("workspace does not match");
  if (!input.contracts_returned) stops.push("a contract did not return");
  if (Number(input.spend_credits) !== 0) stops.push("spend in the window is not 0");
  if (Number(input.writes || 0) > 0 && !input.sandbox_approved) stops.push("a write happened without a sandbox yes");
  return { ok: stops.length === 0, stops };
}
