# Chief

<img src="./image.png" alt="Chief Wiggum" width="180" align="right" />

CLI tool for running AI coding agents in a loop using the Ralph Wiggum methodology.

Chief uses Claude Code to plan and execute tasks in your current repository, tracking plans and task files under `.chief/`.

## Requirements

- [Bun](https://bun.sh/) runtime
- [Claude Code CLI](https://claude.ai/claude-code) installed and authenticated
- [GitHub CLI](https://cli.github.com/) (`gh`) for PR creation
- Git

## Installation

```bash
# Clone the repository
git clone git@github.com:mauricekleine/chief.git chief
cd chief

# Install dependencies
bun install

# Create an alias (add to your shell profile)
alias chief="bun run /path/to/chief/src/index.ts"
```

## Usage

### Plan a feature

```bash
chief plan
```

This will:

1. Prompt you to describe what you want to build (multiline)
2. Start an interactive planning session with Claude
3. Write the plan to `.chief/plans/YYYY-MM-DD-<feature-name>.md`

Use Enter for a new line and Cmd+Enter to submit.

### Break down a plan

```bash
# Pick a plan from .chief/plans
chief breakdown

# Or specify the feature name
chief breakdown <feature-name>

# Alias
chief bd
```

Creates `.chief/tasks/YYYY-MM-DD-<feature-name>.tasks.json` from the plan.

### Run tasks

```bash
# Pick a task set from .chief/tasks
chief run

# Or specify the feature name
chief run <feature-name>

# Run once interactively
chief run --single
```

Chief will:

1. Check out a `feature/<feature-name>` branch
2. Run Claude to complete tasks (loop mode by default)
3. Verify the work using your configured verification steps
4. Mark tasks as done and commit
5. Push changes and create a pull request

## Configuration

Chief uses a local `.chief/` directory in your repository:

- `.chief/plans/` - Plans (`YYYY-MM-DD-<feature-name>.md`)
- `.chief/tasks/` - Tasks (`YYYY-MM-DD-<feature-name>.tasks.json`)
- `.chief/verification.txt` - Verification steps

Chief also creates `.claude/settings.json` in your project root for Claude Code permissions configuration (auto-generated from defaults if not present).

Git-ignoring `.chief/` is optional. `.claude/settings.json` can be committed to share permissions with your team.

### Verification Steps

On first run, Chief will prompt you to pick verification steps based on `package.json` scripts, with an option to add custom steps.

Example:

```
- bun run lint
- bun run typecheck
- bun run test
```

### Permissions Configuration

Chief automatically configures Claude Code permissions by creating `.claude/settings.json` in your project root. This file follows [Claude Code's settings format](https://code.claude.com/docs/en/settings) and includes permissions for necessary commands like `bun`, `npm`, `git`, `eslint`, etc.

On first run, Chief creates `.claude/settings.json` with default permissions. You can customize this file to add or remove permissions as needed. The file structure follows Claude Code's format:

```json
{
  "permissions": {
    "allow": [
      "Bash(bun:*)",
      "Bash(npm:*)",
      "Bash(git:*)",
      "Bash(eslint:*)",
      ...
    ],
    "deny": []
  },
  "defaultMode": "acceptEdits"
}
```

**Important notes:**

- Claude Code automatically reads `.claude/settings.json` from your project root - no CLI flags needed
- Make sure your permissions include all commands used in your verification steps
- For example, if you use `bun run lint`, ensure `Bash(bun:*)` is included
- If you use `npm run lint`, ensure `Bash(npm:*)` is included
- You can commit `.claude/settings.json` to share permissions with your team
- For personal overrides, use `.claude/settings.local.json` (gitignored)

## Task Schema

Tasks in `*.tasks.json` follow this structure:

```json
[
  {
    "category": "Feature",
    "description": "Implement user authentication",
    "passes": false,
    "steps": [
      "Create auth middleware",
      "Add login endpoint",
      "Add session management"
    ]
  }
]
```

## How It Works

Chief implements the Ralph Wiggum methodology:

1. **Plan** - Use AI to create a concise implementation plan through conversation
2. **Break Down** - Convert the plan into discrete, verifiable tasks
3. **Execute** - Run AI in a loop to complete tasks one at a time
4. **Verify** - Use automated checks (tests, lint, typecheck) to verify work
5. **Ship** - Push changes and create a PR when done

Each task is completed in isolation, committed separately, making it easy to review and revert if needed.

## License

MIT
