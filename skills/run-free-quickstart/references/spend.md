# Spend in the window

## Inputs

workspace.usage.status_get takes no params. workspace.usage.spend_breakdown requires from, an ISO timestamp one hour ago. to defaults to now.

## Call

Both are free reads. Pass from as a real timestamp, not the placeholder in the printed plan.

## Show the owner

Credits spent since from. This check should show 0 if you made no paid call. The status read is the workspace plan. Do not quote a seat price from memory.

## Failure cases

Spend is not 0. Stop and say which capability the breakdown names. Do not hide it.
from is missing. The call will fail. Do not omit it.
