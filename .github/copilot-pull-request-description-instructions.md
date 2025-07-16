---
applyTo: '**'
---

# Pull Request Description Instructions

## Formatting Standards

### PR Title Format
- **Type:** `feat`, `fix`, `docs`, `test`, `refactor`, `config`, `chore`, `style`, `ci`
- **Description:** Minimum 10 characters
- **Examples:**
  - `feat: add vehicle tracking dashboard`
  - `fix: resolve authentication timeout issue`
  - `docs: update API documentation with examples`

### PR Description Requirements
- **Closing keywords:** `Closes #123`, `Fixes #456`, `Resolves #789`
- **Dependencies:** `Depends on #456` or `Blocked by #789`
- **Impact summary:** Brief description of changes and scope
- **Checklist:**
  - [ ] Passes CI
  - [ ] Updates docs (if needed)
  - [ ] Notifies milestone

### Automation Features
- **Branch and PR title validation:** Runs automatically on all PRs
- **Auto-labeling:** Based on branch prefix (`Feature`, `Bug`, `Documentation`, etc.)
- **Comments:** Provide actionable feedback for convention violations
- **Merge restrictions:** PRs cannot be merged if conventions are not followed
- **Labels:** Automatically managed to prevent duplicates

### Convention Enforcement
All conventions are enforced by `.github/workflows/conventions.yml` which:
- Runs on `pull_request_target` to work with fork PRs
- Validates both branch names and PR titles
- Provides clear, actionable error messages
- Fails the status check to prevent non-compliant merges

## Additional Guidance
- Clarify requirements if ambiguity exists before generating code.
- Specify file paths and use clear code blocks for changes.
- Document all systems, flows, and configs after significant changes.
- Ensure all flows are validated and tested before marking as complete.
