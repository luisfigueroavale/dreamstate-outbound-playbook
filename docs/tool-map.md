# Tool map

Prices and contracts were read on 2026-11-22 in the Dreamstate workspace, server 1.3.33. Confirmed means tools_get returned the contract, or tables.findable_catalog.list returned the card, that day. Unconfirmed means this build did not get a full price or a tools_get contract. Fetch again before a live call. The fetched schema wins.

Definition ids (source, provider, column) are not pasted as vendor names. Resolve them at run time.

| Id | Cost | Status | Consent | Inputs | CLI |
| --- | --- | --- | --- | --- | --- |
| `whoami` | 0 credits | confirmed | free read | none | MCP whoami |
| `tools_search` | 0 credits | confirmed | free read | goal or query_terms; toolset when the pack is known | MCP tools_search |
| `tools_get` | 0 credits | confirmed | free read | capability_id or up to 10 capability_ids | MCP tools_get |
| `tools_run` | quoted, ceiling depends on the target | confirmed | dry_run first when the target spends, writes, or sends | capability_id, mode, params | dreamstate tools run <id> |
| `runs_get` | unconfirmed, do not assume 0 credits | unconfirmed | read if it matches other run reads; confirm with tools_get before use | run id | MCP runs_get |
| `runs_list` | unconfirmed, do not assume 0 credits | unconfirmed | read if it matches other run reads; confirm with tools_get before use | filters | MCP runs_list |
| `workspace.usage.status_get` | 0 credits | confirmed | free read | none | dreamstate tools run workspace.usage.status_get |
| `workspace.usage.spend_breakdown` | 0 credits | confirmed | free read | from (ISO), optional to, group_by, limit | dreamstate tools run workspace.usage.spend_breakdown |
| `workspace.usage.history_list` | 0 credits | confirmed | free read | optional limit, cursor | dreamstate tools run workspace.usage.history_list |
| `workspace.thumbnail_preferences_get` | unconfirmed, do not assume 0 credits | unconfirmed | named in the copied brand template; confirm with tools_get before use | unconfirmed | confirm with tools_get |
| `knowledge.context.resolve` | 0 credits | confirmed | free read | optional purpose, brain_section_keys, brain_query_terms, brain_claim_limit | dreamstate tools run knowledge.context.resolve |
| `tables.findable_catalog.list` | 0 credits | confirmed | free read | optional query, kinds, definition_id, produces, limit | dreamstate tools run tables.findable_catalog.list |
| `tables.columns.catalog` | 0 credits | confirmed | free read | optional family classification, ai, or research | dreamstate tools run tables.columns.catalog |
| `tables.sourcing.preview` | 0 credits | confirmed | free read | definition_id, source_inputs, optional limit 1 to 10 | dreamstate tools run tables.sourcing.preview |
| `tables.company_search.run` | 0 credits on this call, external | confirmed | yes, it calls out | route_id from the plan call | dreamstate tools run tables.company_search.run |
| `tables.people_search.run` | 0 credits on this call, external | confirmed | yes, it calls out | people, company, or from_table, optional limit | dreamstate tools run tables.people_search.run |
| `tables.workbooks.create` | 0 credits | confirmed | yes, it writes | name, optional first_worksheet | dreamstate tools run tables.workbooks.create |
| `tables.rows.query` | 0 credits | confirmed | free read | table_id | dreamstate tools run tables.rows.query |
| `tables.rows.create_many` | 0 credits | confirmed | yes, it writes | table_id, rows, row_origin user_supplied for handed rows | dreamstate tools run tables.rows.create_many |
| `tables.rows.upsert` | 0 credits | confirmed | yes, it writes | table_id, row_kind, subject_id or external_key | dreamstate tools run tables.rows.upsert |
| `tables.columns.add` | 0 credits | confirmed | yes, it writes | table_id, name, optional binding_spec | dreamstate tools run tables.columns.add |
| `tables.columns.run` | quoted, ceiling 50 credits a call | confirmed | dry_run first, quote, wait for the owner's yes on that item | table_id, column_key or column_id, optional limit | dreamstate tools run tables.columns.run |
| `tables.contacts.verify_email` | 0.45 credits an address, maximum 45 a call | confirmed | yes, live also asks for a ceiling from 3 to 300 | addresses | dreamstate tools run tables.contacts.verify_email |
| `tables.auto_run.set` | 0 credits | confirmed | yes, standing action | table_id, column_ids, triggers, max_credits_per_run | dreamstate tools run tables.auto_run.set |
| `tables.search_runs.get` | 0 credits | confirmed | free read | run_id | dreamstate tools run tables.search_runs.get |
| `sequence.outreach.enrichment_sequence_get` | 0 credits | confirmed | free read | none | dreamstate tools run sequence.outreach.enrichment_sequence_get |
| `sequence.sequences.create_from_worksheet` | 0 credits | confirmed | yes, it writes a draft | worksheet_id, name, steps | dreamstate tools run sequence.sequences.create_from_worksheet |
| `sequence.sequences.enroll_selection` | 0 credits | confirmed | yes, it enrolls | sequence_id, worksheet_id | dreamstate tools run sequence.sequences.enroll_selection |
| `sequence.sequences.activate_audience` | 0 credits, external send | confirmed | yes, it can send | sequence_id | dreamstate tools run sequence.sequences.activate_audience |
| `sequence.sequences.variants_get` | 0 credits | confirmed | free read | sequence_id | dreamstate tools run sequence.sequences.variants_get |
| `sequence.outreach.analytics_variant_compare` | 0 credits | confirmed | free read | sequence_id, objective | dreamstate tools run sequence.outreach.analytics_variant_compare |
| `crm.contact.find_email` | dry_run 0 credits, live up to 50 | confirmed | dry_run first, quote, wait for the owner's yes on that item | name, company, or profile url | dreamstate tools run crm.contact.find_email |
| `crm.records.search` | 0 credits | confirmed | free read | optional q, limit, offset | dreamstate tools run crm.records.search |
| `crm.signals.search_run` | quoted, high ceiling | confirmed | dry_run first, quote, wait for the owner's yes on that item | definition_id, and approved on live | dreamstate tools run crm.signals.search_run |
| `integrations.signal_sources.list` | 0 credits | confirmed | free read | optional include_archived, limit | dreamstate tools run integrations.signal_sources.list |
| `integrations.sync` | 0 credits, external | confirmed | yes per record | record_id, optional provider hubspot, salesforce, or attio | dreamstate tools run integrations.sync |
| `integrations.health_get` | 0 credits | confirmed | free read | optional provider hubspot, salesforce, or attio | dreamstate tools run integrations.health_get |
| `integrations.crm_management_preview` | 0 credits | confirmed | free read | connection_id, configuration | dreamstate tools run integrations.crm_management_preview |
| `visibility.linkedin.engagement_harvest` | 0 credits | confirmed | yes, it writes | worksheet_id, linkedin_account_id, post_id | dreamstate tools run visibility.linkedin.engagement_harvest |
| `visibility.linkedin.engagement_status` | 0 credits | confirmed | free read | harvest_id | dreamstate tools run visibility.linkedin.engagement_status |
| `visibility.linkedin.engagement_engagers` | 0 credits | confirmed | free read | harvest_id, optional max_pages | dreamstate tools run visibility.linkedin.engagement_engagers |
| `social.outreach.keyword_dm_rules.list` | 0 credits | confirmed | free read | artifact_id, optional platform | dreamstate tools run social.outreach.keyword_dm_rules.list |
| `social.outreach.keyword_dm_rules.replace` | 0 credits, destructive | confirmed | yes | artifact_id, platform, expected_revision, rules | dreamstate tools run social.outreach.keyword_dm_rules.replace |
| `social.comments.reply` | 0 credits | confirmed | yes, it writes a preview | comment_id, account_id, optional text | dreamstate tools run social.comments.reply |
| `social.comments.approve` | 0 credits, external post | confirmed | yes on that text | action_id, content_hash, approved true | dreamstate tools run social.comments.approve |
| `unibox.context.thread_reply_send` | 0 credits, external send | confirmed | yes | conversation_id, content, client_request_id | dreamstate tools run unibox.context.thread_reply_send |
| `workflow.automations.import_preflight` | 0 credits | confirmed | free read | kind workflow, document | dreamstate tools run workflow.automations.import_preflight |
| `workflow.automations.lint` | 0 credits | confirmed | free read | kind workflow, document | dreamstate tools run workflow.automations.lint |
| `workflow.automations.import` | 0 credits | confirmed | yes, creates a disabled workflow | kind, name, document | dreamstate tools run workflow.automations.import |
| `workflow.automations.export` | 0 credits | confirmed | free read | kind, automation_id | dreamstate tools run workflow.automations.export |
| `workflow.automations.node_catalog` | 0 credits | confirmed | free read | optional kind, query, subject | dreamstate tools run workflow.automations.node_catalog |
| `workflow.automations.node_inspect` | 0 credits | confirmed | free read | kind plus subtype and node_kind, or an existing node | dreamstate tools run workflow.automations.node_inspect |
| `workflow.workflows.enable` | 0 credits, external | confirmed | yes | workflow_ids | dreamstate tools run workflow.workflows.enable |
| `workflow.workflows.call` | quoted, ceiling 50 credits | confirmed | dry_run first, quote, wait for the owner's yes on that item | workflow_id, input_json | dreamstate tools run workflow.workflows.call |
| `workflow.approvals.list` | 0 credits | confirmed | free read | optional workflow_id, status, limit | dreamstate tools run workflow.approvals.list |
| `workflow.approvals.decide` | 0 credits | confirmed | yes | approval_id, decision, plan_hash | dreamstate tools run workflow.approvals.decide |
| `senders.linkedin_accounts.list` | 0 credits | confirmed | free read | optional limit | dreamstate tools run senders.linkedin_accounts.list |
| `senders.domains.sending.list` | 0 credits | confirmed | free read | optional limit | dreamstate tools run senders.domains.sending.list |
| `senders.domains.health_list` | 0 credits | confirmed | free read | optional limit | dreamstate tools run senders.domains.health_list |
| `senders.mailboxes.list` | 0 credits | confirmed | free read | optional limit | dreamstate tools run senders.mailboxes.list |
| `senders.mailboxes.health_get` | 0 credits | confirmed | free read | optional account_ids | dreamstate tools run senders.mailboxes.health_get |
| `senders.mailboxes.warmup_seed_list_report_get` | 0 credits | confirmed | free read | mailbox_id | dreamstate tools run senders.mailboxes.warmup_seed_list_report_get |
| `senders.suppressions.add` | 0 credits | confirmed | yes, it changes who can be contacted | kind and value, or person, plus reason | dreamstate tools run senders.suppressions.add |
| `source.company_search` | 1 credit a row | confirmed | quote the run before it is live | company filters, from the card | resolve with tables.findable_catalog.list |
| `provider.linkedin.people.search` | 0 credits a row | confirmed | needs a sender, quote before a live run | search words, from the card | resolve with tables.findable_catalog.list |
| `provider.enrich.email` | up to 12.45 credits a row | confirmed | dry_run first, quote, wait for the owner's yes on that item | name or profile, from the card | resolve with tables.findable_catalog.list |
| `provider.enrich.person.waterfall` | price varies, quote it | confirmed | dry_run first, quote, wait for the owner's yes on that item | identity fields, from the card | resolve with tables.findable_catalog.list |
| `provider.enrich.hiring` | up to 1 credit a row | confirmed | dry_run first, quote, wait for the owner's yes on that item | company domain or company profile url | resolve with tables.findable_catalog.list |
| `column.ai_fit_score` | 0.04 credits a row | confirmed | dry_run first, quote, wait for the owner's yes on that item | prompt, optional model | resolve with tables.findable_catalog.list |
| `column.research` | price varies, quote it | confirmed | dry_run first, quote, wait for the owner's yes on that item | query | resolve with tables.findable_catalog.list |
| `column.web_search` | 4 credits a row | confirmed | dry_run first, quote, wait for the owner's yes on that item | query | resolve with tables.findable_catalog.list |
| `source.webhook_source` | 0 credits minimum, maximum not stated | confirmed | yes to bind, secret required | require_secret, upsert_field | resolve with tables.findable_catalog.list |
| `source.engaged_with_account` | 1 credit a row | confirmed | dry_run first, quote, wait for the owner's yes on that item | profiles you choose, from the card | resolve with tables.findable_catalog.list |
| `source.engaged_with_company` | 1 credit a row | confirmed | dry_run first, quote, wait for the owner's yes on that item | company pages you choose, from the card | resolve with tables.findable_catalog.list |
| `source.linkedin_jobs` | 1 credit a row | confirmed | dry_run first, quote, wait for the owner's yes on that item | job filters, from the card | resolve with tables.findable_catalog.list |
| `source.linkedin_profile_viewers` | 0 credits a run | confirmed | free on the card, still resolve the sender at run time | connected account, from the card | resolve with tables.findable_catalog.list |
| `source.linkedin_followers` | 0 credits minimum, maximum not stated | unconfirmed | do not treat a missing maximum as zero | account or page, from the card | resolve with tables.findable_catalog.list |
| `source.dm_received` | 0 credits a row | confirmed | free on the card | from the card | resolve with tables.findable_catalog.list |
| `source.meeting_booked` | 0 credits a row | confirmed | free on the card | from the card | resolve with tables.findable_catalog.list |
| `source.watched_company_page_posts` | 0.4 credits a row | confirmed | dry_run first, quote, wait for the owner's yes on that item | watched pages, from the card | resolve with tables.findable_catalog.list |
