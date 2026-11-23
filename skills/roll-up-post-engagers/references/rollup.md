# Roll up

## Inputs

Posts, engagements, exclude_person_ids from settings.local/team.json, and as_of. If team.json still says Status: blank, stop.

## Call

Local function roll-up-engagers. Skip reposts and posts with no id. Touch key is person id, post id, kind, and reaction. Reaction is blank for a comment. Output is sorted by person id.

## Show the owner

Touch count, people count, and who was excluded. Show one example key.

## Failure cases

The team file is blank. Stop.
A name conflict. Keep the longest non-empty name and say so.
