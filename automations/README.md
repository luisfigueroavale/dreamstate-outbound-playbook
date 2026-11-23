# Automations

Three plays, each disabled. Import creates a disabled workflow. Enable is a separate yes. The imported graph is the decision path: local functions and approval nodes. It does not run the Dreamstate calls. The agent runs the call plan in the same folder. A code node does not call the network.

classify-crm-match, tier-engagers, and pick-reply-line stay in the call plans. The graphs do not have CRM search results, fit rules, or a reply list, so those functions are not nodes. The first code node in each graph reads the trigger payload. A later code node would read the previous node's result.

| Folder | Trigger in v1 | What waits for a yes |
| --- | --- | --- |
| [form-to-crm](form-to-crm/README.md) | Webhook source on a worksheet, then a manual graph | Each sync |
| [post-engagers-rollup](post-engagers-rollup/README.md) | Manual. A schedule is its own yes | Harvest, upserts, the fit quote |
| [comment-keyword-share](comment-keyword-share/README.md) | Manual | The rule replace, each reply, any DM |

`npm run plan-install` prints preflight, lint, and import. It does not call them.
