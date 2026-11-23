import { readFileSync } from "node:fs";
import { gradeEmailStack } from "../functions/grade-email-stack.mjs";

const file = process.argv[2] ?? "examples/sample-week/stack.json";
const rulesFile = process.argv[3] ?? "settings/stack-rules.json";
const saved = JSON.parse(readFileSync(file, "utf8"));
const rules = JSON.parse(readFileSync(rulesFile, "utf8"));
const graded = gradeEmailStack({ ...saved, rules });
console.log(JSON.stringify(graded, null, 2));
