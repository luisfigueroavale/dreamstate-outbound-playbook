# Normalise

## Inputs

email and form_id. The local function normalise-inbound trims and lowercases the email. The idempotency key is the SHA-256 of the email plus the form id.

## Call

No Dreamstate call. Personal mailbox domains are marked personal and held. A duplicate key is held.

## Show the owner

The class: work, personal, missing, or malformed. The key, so a repeat form is visible.

## Failure cases

A missing email. Hold with that reason. Do not invent one from the name.
