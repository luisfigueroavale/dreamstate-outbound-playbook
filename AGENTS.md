# Agent contract

This folder is the outbound playbook for one owner. Dreamstate is the system of record for people, forms, sequences, and the notes worth keeping. Files here are the plays, the skills, and the blank templates. Codex is the preferred agent. Claude Code follows this same file.

Read [docs/start-here.md](docs/start-here.md), then [brand/AGENTS.md](brand/AGENTS.md). `set-up-playbook` may create `settings.local/` from the templates. After that, a missing or blank file the current task needs means stop and ask. Do not guess.

Company facts come from Company Context through `knowledge.context.resolve`. The settings files point at those pages. Approvals follow `docs/rules.md` in [dreamstate-gtm-team](https://github.com/luisfigueroavale/dreamstate-gtm-team).

## Workspace

Call `whoami` before the first Dreamstate read in a session. If more than one workspace is listed, ask which one and stop until the owner names it. The server is the single URL in [.mcp.json](.mcp.json). Do not add a second server. Do not paste a key. Sign in through the browser.

## Consent

Nothing sends, enrolls, launches, posts, spends credits, pushes to a CRM, changes a schedule, switches on a workflow or a rule, or deletes without the owner's yes on that item. A paid call is quoted first. Show the quote and wait. Unknown is not zero. Do not invent a fact or a number.

A local draft, a plan, or a pull request that is waiting for review is allowed. Say that nothing has been sent.

## Files

Do not commit `brand.local/`, `audience.local/`, `settings.local/`, `.banned-terms.local`, `data/`, `output/`, `work/`, or any key or `.env` file. The templates in `brand/` stay blank. `team.json`, `reply-lines.md`, and `dm-text.md` stay blank in git.

## Checks

Run `npm run check` and `npm test` before you say a change is done. `npm run check -- --strict` needs `.banned-terms.local` on the machine, one name per line.
