#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");

function fail(message) {
  throw new Error(message);
}

function readJson(relativePath) {
  const fullPath = resolve(root, relativePath);
  if (!existsSync(fullPath)) {
    fail(`Missing ${relativePath}`);
  }
  return JSON.parse(readFileSync(fullPath, "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function resolveFromPlugin(pluginRoot, relativePath) {
  assert(typeof relativePath === "string", "Plugin resource path must be a string");
  assert(relativePath.startsWith("./"), `Plugin resource path must start with ./: ${relativePath}`);
  return resolve(pluginRoot, relativePath);
}

const marketplace = readJson(".agents/plugins/marketplace.json");

assert(typeof marketplace.name === "string" && marketplace.name.length > 0, "Marketplace must have a name");
assert(Array.isArray(marketplace.plugins), "Marketplace must have a plugins array");
assert(marketplace.plugins.length > 0, "Marketplace must contain at least one plugin");

for (const entry of marketplace.plugins) {
  assert(typeof entry.name === "string" && entry.name.length > 0, "Plugin entry must have a name");
  assert(entry.source?.source === "local", `${entry.name}: source.source must be local`);
  assert(
    typeof entry.source.path === "string" && entry.source.path.startsWith("./plugins/"),
    `${entry.name}: source.path must use ./plugins/<plugin-name>`
  );
  assert(entry.policy?.installation, `${entry.name}: policy.installation is required`);
  assert(entry.policy?.authentication, `${entry.name}: policy.authentication is required`);
  assert(entry.category, `${entry.name}: category is required`);

  const pluginRoot = resolve(root, entry.source.path);
  assert(existsSync(pluginRoot), `${entry.name}: plugin path does not exist: ${entry.source.path}`);
  assert(basename(pluginRoot) === entry.name, `${entry.name}: plugin folder must match plugin name`);

  const manifestPath = resolve(pluginRoot, ".codex-plugin/plugin.json");
  assert(existsSync(manifestPath), `${entry.name}: missing .codex-plugin/plugin.json`);

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  assert(manifest.name === entry.name, `${entry.name}: manifest name must match marketplace name`);
  assert(manifest.version, `${entry.name}: manifest version is required`);
  assert(manifest.description, `${entry.name}: manifest description is required`);
  assert(manifest.interface?.displayName, `${entry.name}: interface.displayName is required`);

  for (const key of ["skills", "hooks", "mcpServers", "apps"]) {
    if (manifest[key]) {
      const resourcePath = resolveFromPlugin(pluginRoot, manifest[key]);
      assert(existsSync(resourcePath), `${entry.name}: ${key} path does not exist: ${manifest[key]}`);
    }
  }

  if (manifest.interface.defaultPrompt) {
    assert(Array.isArray(manifest.interface.defaultPrompt), `${entry.name}: defaultPrompt must be an array`);
    assert(manifest.interface.defaultPrompt.length <= 3, `${entry.name}: defaultPrompt must have at most 3 entries`);
    for (const prompt of manifest.interface.defaultPrompt) {
      assert(prompt.length <= 128, `${entry.name}: defaultPrompt entries must be 128 characters or less`);
    }
  }

  if (manifest.interface.screenshots) {
    assert(Array.isArray(manifest.interface.screenshots), `${entry.name}: screenshots must be an array`);
    for (const screenshot of manifest.interface.screenshots) {
      assert(
        typeof screenshot === "string" && screenshot.startsWith("./assets/") && screenshot.endsWith(".png"),
        `${entry.name}: screenshots must be PNG files under ./assets/: ${screenshot}`
      );
    }
  }
}

console.log("plugin layout validation passed");
