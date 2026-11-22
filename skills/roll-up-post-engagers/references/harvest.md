# Harvest

## Inputs

worksheet_id, linkedin_account_id, and post_id. All three are required and resolved at run time.

## Call

visibility.linkedin.engagement_harvest is 0 credits and a write. dry_run first, quote, wait for the owner's yes on that item. Then read visibility.linkedin.engagement_status until done. Read people with visibility.linkedin.engagement_engagers. On timeout, runs_get on the same key. Do not harvest a second time. runs_get is an MCP read named in the plan and was not confirmed with tools_get on this build. If tools_get says not found, stop and say so.

## Show the owner

Harvest id, status, and the engager count. A zero can be real. Say the denominator is the posts you harvested.

## Failure cases

Status never reaches done. Stop after the timeout read.
You start a second harvest for the same post. Do not.
