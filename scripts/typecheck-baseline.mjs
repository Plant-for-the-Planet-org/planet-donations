// Fails only when a change adds type errors, so CI can check types while old errors are still being fixed.
// .typecheck-baseline lists the known errors, one per line, without line numbers so that unrelated edits do not make an old error look new.
// Run with --update after fixing errors to rewrite the list. Remove this script and use `npm run typecheck` once the list is empty. See docs/plans/testing-roadmap.md.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const baselineFile = new URL("../.typecheck-baseline", import.meta.url);
const update = process.argv.includes("--update");

// Locally the update is reviewed in the PR diff. In CI nobody would see it, so it could hide a new error.
if (update && process.env.CI) {
  console.error("--update is for local use. Run it on your machine and commit .typecheck-baseline.");
  process.exit(1);
}

// `--pretty false` gives one `error TS` line per error, in the form `file(line,col): error TS1234: message`.
const result = spawnSync("npx", ["tsc", "--noEmit", "--pretty", "false"], {
  encoding: "utf8",
});
const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
const errorLines = output.split("\n").filter((line) => /error TS\d+:/.test(line));

// tsc exits 0 with no errors and 1 or 2 with type errors. Anything else (failed to start, killed, crashed) may leave partial output, which must not pass the check or be written by --update.
const completed = !result.error && !result.signal && [0, 1, 2].includes(result.status);
// A run that fails before type checking (bad config, missing package) reports no `error TS` lines, which would look like 0 errors.
if (!completed || (result.status !== 0 && errorLines.length === 0)) {
  console.error("tsc did not finish a normal type check run:\n");
  if (result.error) console.error(result.error.message);
  if (result.signal) console.error(`Stopped by signal ${result.signal}.`);
  console.error(output);
  process.exit(1);
}

// Some messages include absolute paths, which differ between machines and CI.
const projectRoot = fileURLToPath(new URL("..", import.meta.url));

const toKey = (rawLine) => {
  const line = rawLine.replaceAll(projectRoot, "");
  const match = line.match(/^(.+?)\(\d+,\d+\): error (TS\d+): (.*)$/);
  if (match) return `${match[1]}: ${match[2]}: ${match[3]}`;
  // Errors without a file, such as a missing type package.
  return line.replace(/^error /, "(no file): ").trim();
};

const current = errorLines.map((line) => ({ line, key: toKey(line) }));
const currentKeys = current.map((error) => error.key).sort();

if (update) {
  writeFileSync(baselineFile, currentKeys.length ? `${currentKeys.join("\n")}\n` : "");
  console.log(`Wrote ${currentKeys.length} error(s) to .typecheck-baseline.`);
  process.exit(0);
}

const baselineKeys = existsSync(baselineFile)
  ? readFileSync(baselineFile, "utf8").split("\n").filter(Boolean)
  : [];

// Count each key, because the same error can appear several times in one file.
const remaining = new Map();
for (const key of baselineKeys) remaining.set(key, (remaining.get(key) ?? 0) + 1);

const added = [];
for (const error of current) {
  const left = remaining.get(error.key) ?? 0;
  if (left > 0) remaining.set(error.key, left - 1);
  else added.push(error.line);
}
const fixed = [...remaining].flatMap(([key, left]) => Array(left).fill(key));

console.log(`Type errors: ${current.length} (baseline: ${baselineKeys.length}).`);

if (added.length) {
  console.error(`\nThis change adds ${added.length} new type error(s):\n`);
  console.error(added.map((line) => `  ${line}`).join("\n"));
  if (fixed.length) {
    console.error(`\nIt also fixes ${fixed.length}. If code moved between files on purpose, run \`npm run typecheck:baseline -- --update\` and commit .typecheck-baseline.`);
  }
  process.exit(1);
}

console.log("No new errors.");

// A fixed error left in the list would let the same error come back unnoticed, so the list must be updated.
if (fixed.length) {
  console.error(`\nFixed ${fixed.length} error(s), but they are still in .typecheck-baseline. Run \`npm run typecheck:baseline -- --update\` and commit .typecheck-baseline:\n`);
  console.error(fixed.map((key) => `  ${key}`).join("\n"));
  process.exit(1);
}
