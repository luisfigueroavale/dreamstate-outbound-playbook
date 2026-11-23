import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { renderCard } from "./cards.mjs";

test("cards render the same svg twice", () => {
  const files = readdirSync("cards").filter((name) => name.endsWith(".json"));
  assert.equal(files.length, 6);
  for (const name of files) {
    const card = JSON.parse(readFileSync(`cards/${name}`, "utf8"));
    assert.ok(card.boxes.length <= 6);
    for (const box of card.boxes) assert.ok(box.lines.length <= 3);
    const once = renderCard(card);
    const twice = renderCard(card);
    assert.equal(once, twice);
    assert.match(once, /width="1080"/);
    assert.match(once, /height="1350"/);
  }
});
