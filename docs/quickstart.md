# Quickstart

About five minutes. All free, until you choose the optional sandbox. `npm run quickstart` prints the same calls and does not make them.

1. `whoami`. Stop unless the workspace is the one in `settings.local/`. For the owner of this repo that id is `0a13cecd-d194-46e5-94cc-328825aef631` until a local file says otherwise.
2. `tools_search` with goal "find a verified work email" and `toolset` `tables`. Show the top three.
3. `tools_get` on `tables.contacts.verify_email`. Say the cost in plain words. On 2026-11-22 that was 0.45 credits an address.
4. `tables.findable_catalog.list` with query `engaged`. Show each source and its price.
5. `workspace.usage.status_get` and `workspace.usage.spend_breakdown` with `from` set to one hour ago. Show the credits from this check. They should be 0.
6. Optional, after a yes: `tables.workbooks.create` named "Sandbox: quickstart" with two fictional rows and `row_origin` `user_supplied`, then `tables.rows.query`. 0 credits. The sandbox stays. Deleting it is a separate yes.
7. Save the responses under `work/quickstart/` and run the local `check-quickstart` function.

A paid or writing step, including the sandbox write, says: dry_run first, quote, wait for the owner's yes on that item.
