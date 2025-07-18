---
applyTo: '**'
---


# Copilot Review Selection & Checklist

## Review Standards

Reviews must ensure:
- **ID Format:** All IDs use `{prefix}_{32char_alphanum}` (see [ID Format Spec](README.md#id-format-specification)). Prefixes must match the domain object (see label table in README).
- **Schema & Types:** Database schema, types, and validation must match the domain spec and [table-audit.yml](ISSUE_TEMPLATE/table-audit.yml). All changes must be TypeScript strict mode compliant.
- **RBAC/Permissions:** All access control is enforced via Clerk metadata/session claims only ([Session Claims Example](README.md#session-claims-example)). No legacy or role-specific ID logic is allowed.
- **Code Quality:** Code is clean, maintainable, and follows project conventions and domain-driven structure.
- **Documentation:** All changes are documented, migration notes are provided if needed, and references are updated. Update both developer and user docs as required.
- **Testing:** All relevant unit and integration tests are present and passing. No breaking changes unless documented.
- **Labels:** All issues/PRs use the exact label names from [Existing GitHub Repository Labels](README.md#existing-github-repository-labels). No custom or duplicate labels.

## Review Checklist (for PRs)

- [ ] ID format updated to `{prefix}_{32char_alphanum}` (see [ID Format Spec](README.md#id-format-specification))
- [ ] Prefixes match domain object (see label table in README)
- [ ] Schema/types/validation updated and TypeScript strict mode passes ([table-audit.yml](ISSUE_TEMPLATE/table-audit.yml))
- [ ] Fetchers/actions refactored and colocated by domain
- [ ] RBAC/permissions enforced via Clerk/session only ([Session Claims Example](README.md#session-claims-example))
- [ ] Tests updated/passing (unit and integration)
- [ ] Documentation updated (developer and user docs)
- [ ] Migration notes provided (if needed)
- [ ] Reviewer notes included
- [ ] All checklist items in the PR template are complete
- [ ] No breaking changes unless documented
- [ ] All referenced labels are correct and present ([Existing GitHub Repository Labels](README.md#existing-github-repository-labels))

## Review Process

1. **Automated Checks:**
   - CI/CD pipelines must pass
   - Branch and PR title conventions validated (see PR instructions)
   - All tests must pass
2. **Manual Checks:**
   - Code readability, maintainability, and architectural alignment (feature/domain-driven)
   - Business logic and edge cases
   - Documentation and migration notes (developer and user docs)
   - Label usage and references (must match [label list](README.md#existing-github-repository-labels))
   - ID format and RBAC/session claims enforcement
3. **Approval:**
   - Only approve if all checklist items are satisfied and all standards in the README are met
   - Request changes for any missing or non-compliant items

## Automation & Labeling

- **Auto-labeling:** PRs/issues must use the exact label names from [Existing GitHub Repository Labels](README.md#existing-github-repository-labels). No custom or duplicate labels.
- **Merge restrictions:** PRs cannot be merged if conventions or checklist are not followed. All requirements in the README must be met.

## Additional Guidance

- Clarify requirements if ambiguity exists before generating or reviewing code.
- Specify file paths and use clear code blocks for changes.
- Document all systems, flows, and configs after significant changes (update both developer and user docs).
- Ensure all flows are validated and tested before marking as complete.
- When referencing labels, use the exact names from the [label list](README.md#existing-github-repository-labels).
- When referencing ID format, RBAC, or schema, always reference the relevant section in the README.
