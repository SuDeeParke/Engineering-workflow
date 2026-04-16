# Spec: Codex Plugin Repository Layout

## Objective
Make this repository satisfy the Codex repo-local plugin layout checked against the `openai/codex` plugin sample: a marketplace at `.agents/plugins/marketplace.json` points to a real plugin root at `./plugins/engineering-workflow`.

## Commands
- Validate layout: `node scripts/validate-plugin-layout.mjs`
- Test plugin hooks: `node plugins/engineering-workflow/scripts/test-plugin-hooks.mjs`

## Project Structure
- `.agents/plugins/marketplace.json` - repo-local marketplace registry.
- `plugins/engineering-workflow/` - installable Codex plugin root.
- `plugins/engineering-workflow/.codex-plugin/plugin.json` - plugin manifest.
- `plugins/engineering-workflow/skills/` - bundled skills.
- `plugins/engineering-workflow/hooks.json` - plugin hook registration.
- `scripts/validate-plugin-layout.mjs` - repository layout validation.

## Code Style
Use small Node scripts for cross-platform validation:

```js
const path = resolvePluginPath(root, entry.source.path);
assert(existsSync(path), `missing plugin path: ${entry.source.path}`);
```

## Testing Strategy
Validate JSON shape and referenced paths with a small Node script, then run the plugin's existing hook self-test from the plugin root copy.

## Boundaries
- Always: keep plugin paths relative and marketplace entries resolvable.
- Ask first: remove root-level legacy plugin files or change install locations outside this repository.
- Never: edit user home Codex config or global marketplaces without explicit approval.

## Success Criteria
- `.agents/plugins/marketplace.json` uses `./plugins/engineering-workflow`.
- The marketplace source path exists.
- The source path contains `.codex-plugin/plugin.json`.
- Marketplace plugin name, manifest name, and plugin folder name all match.
- Manifest `skills` and `hooks` paths resolve inside the plugin root.
- Hook self-test passes from the repo-local plugin copy.
