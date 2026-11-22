# Check the saved responses

## Inputs

A JSON file under work/quickstart/ with workspace_id, expected_workspace_id, contracts_returned, spend_credits, writes, sandbox_approved.

## Call

Run the local function check-quickstart. It does not call Dreamstate. work/ is git-ignored.

## Show the owner

ok true, or the stop reasons. A write without sandbox_approved is a stop.

## Failure cases

The file is missing. Stop. Do not mark the check passed from memory.
