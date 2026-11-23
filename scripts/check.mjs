import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, readlinkSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { buildCallPlans } from "./lib/call-plans.mjs";
import { buildGraphs } from "./lib/graphs.mjs";
import { renderCard } from "./cards.mjs";
import { validate } from "./lib/schema.mjs";
import { renderReport, runSample } from "./lib/sample-run.mjs";
import { dashLines, findListedWords, loadWordList } from "./lib/words.mjs";

export function runChecks(root = process.cwd(), options = {}) {
const strict = options.strict ?? false;
  const at = (relPath) => path.join(root, relPath);
  const errors = [];
    const fail = (message) => errors.push(message);

  const TEXT_EXT = new Set([".md", ".mjs", ".js", ".json", ".yml", ".yaml", ".css", ".txt", ".html"]);
  const SKIP_DIRS = new Set([".git", "node_modules", "output", "work", "data", "brand.local", "settings.local", "audience.local"]);
  const ID_RE = /\b((?:workspace|tables|sequence|crm|integrations|visibility|social|unibox|workflow|senders|knowledge|source|provider|column)\.[a-z0-9_.]+|whoami|tools_search|tools_get|tools_run|runs_get|runs_list)\b/g;
  const ID_ONE = new RegExp(ID_RE.source);
  const LINK_RE = /\[[^\]]*\]\(([^)\s]+)\)/g;
  const SECRET_RE = new RegExp(
    ["BEGIN [A-Z ]*PRIVATE KEY", "sk_" + "live_", "xox[baprs]-", "AKIA[0-9A-Z]{16}"].join("|"),
  );
  const LINKEDIN_RE = new RegExp(
    ["urn" + ":li:", "linkedin.com/" + "in/", "linkedin.com/" + "posts/", "activity:" + "\\d{8,}"].join("|"),
  );
  const MACHINE_PATHS = ["/" + "Users" + "/", "/" + "home" + "/", "C:" + "\\Users", "/" + "workspace" + "/"];
  const NETWORK_RE = /\bfetch\s*\(|\baxios\b|\bhttps?\.request\b|\bnet\.connect\b/;

  function walk(dir, out = []) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) walk(full, out);
      else out.push(full);
    }
    return out;
  }

  function rel(file) {
    return path.relative(root, file);
  }

  function loadJson(file) {
    return JSON.parse(readFileSync(file, "utf8"));
  }

  function bannedFile() {
    const local = path.join(root, ".banned-terms.local");
    if (existsSync(local)) return local;
    try {
      const common = execSync("git rev-parse --git-common-dir", { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
      const main = path.resolve(root, common, "..", ".banned-terms.local");
      if (existsSync(main)) return main;
    } catch {
      return null;
    }
    return null;
  }

  const files = walk(root);
  const textFiles = files.filter((file) => TEXT_EXT.has(path.extname(file)) || path.basename(file) === "LICENSE" || path.basename(file) === ".gitignore" || path.basename(file) === ".mcp.json");

  for (const file of files) {
    const size = statSync(file).size;
    if (size > 1_000_000) fail(`${rel(file)} is over 1 MB`);
    const ext = path.extname(file).toLowerCase();
    if ([".png", ".jpg", ".jpeg", ".gif", ".webp", ".woff", ".woff2", ".ttf", ".otf"].includes(ext)) fail(`${rel(file)} is a binary image or font`);
  }

  const bannedWords = loadWordList(path.join(root, "scripts/banned-words.json"));
  const vendorIds = loadWordList(path.join(root, "scripts/vendor-ids.json"));
  for (const file of textFiles) {
    const text = readFileSync(file, "utf8");
    const dashes = dashLines(text);
    if (dashes.length) fail(`${rel(file)} has an em or en dash on line ${dashes.join(", ")}`);
    const skipWordScan = rel(file) === "docs/ai-tells.md";
    const words = skipWordScan ? [] : findListedWords(text, bannedWords);
    if (words.length) fail(`${rel(file)} has banned words: ${words.join(", ")}`);
    const vendors = vendorIds.filter((id) => text.includes(id));
    if (vendors.length) fail(`${rel(file)} hard-codes a vendor definition id`);
    if (LINKEDIN_RE.test(text)) fail(`${rel(file)} hard-codes a LinkedIn account, profile, or post id`);
    if (SECRET_RE.test(text)) fail(`${rel(file)} looks like a secret`);
    if (MACHINE_PATHS.some((needle) => text.includes(needle))) fail(`${rel(file)} has a machine path`);
  }

  for (const file of textFiles.filter((item) => rel(item).startsWith("scripts/") || rel(item).startsWith("functions/"))) {
    const text = readFileSync(file, "utf8");
    if (NETWORK_RE.test(text)) fail(`${rel(file)} has network code`);
  }

  const termsPath = bannedFile();
  if (!termsPath) {
    console.log("BANNED-TERM SCAN SKIPPED");
    if (strict) fail(".banned-terms.local is missing and --strict is set");
  } else {
    const terms = readFileSync(termsPath, "utf8").split(/\n/).map((line) => line.trim()).filter(Boolean);
    for (const file of textFiles) {
      const hits = findListedWords(readFileSync(file, "utf8"), terms);
      if (hits.length) fail(`${rel(file)} has a banned term`);
    }
  }

  const agents = readFileSync(at("AGENTS.md"), "utf8");
  const claude = readFileSync(at("CLAUDE.md"), "utf8");
  if (agents !== claude) fail("AGENTS.md and CLAUDE.md differ");

  for (const link of [".agents/skills", ".claude/skills"]) {
    try {
      if (readlinkSync(at(link)) !== "../skills") fail(`${link} must point at ../skills`);
    } catch {
      fail(`${link} symlink is missing`);
    }
  }

  const skillDirs = readdirSync(at("skills"), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  for (const name of skillDirs) {
    const skillPath = path.join(root, "skills", name, "SKILL.md");
    if (!existsSync(skillPath)) {
      fail(`${name} has no SKILL.md`);
      continue;
    }
    const text = readFileSync(skillPath, "utf8");
    if (!text.startsWith("---\n")) fail(`${skillPath} is missing frontmatter`);
    if (!/^name: /m.test(text)) fail(`${skillPath} is missing name`);
    if (!/^description: ".*"$/m.test(text)) fail(`${skillPath} description must be quoted`);
    if (!text.includes("Follow `docs/skill-frame.md`")) fail(`${skillPath} is missing the skill-frame line`);
    if (!text.includes("## Use when")) fail(`${skillPath} is missing Use when`);
    if (!text.includes("## Steps")) fail(`${skillPath} is missing Steps`);
    const steps = text.split("## Steps")[1]?.split(/^## /m)[0] ?? "";
    if (!/^\d+\. /m.test(steps)) fail(`${skillPath} steps are not numbered`);
    if (!text.includes("Dreamstate tools")) fail(`${skillPath} is missing the Dreamstate tools table`);
    if (!text.includes("| Step |") || !text.includes("| Id |") || !text.includes("| Mode |") || !text.includes("Needs a yes")) {
      fail(`${skillPath} tools table is missing step, id, mode, or needs a yes`);
    }
    for (const match of text.matchAll(/references\/[a-z0-9-]+\.md/g)) {
      const ref = path.join(root, "skills", name, match[0]);
      if (!existsSync(ref)) fail(`${skillPath} points at missing ${match[0]}`);
    }
  }

  const schemaForSettings = {
    "tiers.json": "tiers.schema.json",
    "stack-rules.json": "stack-rules.schema.json",
    "team.json": "team.schema.json",
  };
  for (const [name, schemaName] of Object.entries(schemaForSettings)) {
    const errorsForFile = validate(loadJson(at(path.join("settings", name))), loadJson(at(path.join("scripts/schemas", schemaName))));
    for (const message of errorsForFile) fail(`settings/${name}: ${message}`);
  }

  for (const file of readdirSync(at("functions")).filter((name) => name.endsWith(".contract.json"))) {
    const body = loadJson(at(path.join("functions", file)));
    for (const message of validate(body, loadJson(at("scripts/schemas/contract.schema.json")))) fail(`functions/${file}: ${message}`);
    const base = file.replace(".contract.json", "");
    if (!existsSync(at(path.join("functions", `${base}.mjs`)))) fail(`functions/${file} has no function file`);
  }

  const graphs = buildGraphs();
  const plans = buildCallPlans();
  for (const name of readdirSync(at("automations"), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)) {
    const graphPath = path.join("automations", name, "graph.json");
    const planPath = path.join("automations", name, "call-plan.json");
    const graph = loadJson(at(graphPath));
    const plan = loadJson(at(planPath));
    for (const message of validate(graph, loadJson(at("scripts/schemas/graph.schema.json")))) fail(`${graphPath}: ${message}`);
    for (const message of validate(plan, loadJson(at("scripts/schemas/call-plan.schema.json")))) fail(`${planPath}: ${message}`);
    if (graph.status !== "disabled") fail(`${graphPath} is not disabled`);
    if (JSON.stringify(graph) !== JSON.stringify(graphs[name])) fail(`${graphPath} does not match the generator`);
    if (JSON.stringify(plan) !== JSON.stringify(plans[name])) fail(`${planPath} does not match the generator`);
    for (const item of plan.steps) {
      if (["write", "send", "spend"].includes(item.effect)) {
        if (item.needs_yes !== true) fail(`${planPath} step ${item.id} needs a yes`);
        if (typeof item.credit_ceiling !== "number") fail(`${planPath} step ${item.id} needs a credit ceiling`);
      }
    }
  }

  const cardSchema = loadJson(at("scripts/schemas/card.schema.json"));
  for (const name of readdirSync(at("cards")).filter((item) => item.endsWith(".json"))) {
    const card = loadJson(at(path.join("cards", name)));
    for (const message of validate(card, cardSchema)) fail(`cards/${name}: ${message}`);
    const fresh = renderCard(card);
    const svgPath = path.join("cards", `${card.id}.svg`);
    if (!existsSync(at(svgPath))) fail(`${svgPath} is missing`);
    else if (readFileSync(at(svgPath), "utf8") !== fresh) fail(`${svgPath} does not match a fresh render`);
  }

  const readme = readFileSync(at("README.md"), "utf8");
  const counts = [
    ["skills", skillDirs.length],
    ["functions", readdirSync(at("functions")).filter((name) => name.endsWith(".mjs")).length],
    ["automations", readdirSync(at("automations"), { withFileTypes: true }).filter((entry) => entry.isDirectory()).length],
    ["plays", readdirSync(at("plays")).filter((name) => name.endsWith(".md")).length],
  ];
  for (const [label, count] of counts) {
    if (!readme.includes(`${count} ${label}`)) fail(`README is missing "${count} ${label}"`);
  }

  const toolMap = readFileSync(at("docs/tool-map.md"), "utf8");
  const known = new Set();
  for (const match of toolMap.matchAll(ID_RE)) {
    if (!match[1].endsWith(".md")) known.add(match[1]);
  }
  for (const line of toolMap.split("\n")) {
    const id = line.match(ID_ONE)?.[1];
    if (!id || id.endsWith(".md") || !line.trim().startsWith("|")) continue;
    if (!/confirmed|unconfirmed/i.test(line)) fail(`docs/tool-map.md row for ${id} is missing a status`);
    if (!/credit|credits|free|0\b|varies|quote/i.test(line)) fail(`docs/tool-map.md row for ${id} is missing a cost`);
  }
  for (const file of textFiles) {
    if (rel(file) === "docs/tool-map.md") continue;
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(ID_RE)) {
      if (match[1].endsWith(".md")) continue;
      if (!known.has(match[1])) fail(`${rel(file)} names ${match[1]} which is not in docs/tool-map.md`);
    }
  }

  function checkLinks(file) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(LINK_RE)) {
      const target = match[1].replace(/\\/g, "");
      if (target.startsWith("http://") || target.startsWith("https://") || target.startsWith("mailto:") || target.startsWith("#")) continue;
      const clean = target.split("#")[0];
      if (!clean) continue;
      const resolved = path.resolve(path.dirname(file), clean);
      if (!existsSync(resolved)) fail(`${rel(file)} links to missing ${target}`);
    }
  }
  for (const file of textFiles.filter((item) => item.endsWith(".md"))) checkLinks(file);

  const tiers = loadJson(at("settings/tiers.json"));
  const stack = loadJson(at("settings/stack-rules.json"));
  const report = renderReport(runSample(stack, tiers));
  const committed = existsSync(at("examples/sample-week/report.md")) ? readFileSync(at("examples/sample-week/report.md"), "utf8") : "";
  if (committed !== report) fail("examples/sample-week/report.md does not match a fresh demo");

  if (existsSync(at("output/demo/results.json"))) {
    for (const message of validate(loadJson(at("output/demo/results.json")), loadJson(at("scripts/schemas/demo-output.schema.json")))) {
      fail(`output/demo/results.json: ${message}`);
    }
  }


  return { ok: errors.length === 0, errors, textFiles: textFiles.length, skills: skillDirs.length };
}

const launched = process.argv[1];
const isDirect = Boolean(launched && existsSync(launched) && import.meta.url === pathToFileURL(realpathSync(launched)).href);
if (isDirect) {
  const result = runChecks(process.cwd(), { strict: process.argv.includes("--strict") });
  if (!result.ok) {
    for (const message of result.errors) console.error(message);
    console.error(`${result.errors.length} check failure${result.errors.length === 1 ? "" : "s"}`);
    process.exit(1);
  }
  console.log(`check ok (${result.textFiles} text files, ${result.skills} skills)`);
}
