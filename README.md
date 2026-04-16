# Engineering Workflow Plugin

This repository contains a repo-local Codex plugin laid out in the standard marketplace shape. The installable plugin root lives at `plugins/engineering-workflow`, while the repository root keeps the source workspace used to build and validate that plugin copy.

## Repository layout

- `.agents/plugins/marketplace.json` - repo-local marketplace registry
- `plugins/engineering-workflow/.codex-plugin/plugin.json` - plugin manifest used by Codex
- `plugins/engineering-workflow/hooks.json` - plugin hook registration
- `plugins/engineering-workflow/scripts/` - cross-platform hook scripts and self-test
- `plugins/engineering-workflow/skills/` - bundled Codex-compatible skill directories
- `plugins/engineering-workflow/skill-manifest.json` - summary of bundled companion files
- `scripts/validate-plugin-layout.mjs` - repository layout validator for marketplace and plugin paths

## Hook behavior

The repo-local plugin copy auto-registers two conservative hooks:

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
- The repo-local marketplace entry points at `./plugins/engineering-workflow`.
- If you want to install it elsewhere later, copy `plugins/engineering-workflow` into the destination plugin catalog and update the corresponding marketplace entry.
