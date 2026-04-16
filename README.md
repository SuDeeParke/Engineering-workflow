# Engineering Workflow Plugin

This folder is a generated local Codex plugin. It packages the rebuilt skills from `output/skills` into a plugin layout under `output/plugin/engineering-workflow`.

## Contents

- `.codex-plugin/plugin.json` - plugin manifest
- `hooks.json` - plugin hook registration
- `scripts/session-start.mjs` - cross-platform session-start hook script
- `scripts/post-tool-use.mjs` - cross-platform post-tool-use hook script
- `scripts/test-plugin-hooks.mjs` - cross-platform hook self-test
- `skills/` - rebuilt Codex-compatible skill directories
- `skill-manifest.json` - summary of bundled companion files

## Hook behavior

This generated plugin auto-registers two conservative hooks:

- `SessionStart` - injects `skills/using-agent-skills/SKILL.md` at the start of a session
- `PostToolUse` with `Write|Edit` matcher - prints a verification reminder after file writes or edits

The more complex `code-simplification` helper scripts remain bundled inside the skill directories, but they are not auto-registered at plugin level because they still need Codex-specific payload handling before they are safe to enable globally.

## Cross-platform runtime

Plugin-level hooks use `node` so the same hook commands can run on macOS, Linux, and Windows without depending on `bash` or `pwsh`.

Run the self-test from the plugin root or repository root with:

```bash
node output/plugin/engineering-workflow/scripts/test-plugin-hooks.mjs
```

## Notes

- This plugin is generated only. It does not install itself.
- No changes were made to `~/.codex`, environment variables, or plugin marketplaces.
- If you want to install it later, point Codex at this plugin directory or move it into your local Codex plugin catalog.
