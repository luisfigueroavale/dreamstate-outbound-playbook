# Automations

Three plays, each disabled. Import creates a disabled workflow. Enable is a separate yes. The call plan is the order of Dreamstate calls. The graph holds the local functions and the approval nodes. A code node does not call the network.

| Folder | Trigger in v1 | What waits for a yes |
| --- | --- | --- |
| [form-to-crm](form-to-crm/README.md) | Webhook source on a worksheet, then a manual graph | Each sync |
| [post-engagers-rollup](post-engagers-rollup/README.md) | Manual. A schedule is its own yes | Harvest, upserts, the fit quote |
| [comment-keyword-share](comment-keyword-share/README.md) | Manual | The rule replace, each reply, any DM |

`npm run plan-install` prints preflight, lint, and import. It does not call them.
