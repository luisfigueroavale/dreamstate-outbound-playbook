# Grade

## Inputs

The saved reads plus settings/stack-rules.json, or settings.local/stack-rules.json when the owner has copied it. Working defaults: SPF, DKIM, and DMARC observed, 7 day bounce at or under 0.02, warmup at least 14 days. The daily cap maximum is null and marked to-check because dreamstate-gtm-team/docs/rules.md does not state a number.

## Call

Local function grade-email-stack. A provider managed domain is skipped with a note. A mailbox holds when bounce is over the limit, warmup is younger than the minimum, bounce or warmup was not measured, or no daily cap is set. Every hold names the Sequences and Deliverability seat.

## Show the owner

Pass or hold per domain and mailbox, with the reason. The to-check notes: the 0.02 bounce limit, the 14 day warmup minimum, and the missing daily cap figure. A mailbox holds while that figure is missing, even when a cap is already set.

## Failure cases

You treat an unmeasured bounce as 0. Do not.
