import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.dirname(scriptDir);
const hooksPath = path.join(pluginRoot, "hooks.json");
const sessionHookScript = path.join(pluginRoot, "scripts", "session-start.mjs");
const postHookScript = path.join(pluginRoot, "scripts", "post-tool-use.mjs");

assert.ok(fs.existsSync(hooksPath), "hooks.json is missing.");

const hooksConfig = JSON.parse(fs.readFileSync(hooksPath, "utf8"));
assert.ok(hooksConfig.hooks.SessionStart, "SessionStart hook is missing.");
assert.ok(hooksConfig.hooks.PostToolUse, "PostToolUse hook is missing.");

const sessionHook = hooksConfig.hooks.SessionStart[0];
const sessionCommand = sessionHook.hooks[0].command;
assert.equal(sessionCommand, "node ./scripts/session-start.mjs", "Unexpected SessionStart command.");
assert.ok(fs.existsSync(sessionHookScript), "SessionStart script is missing.");

const postHook = hooksConfig.hooks.PostToolUse[0];
assert.equal(postHook.matcher, "Write|Edit", "PostToolUse matcher must be Write|Edit.");
const postCommand = postHook.hooks[0].command;
assert.equal(postCommand, "node ./scripts/post-tool-use.mjs", "Unexpected PostToolUse command.");
assert.ok(fs.existsSync(postHookScript), "PostToolUse script is missing.");

const sessionOutput = execFileSync("node", [sessionHookScript], { encoding: "utf8" });
const sessionPayload = JSON.parse(sessionOutput);
assert.equal(sessionPayload.priority, "IMPORTANT", "SessionStart script did not emit expected priority.");
assert.match(sessionPayload.message, /using-agent-skills/, "SessionStart script did not emit the meta-skill.");

const postOutput = execFileSync("node", [postHookScript], { encoding: "utf8" });
assert.match(
  postOutput,
  /PostToolUse triggered after Write\/Edit/,
  "PostToolUse script did not emit the expected message.",
);

console.log("plugin hooks test passed");
