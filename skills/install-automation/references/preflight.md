# Preflight

## Inputs

kind workflow. document is the document object inside automations/<name>/graph.json, not the wrapper. The wrapper status stays disabled.

## Call

workflow.automations.import_preflight. Free read. Empty unresolved_bindings means every authenticated field is already bound. A name in that list is a slot to bind, not a summary.

## Show the owner

The unresolved names, one per line. If the list is not empty, stop before import.

## Failure cases

The document is rejected. Show the error. Do not drop fields to force a pass.
