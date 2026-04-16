# Engineering Workflow Plugin

This repository packages an engineering workflow plugin for Codex and related agent runtimes.

The project is inspired by [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills). The bundled `skills/` content in this repository is fully sourced from that upstream project, with this repository focusing on Codex-oriented packaging, hook wiring, and repository-level validation.

## Installation

This repository follows the official repo-local marketplace layout for Codex plugins:

```text
.agents/plugins/marketplace.json
plugins/engineering-workflow/
```

Install it by exposing this repository as a local marketplace root.

1. Clone this repository to a local directory.
2. Make sure `node` is available in your environment, because the plugin hooks call `node`.
3. Ensure your Codex setup loads the marketplace file at `.agents/plugins/marketplace.json`.
4. The marketplace entry in this repository points to `./plugins/engineering-workflow`, which resolves to `plugins/engineering-workflow` relative to the repository root.
5. Verify the local layout and plugin hook behavior:

```bash
node scripts/validate-plugin-layout.mjs
node plugins/engineering-workflow/scripts/test-plugin-hooks.mjs
```

If you maintain your own local marketplace file outside this repository, add an entry with the same shape:

```json
{
  "name": "engineering-workflow",
  "source": {
    "source": "local",
    "path": "./plugins/engineering-workflow"
  },
  "policy": {
    "installation": "AVAILABLE",
    "authentication": "ON_INSTALL"
  },
  "category": "Productivity"
}
```

The relative path is resolved from the marketplace root. In this repository, that root is the repository directory that contains `.agents/plugins/marketplace.json`.

## Repository layout

- `.agents/plugins/marketplace.json` - repo-local marketplace registry metadata
- `plugins/engineering-workflow/.codex-plugin/plugin.json` - plugin manifest
- `plugins/engineering-workflow/skills/` - bundled skill definitions quoted from `addyosmani/agent-skills`
- `plugins/engineering-workflow/hooks.json` - plugin hook registration
- `plugins/engineering-workflow/scripts/` - plugin hook scripts and self-test
- `plugins/engineering-workflow/skill-manifest.json` - summary of bundled companion files
- `scripts/validate-plugin-layout.mjs` - repository-level layout validator
- `docs/plugin-structure-spec.md` - notes for the intended Codex plugin layout

## Hook behavior

The plugin at `plugins/engineering-workflow` auto-registers two conservative hooks:

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
node plugins/engineering-workflow/scripts/test-plugin-hooks.mjs
```

## Notes

- This repository does not modify `~/.codex`, environment variables, or global plugin marketplaces.
- The `skills/` directory content originates from `https://github.com/addyosmani/agent-skills`.
- The active plugin payload lives under `plugins/engineering-workflow`.
