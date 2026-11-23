# Merge

## Inputs

The current rules, the revision, and one rule to add or edit. Keywords are compared case-insensitively.

## Call

Local function merge-keyword-rule. It keeps every other rule. On an edit, fields the caller sent besides the id are applied, and fields they did not send stay. A keyword already used by another rule is a clash and the old set is returned.

## Show the owner

The diff: added, changed, kept. On a clash, the reason and the rule that already owns the word.

## Failure cases

You drop a rule to make the clash go away. Do not, unless the owner asked to remove that rule by id.
