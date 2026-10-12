# Prototype Project Agent Instructions

## Local Saving and Git Commits

- Save edits directly to workspace files; changes are written to disk as they are made.
- After completing a user-authorized task and its relevant validation passes, create a local Git commit for the files changed during that task.
- Stage only files changed for the current task. Never include pre-existing unrelated modified or untracked files unless the user explicitly asks to commit those changes.
- If relevant validation fails, diagnose and repair within the authorized scope. If it cannot be resolved safely or would require expanding scope, do not auto-commit; report the failures and ask how to proceed. If the user explicitly requests a checkpoint commit despite failures, commit only the requested scope and report the failed checks.
- Use concise Conventional Commit messages.
- Do not push, tag, publish, deploy, amend, or rewrite history unless explicitly requested.
