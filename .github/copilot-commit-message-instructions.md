---
applyTo: '**'
---

# Commit Message Instructions


## Formatting Standards

### Commit Message Format
- **Structure:** `type: description`
- **Type:** `feat`, `fix`, `docs`, `test`, `refactor`, `config`, `chore`, `style`, `ci`
- **Description:** Minimum 10 characters
- **Label Usage:** Use the most relevant label(s) from the label table in the README in the body or description if needed. Do not use custom or duplicate labels.
- **Examples:**
  - `feat: add vehicle tracking dashboard`
  - `fix: resolve authentication timeout issue`
  - `docs: update API documentation with examples`

### Commit Description Requirements
- **Closing keywords:** `Closes #123`, `Fixes #456`, `Resolves #789`
- **Dependencies:** `Depends on #456` or `Blocked by #789`
- **Impact summary:** Brief description of changes and scope
- **Checklist:**
  - [ ] ID format updated to `{prefix}_{32char_alphanum}` (see ID Format Spec in README; prefixes must match domain object)
  - [ ] Schema/types/validation updated and TypeScript strict mode passes
  - [ ] Fetchers/actions refactored and colocated by domain
  - [ ] RBAC/permissions enforced via Clerk/session only
  - [ ] Tests updated/passing (unit and integration)
  - [ ] Documentation updated (developer and user docs)
  - [ ] Migration notes provided (if needed)
  - [ ] All referenced labels are correct and present (see label table in README)


### Automation Features
- **Validation:** Commit messages are validated automatically. Commits cannot be pushed if conventions or checklist are not followed.
- **Auto-labeling:** Based on commit prefix and the label table in the README. No custom or duplicate labels.
- **Comments:** Provide actionable feedback for convention violations.
- **Merge restrictions:** Commits cannot be pushed if conventions or checklist are not followed. All requirements in the README must be met.

## Additional Guidance
- Clarify requirements if ambiguity exists before generating code.
- Specify file paths and use clear code blocks for changes.
- Document all systems, flows, and configs after significant changes (update both developer and user docs).
- Ensure all flows are validated and tested before marking as complete.
- When referencing labels, use the exact names from the label table in the README.
- When referencing ID format, RBAC, or schema, always reference the relevant section in the README.
