function blank(value) {
  return String(value ?? "").trim();
}

export function touchKey(personId, postId, kind, reaction) {
  const reactionPart = kind === "comment" ? "" : blank(reaction);
  return [personId, postId, kind, reactionPart].join("|");
}

export function rollUpEngagers(input = {}) {
  const posts = Array.isArray(input.posts) ? input.posts : [];
  const keptPosts = new Map();
  for (const post of posts) {
    const id = blank(post.id);
    if (!id || post.is_repost) continue;
    keptPosts.set(id, post);
  }
  const excluded = new Set((input.exclude_person_ids ?? []).map((id) => blank(id)).filter(Boolean));
  const touches = new Map();

  for (const row of input.engagements ?? []) {
    const postId = blank(row.post_id);
    const personId = blank(row.person_id);
    if (!personId || !keptPosts.has(postId) || excluded.has(personId)) continue;
    const kind = row.kind === "comment" ? "comment" : "reaction";
    const reaction = kind === "comment" ? "" : blank(row.reaction);
    const key = touchKey(personId, postId, kind, reaction);
    const at = blank(row.at);
    const existing = touches.get(key);
    if (!existing) {
      touches.set(key, {
        key,
        person_id: personId,
        post_id: postId,
        kind,
        reaction,
        at,
        name: blank(row.name),
      });
      continue;
    }
    if (at && (!existing.at || at < existing.at)) existing.at = at;
    const name = blank(row.name);
    if (name.length > existing.name.length) existing.name = name;
  }

  const byPerson = new Map();
  for (const touch of touches.values()) {
    let person = byPerson.get(touch.person_id);
    if (!person) {
      person = {
        person_id: touch.person_id,
        name: touch.name,
        first_seen: touch.at,
        last_seen: touch.at,
        last_post_id: touch.post_id,
        touches: 0,
        posts: new Set(),
        comment_count: 0,
        best_evidence: "reaction",
      };
      byPerson.set(touch.person_id, person);
    }
    person.touches += 1;
    person.posts.add(touch.post_id);
    if (touch.kind === "comment") {
      person.comment_count += 1;
      person.best_evidence = "comment";
    }
    if (touch.name.length > person.name.length) person.name = touch.name;
    if (touch.at && (!person.first_seen || touch.at < person.first_seen)) person.first_seen = touch.at;
    if (touch.at && (!person.last_seen || touch.at > person.last_seen || (touch.at === person.last_seen && touch.post_id > person.last_post_id))) {
      person.last_seen = touch.at;
      person.last_post_id = touch.post_id;
    }
  }

  const people = [...byPerson.values()]
    .map((person) => ({
      person_id: person.person_id,
      name: person.name,
      first_seen: person.first_seen,
      last_seen: person.last_seen,
      touches: person.touches,
      distinct_posts: person.posts.size,
      comment_count: person.comment_count,
      last_post_id: person.last_post_id,
      best_evidence: person.best_evidence,
    }))
    .sort((a, b) => a.person_id.localeCompare(b.person_id));

  const touchRows = [...touches.values()]
    .map(({ name, ...touch }) => touch)
    .sort((a, b) => a.key.localeCompare(b.key));

  return { touches: touchRows, people };
}
