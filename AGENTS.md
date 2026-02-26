# Agent Configuration

This project uses [superpowers](https://skills.sh/obra/superpowers) for disciplined AI-assisted development.

## Skills Location

Skills are in `.agents/skills/`. Cursor discovers them automatically from that directory.

## Available Skills (14)

| Skill | When to Use |
|-------|-------------|
| **using-superpowers** | Every conversation start—check for relevant skills first |
| **brainstorming** | New feature, design, or "let's build X" — before implementation |
| **writing-plans** | After brainstorming approval — create implementation plan |
| **executing-plans** | Implement a plan task-by-task |
| **subagent-driven-development** | Parallel task execution via subagents |
| **finishing-a-development-branch** | Merge, PR, or cleanup after implementation |
| **systematic-debugging** | Bug, test failure, or unexpected behavior |
| **test-driven-development** | Feature or bugfix implementation |
| **requesting-code-review** | Before merge — request code review |
| **receiving-code-review** | When applying review feedback |
| **verification-before-completion** | Before claiming work done — run tests, confirm |
| **using-git-worktrees** | Isolated workspace for feature work |
| **dispatching-parallel-agents** | Multiple independent tasks in parallel |
| **writing-skills** | Create or edit skills |

## Workflow Order

1. **New feature**: `brainstorming` → `writing-plans` → `executing-plans` → `verification-before-completion` → `finishing-a-development-branch`
2. **Bug fix**: `systematic-debugging` → (fix) → `verification-before-completion`
3. **Implementation**: `test-driven-development` when writing code

## Rule

Before any task: invoke `using-superpowers` (or check skills). If a skill applies, use it. Don't skip workflows.
