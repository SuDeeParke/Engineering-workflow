import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.dirname(scriptDir);
const metaSkill = path.join(pluginRoot, "skills", "using-agent-skills", "SKILL.md");

if (!fs.existsSync(metaSkill)) {
  process.stdout.write(
    JSON.stringify({
      priority: "INFO",
      message:
        "engineering-workflow: using-agent-skills not found. Skills are still available under ./skills/.",
    }),
  );
  process.exit(0);
}

const content = fs.readFileSync(metaSkill, "utf8");
const message =
  "engineering-workflow loaded. Start with the skill discovery flow before implementing.\n\n" +
  content;

process.stdout.write(
  JSON.stringify({
    priority: "IMPORTANT",
    message,
  }),
);
