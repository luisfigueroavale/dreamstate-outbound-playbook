# Settings copy

## Inputs

The templates in settings/. team.json, reply-lines.md, and dm-text.md start with Status: blank. tiers.json and stack-rules.json are working defaults.

## Call

Copy the folder to settings.local/. Do not commit the copy. Fill team.json with person ids to exclude from engager rollups. Leave reply lines and the DM blank until the owner accepts the text.

## Show the owner

Which files are still blank. A blank team list means the rollup cannot exclude teammates yet.

## Failure cases

The copy already exists and the owner has edited it. Do not overwrite it.
A needed file is missing. Stop.
