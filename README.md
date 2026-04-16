# Engineering Workflow Plugin

This repository packages an engineering workflow plugin for Codex and related agent runtimes.

The project is inspired by [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills). The bundled `skills/` content in this repository is fully sourced from that upstream project, with this repository focusing on Codex-oriented packaging, hook wiring, and repository-level validation.

## Installation

Use the repository root itself as the local plugin directory, because it already contains `.codex-plugin/plugin.json`, `skills/`, `hooks.json`, and `scripts/`.

1. Clone this repository to a local directory.
2. Make sure `node` is available in your environment, because the plugin hooks call `node`.
3. Register the plugin directory in your Codex local plugin catalog or marketplace setup, pointing to this repository root.
4. Verify the local layout:

```bash
node scripts/validate-plugin-layout.mjs
node scripts/test-plugin-hooks.mjs
```

If you maintain a local marketplace file, add an entry whose plugin path resolves to this repository root. The exact marketplace location depends on your Codex setup, but this repository includes `.agents/plugins/marketplace.json` as a reference for the expected metadata shape.

## Repository layout

- `.codex-plugin/plugin.json` - plugin manifest at the repository root
- `skills/` - bundled skill definitions quoted from `addyosmani/agent-skills`
- `hooks.json` - plugin hook registration
- `scripts/` - hook scripts and local validation helpers
- `skill-manifest.json` - summary of bundled companion files
- `.agents/plugins/marketplace.json` - repo-local marketplace registry metadata
- `docs/plugin-structure-spec.md` - notes for the intended Codex plugin layout

## Hook behavior

This repository auto-registers two conservative hooks:

- `SessionStart` - injects `skills/using-agent-skills/SKILL.md` at the start of a session
- `PostToolUse` with `Write|Edit` matcher - prints a verification reminder after file writes or edits

The more complex `code-simplification` helper scripts remain bundled inside the skill directories, but they are not auto-registered at plugin level because they still need Codex-specific payload handling before they are safe to enable globally.

## Cross-platform runtime

Plugin-level hooks use `node` so the same hook commands can run on macOS, Linux, and Windows without depending on `bash` or `pwsh`.

Validate the repo-local layout from the repository root with:

```bash
node scripts/validate-plugin-layout.mjs
```

Run the plugin hook self-test from the repository root with:

```bash
node scripts/test-plugin-hooks.mjs
```

## Notes

- This repository does not modify `~/.codex`, environment variables, or global plugin marketplaces.
- The `skills/` directory content originates from `https://github.com/addyosmani/agent-skills`.
- The current repository state may not always include a materialized `plugins/engineering-workflow` directory. Treat `.agents/plugins/marketplace.json` and `docs/plugin-structure-spec.md` as the intended Codex layout reference.
