import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const VERIFICATION_FILE = "verification.txt";
const CLAUDE_DIR = ".claude";
const SETTINGS_FILE = "settings.json";

/**
 * Ensure the .chief directory exists.
 */
export async function ensureChiefDir(gitRoot: string): Promise<string> {
  const chiefDir = join(gitRoot, ".chief");
  if (!existsSync(chiefDir)) {
    await mkdir(chiefDir, { recursive: true });
  }
  return chiefDir;
}

/**
 * Ensure the .chief/plans directory exists.
 */
export async function ensurePlansDir(chiefDir: string): Promise<string> {
  const plansDir = join(chiefDir, "plans");
  if (!existsSync(plansDir)) {
    await mkdir(plansDir, { recursive: true });
  }
  return plansDir;
}

/**
 * Ensure the .chief/tasks directory exists.
 */
export async function ensureTasksDir(chiefDir: string): Promise<string> {
  const tasksDir = join(chiefDir, "tasks");
  if (!existsSync(tasksDir)) {
    await mkdir(tasksDir, { recursive: true });
  }
  return tasksDir;
}

/**
 * Get the verification steps from .chief/verification.txt.
 */
export async function getVerificationSteps(
  chiefDir: string,
): Promise<string | undefined> {
  const verificationPath = join(chiefDir, VERIFICATION_FILE);

  if (!existsSync(verificationPath)) {
    return undefined;
  }

  const content = await readFile(verificationPath, "utf8");
  return content.trim() || undefined;
}

/**
 * Save the verification steps to .chief/verification.txt.
 */
export async function setVerificationSteps(
  chiefDir: string,
  steps: string,
): Promise<void> {
  const verificationPath = join(chiefDir, VERIFICATION_FILE);
  await writeFile(verificationPath, steps);
}

/**
 * Ensure the .claude directory exists in the project root.
 * Claude Code reads settings.json from .claude/ automatically.
 */
export async function ensureClaudeDir(gitRoot: string): Promise<string> {
  const claudeDir = join(gitRoot, CLAUDE_DIR);
  if (!existsSync(claudeDir)) {
    await mkdir(claudeDir, { recursive: true });
  }
  return claudeDir;
}

/**
 * Ensure .claude/settings.json exists with default permissions.
 * Claude Code automatically reads this file from the project root.
 */
export async function ensureSettings(gitRoot: string): Promise<void> {
  const claudeDir = await ensureClaudeDir(gitRoot);
  const settingsPath = join(claudeDir, SETTINGS_FILE);

  // If settings.json already exists, don't overwrite it
  if (existsSync(settingsPath)) {
    return;
  }

  // Get the directory of this file (config.ts) to find default settings
  // Bun supports import.meta.dir
  const libDir =
    import.meta.dir ??
    import.meta.path.slice(0, import.meta.path.lastIndexOf("/"));
  const defaultSettingsPath = join(libDir, "settings.json");

  if (existsSync(defaultSettingsPath)) {
    const defaultContent = await readFile(defaultSettingsPath, "utf8");
    await writeFile(settingsPath, defaultContent);
  }
}
