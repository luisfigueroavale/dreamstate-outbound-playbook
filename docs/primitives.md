# Five primitives

| Primitive | Dreamstate ids | Cost | Skill |
| --- | --- | --- | --- |
| Find people or companies | `tables.sourcing.preview`, `tables.company_search.run`, `tables.people_search.run`, `source.company_search`, `provider.linkedin.people.search`, CSV through `tables.rows.create_many` | Preview is free. Company search rows are 1 credit on the card. People search on LinkedIn is 0 a row and needs a sender. A run is quoted. | [pick-a-play](../skills/pick-a-play/SKILL.md) |
| Fill a verified email | `provider.enrich.email`, `sequence.outreach.enrichment_sequence_get`, `crm.contact.find_email`, `tables.contacts.verify_email` | Email column up to 12.45 a row. Verify 0.45 an address. One-off lookup dry run is free, live up to 50. | Engine `find-verified-email` |
| Catch a signal | `source.engaged_with_account`, `source.engaged_with_company`, `source.linkedin_jobs`, `source.linkedin_profile_viewers`, `source.linkedin_followers`, `source.dm_received`, `source.meeting_booked`, `source.watched_company_page_posts`, `crm.signals.search_run` | See [tool-map.md](tool-map.md). Funding and a tech-stack change are not sources. Use `column.research` or `column.web_search` and quote them. | [roll-up-post-engagers](../skills/roll-up-post-engagers/SKILL.md) |
| Judge a row | `tables.columns.add` with `column.ai_fit_score`, then `tables.columns.run` | 0.04 a row. The run is quoted. Ceiling 50 a call. | [tier-warm-people](../skills/tier-warm-people/SKILL.md) |
| Hand off | `sequence.sequences.create_from_worksheet`, `sequence.sequences.enroll_selection`, `sequence.sequences.activate_audience`, `integrations.sync` | Draft is free. Enroll and activate wait for a yes. Sync is 0 credits and returns queued. | [route-inbound-form](../skills/route-inbound-form/SKILL.md) |

A paid or writing step says: dry_run first, quote, wait for the owner's yes on that item.
