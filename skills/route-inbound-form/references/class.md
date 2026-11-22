# CRM class

## Inputs

q is the normalised email. crm.records.search is free. limit defaults to 25.

## Call

Pass the records into classify-crm-match. existing is one exact email. new is none. ambiguous is more than one, or a name match without one exact email. failed is a search error.

## Show the owner

The class, the reason, and the single record id when there is one. Only new and existing may continue.

## Failure cases

An error status. Class failed. Do not sync.
Two records. Stop and show both.
