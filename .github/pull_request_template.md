---
name: "Domain Table Refactor PR"
about: "Implements standardized ID format, schema, and logic for a domain table"
title: "[Domain] Table Refactor"
labels: ["domain-audit", "schema", "rbac", "refactor"]
---

## Summary

- **Domain/Table:** <!-- e.g. users -->
- **Key Changes:** <!-- List major changes -->
- **Related Issues:** <!-- Link to issues addressed -->

## Checklist

- [ ] ID format updated to `{prefix}_{32char_alphanum}` (see ID Format Spec in README). Prefixes must match domain object (see label table in README).
- [ ] Schema/types/validation updated and TypeScript strict mode passes (see [table-audit.yml](../.github/ISSUE_TEMPLATE/table-audit.yml))
- [ ] Fetchers/actions refactored and colocated by domain
- [ ] RBAC/permissions enforced via Clerk/session only (see RBAC/Session Claims Spec in README)
- [ ] Tests updated/passing (unit and integration)
- [ ] Documentation updated (developer and user docs)

## Migration Notes

- <!-- Any migration steps or data updates required -->

## Screenshots/Examples

- <!-- Optional: before/after, code snippets, etc. -->

## Reviewer Notes

- <!-- Anything reviewers should focus on -->

---
