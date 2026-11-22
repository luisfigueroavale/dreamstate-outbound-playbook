# Draft sequence

## Inputs

worksheet_id of the tier 2 rows, a name, and steps. This creates a draft. It does not enroll.

## Call

sequence.sequences.create_from_worksheet is 0 credits and a write. dry_run first, quote, wait for the owner's yes on that item. Enrollment is sequence.sequences.enroll_selection and is not this step. Activation is sequence.sequences.activate_audience and is not this step.

## Show the owner

The draft id and the step count. Say nobody was enrolled.

## Failure cases

You activate in the same step. Do not. Tier 1 is a list for the owner, not this draft.
