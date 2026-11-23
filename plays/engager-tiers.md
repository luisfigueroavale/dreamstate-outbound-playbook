# Engager tiers

People who engage with your posts, ranked by fit and by showing up more than once. The top tier gets your own note. The middle tier gets a draft LinkedIn sequence. Unknown fit is held.

## Steps

1. Resolve the sender with `senders.linkedin_accounts.list`. Free. Do not paste an account id into the repo.
2. For your own posts, `visibility.linkedin.engagement_harvest` is 0 credits and a write. Default the last 10 posts, cap 25. Then read `visibility.linkedin.engagement_status` and `visibility.linkedin.engagement_engagers`.
3. Roll the rows up. A repost is skipped. A teammate in `settings.local/team.json` is skipped. One person reacting twice the same way is one touch.
4. Score with `column.ai_fit_score` at 0.04 a row. Quote one row first.
5. Tier from [settings/tiers.json](../settings/tiers.json). Tier 1 is fit at or over 75 and a comment or two distinct posts. Tier 2 is fit at or over 55. Unknown fit is hold. A last touch older than 30 days drops one tier. Past 10 tier 1 rows in the week, the rest become tier 2 with a reason.
6. Tier 2 can become a draft with `sequence.sequences.create_from_worksheet`. The draft is free. Enrollment is not this play.
7. Posts that are not yours use `source.engaged_with_account` at up to 1 credit a row, quoted. A single post, right after it goes live, is [score-post-engagers](https://github.com/luisfigueroavale/dreamstate-linkedin-funnel/blob/main/skills/score-post-engagers/SKILL.md). This play covers many posts over time.

## What needs a yes

Harvest, each upsert, adding the fit column, the live score, the paid pull for posts that are not yours, the tier 2 draft, and any later enrollment.

## Run it with

[roll-up-post-engagers](../skills/roll-up-post-engagers/SKILL.md) then [tier-warm-people](../skills/tier-warm-people/SKILL.md).
