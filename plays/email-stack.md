# Email stack

Nothing in a live sequence until the domains, the DNS records, the mailbox age, the bounce, the daily cap, and suppression are in a state you can explain.

## Steps

1. `senders.domains.sending.list` lists sending domains. Free.
2. `senders.domains.health_list` reads the latest SPF, DKIM, and DMARC observation. A `provider_managed` domain is skipped. The read does not query DNS itself.
3. `senders.mailboxes.list` lists connected mailboxes and the stored daily cap. Free.
4. `senders.mailboxes.health_get` reads the 7 day bounce. Null means not measured.
5. `senders.mailboxes.warmup_seed_list_report_get` reads ramp age for one mailbox. Free. It does not change the mailbox.
6. `senders.suppressions.add` adds one do-not-contact value. 0 credits, and still a yes, because it changes who can be contacted.

Buying domains and mailboxes is outside Dreamstate. The owner chooses that path. This play does not name a seller.

## What needs a yes

No sender field is changed by the grader. Adding a suppression needs a yes. A placement probe is not this play.

## Run it with

[check-email-stack](../skills/check-email-stack/SKILL.md). Thresholds are the working defaults in [settings/stack-rules.json](../settings/stack-rules.json). The daily cap figure is to-check against [dreamstate-gtm-team/docs/rules.md](https://github.com/luisfigueroavale/dreamstate-gtm-team/blob/main/docs/rules.md).
