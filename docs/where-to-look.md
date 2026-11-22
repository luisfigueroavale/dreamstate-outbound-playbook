# Where to look

Worksheets open from the link the source catalog returns, in the shape `/dashboard/workbooks/{workbook_id}/worksheets/{id}`. Use the ids the call returned.

Runs: `runs_list` and `runs_get` are confirmed bare MCP reads. `runs_get` takes `run_id` and an optional `wait_seconds` up to 20. `runs_list` takes optional statuses, capability_id, since, limit up to 500, and cursor. `tables.search_runs.get` reads a durable search run.

Approvals: `workflow.approvals.list` is free. `workflow.approvals.decide` needs the `plan_hash` from that list. A stale hash is refused.

Spend: `workspace.usage.spend_breakdown` takes `from`. `workspace.usage.history_list` is the paged history. `workspace.usage.status_get` is the workspace plan. Do not quote a seat price from memory.

Nothing on this page sends, posts, or deletes.
