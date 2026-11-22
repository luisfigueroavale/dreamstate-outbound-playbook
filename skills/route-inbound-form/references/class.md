# CRM class

## Inputs

q is the normalised email. crm.records.search is free.

## Call

Pass the records into classify-crm-match. existing is one exact email and includes the record id. new is none, with next assert_record and sync_allowed false. ambiguous is more than one match, or a name match without one exact email. failed is a search error. next is hold for those.

## Show the owner

The class, the reason, next, and the record id when one exists.

## Failure cases

An error status. Class failed. Do not assert and do not sync.
Two records. Stop and show both.
