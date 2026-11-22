# Where to look

Worksheets open from the link the source catalog returns, in the shape `/dashboard/workbooks/{workbook_id}/worksheets/{id}`. Use the ids the call returned.

Runs: `runs_list` and `runs_get` are the MCP names in the plan. This build did not confirm them with `tools_get`. `tables.search_runs.get` is confirmed for a durable search run. If `runs_get` is not found, stop and say so.

Approvals: `workflow.approvals.list` is free. `workflow.approvals.decide` needs the `plan_hash` from that list. A stale hash is refused.

Spend: `workspace.usage.spend_breakdown` takes `from`. `workspace.usage.history_list` is the paged history. `workspace.usage.status_get` is the workspace plan. Do not quote a seat price from memory.

Nothing on this page sends, posts, or deletes.
