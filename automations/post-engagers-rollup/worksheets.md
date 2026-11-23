# Worksheets

Create these when the owner says yes. Do not invent their ids in this repo.

## Warm touches

One row per touch key: person id, post id, kind, reaction. Reaction is blank for a comment. A repeated reaction with the same key updates the row. It does not add a second one.

## Warm people

One row per person id. Columns: name, first seen, last seen, touches, distinct posts, comment count, last post id, best evidence, fit, tier, reason.

Best evidence is a comment when they have one, otherwise a reaction. Conflicting names keep the longest non-empty value.

`tables.rows.upsert` writes a row the owner handed the function, or one pinned by subject id. Pass the idempotency key from the touch key.
