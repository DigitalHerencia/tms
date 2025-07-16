---
applyTo: '**'
---

# Commit Message Instructions

## Formatting Standards

### Commit Message Format
- **Structure:** `type: description`
- **Type:** `feat`, `fix`, `docs`, `test`, `refactor`, `config`, `chore`, `style`, `ci`
- **Description:** Minimum 10 characters
- **Examples:**
  - `feat: add vehicle tracking dashboard`
  - `fix: resolve authentication timeout issue`
  - `docs: update API documentation with examples`

### Commit Description Requirements
- **Closing keywords:** `Closes #123`, `Fixes #456`, `Resolves #789`
- **Dependencies:** `Depends on #456` or `Blocked by #789`
- **Impact summary:** Brief description of changes and scope

### Automation Features
- **Validation:** Commit messages are validated automatically
- **Auto-labeling:** Based on commit prefix (`Feature`, `Bug`, `Documentation`, etc.)
- **Comments:** Provide actionable feedback for convention violations
- **Merge restrictions:** Commits cannot be pushed if conventions are not followed

## Additional Guidance
- Clarify requirements if ambiguity exists before generating code.
- Specify file paths and use clear code blocks for changes.
- Document all systems, flows, and configs after significant changes.
- Ensure all flows are validated and tested before marking as complete.
