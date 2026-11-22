# Upsert

## Inputs

table_id resolved at run time, row_kind person for people and the touch worksheet's kind for touches. See automations/post-engagers-rollup/worksheets.md.

## Call

tables.rows.upsert is 0 credits and a write. dry_run first, quote, wait for the owner's yes on that item. Two worksheets: Warm touches and Warm people.

## Show the owner

How many rows the dry run would write. Do not claim they exist until the live call returns.

## Failure cases

The worksheet id is missing. Stop. Do not create a second workbook to hide the miss.
