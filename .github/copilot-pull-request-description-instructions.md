---
applyTo: '**'
---


# Pull Request Description Instructions

## PR Formatting Standards

### PR Title Format
- **Type:** Conventional commit type (`feat`, `fix`, `docs`, `test`, `refactor`, `config`, `chore`, `style`, `ci`)
- **Label:** Use the most relevant label(s) from the [label list](README.md#existing-github-repository-labels) in parentheses after the type, such as domain, phase, task, or priority. Do not use custom or duplicate labels.
- **Description:** Minimum 10 characters
- **Examples:**
  - `feat(domain:admin): add organization-level user management UI`
  - `fix(domain:analytics): correct metric calculation for dashboard widgets`
  - `refactor(domain:compliance): consolidate audit trail logic`
  - `test(domain:vehicles): add tests for VIN uniqueness validation`
  - `docs(domain:ifta): update jurisdiction handling documentation`
  - `chore(phase:survey): automate file inventory for dispatch domain`
  - `feat(task:auth): implement Clerk session claim enforcement`
  - `fix(priority:critical): resolve RBAC bypass vulnerability`
  - `refactor(task:database): migrate Prisma schema to new ID format`

### PR Description Requirements
- **Closing keywords:** `Closes #123`, `Fixes #456`, `Resolves #789`
- **Dependencies:** `Depends on #456` or `Blocked by #789`
- **Impact summary:** Brief description of changes and scope
- **Checklist:**
  - [ ] ID format updated to `{prefix}_{32char_alphanum}` ([ID Format Spec](README.md#id-format-specification)). Prefixes must match domain object (see label table in README).
  - [ ] Schema/types/validation updated and TypeScript strict mode passes ([table-audit.yml](ISSUE_TEMPLATE/table-audit.yml))
  - [ ] Fetchers/actions refactored and colocated by domain
  - [ ] RBAC/permissions enforced via Clerk/session only ([Session Claims Example](README.md#session-claims-example))
  - [ ] Tests updated/passing (unit and integration)
  - [ ] Documentation updated (developer and user docs)
  - [ ] Migration notes provided (if needed)
  - [ ] Reviewer notes included
  - [ ] All referenced labels are correct and present ([Existing GitHub Repository Labels](README.md#existing-github-repository-labels))

## Automation & Convention Enforcement

- **Branch and PR title validation:** Runs automatically on all PRs. PRs cannot be merged if conventions or checklist are not followed.
- **Auto-labeling:** Based on branch prefix and the [existing repository labels](README.md#existing-github-repository-labels). No custom or duplicate labels.
- **Comments:** Provide actionable feedback for convention violations.
- **Merge restrictions:** PRs cannot be merged if conventions or checklist are not followed. All requirements in the README must be met.
- **Labels:** Automatically managed to prevent duplicates; use the exact names from the [label list](README.md#existing-github-repository-labels).
- **Workflow:** All conventions are enforced by `.github/workflows/conventions.yml` (runs on `pull_request_target`).

## Additional Guidance

- Clarify requirements if ambiguity exists before generating code.
- Specify file paths and use clear code blocks for changes.
- Document all systems, flows, and configs after significant changes (update both developer and user docs).
- Ensure all flows are validated and tested before marking as complete.
- When referencing labels, use the exact names from the [label list](README.md#existing-github-repository-labels).
- When referencing ID format, RBAC, or schema, always reference the relevant section in the README.
