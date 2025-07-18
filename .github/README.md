
# FleetFusion Audit & Refactor Project Overview

---

FleetFusion is undergoing a comprehensive, domain-driven audit and refactor to modernize and standardize the codebase and database. The primary goals of this initiative are:

- **Standardize all IDs** across users, organizations, vehicles, and data objects to a unified, secure format (`{prefix}_{32char_alphanum}`) for consistency, security, and scalability.
- **Enforce RBAC and permissions** exclusively through Clerk metadata and session claims, eliminating legacy or role-specific ID logic and ensuring robust, centralized access control.
- **Align all schemas, types, validation, fetchers, actions, and URL params** with the new ID and RBAC standards, making the codebase easier to maintain and extend.
- **Leverage a structured, label-driven GitHub workflow**—using domain, phase, task, and priority labels—to track, review, and document every change with clarity and accountability.
- **Require strict adherence to templates and checklists** for every issue and pull request, ensuring code quality, documentation, and test coverage at every step.
- **Deliver a maintainable, secure, and scalable platform** ready for future features, teams, and integrations.

This process is managed through a series of domain- and table-specific GitHub issues, each following a clear audit, planning, execution, documentation, and validation workflow. All contributors are expected to follow the conventions, templates, and label usage described below.

---

## FleetFusion GitHub Audit & Refactor Resources

---

### Table Audit Issue Template Resources

#### Clerk User Example
```json
{
  "id": "user_2zXX3j7yxxDc2loT3oI7PlpjLMM",
  "first_name": "test",
  "last_name": "admin",
  "email_addresses": [
    { "email_address": "digitalherencia@outlook.com" }
  ],
  "public_metadata": {
    "role": "admin",
    "organizationId": "org_fb3de43942a58cace7958646851f",
    "onboardingComplete": true
  },
  "private_metadata": {
    "role": "admin",
    "permissions": [
      "org:sys_domains:read",
      "org:sys_domains:manage",
      "org:sys_profile:manage",
      "org:sys_profile:delete",
      "org:sys_memberships:read",
      "org:sys_memberships:manage",
      "org:admin:access_all_reports",
      "org:admin:configure_company_settings",
      "org:admin:view_audit_logs",
      "org:admin:manage_users_and_roles",
      "org:admin:view_edit_all_loads",
      "org:sys_billing:manage",
      "org:sys_billing:read"
    ],
    "organizationId": "org_fb3de43942a58cace7958646851f",
    "onboardingComplete": true
  }
}
```

#### Session Claims Example
```json
{
  "role": "{{user.private_metadata.role}}",
  "organizationId": "{{user.private_metadata.organizationId}}",
  "onboardingComplete": "{{user.public_metadata.onboardingComplete}}"
}
```

#### ID Format Specification
- All IDs must follow `{prefix}_{32char_alphanum}`
- Prefixes:
  - `user` = all user roles (admin, dispatcher, driver, compliance, member)
  - `org` = company/organization
  - `vin` = vehicle
  - `data` = all other objects (audits, documents, loads, etc.)
- Example: `user_2zXX3j7yxxDc2loT3oI7PlpjLMM`

#### RBAC/Session Claims Spec
- All permissions and roles are determined by Clerk metadata and session claims.
- No separate IDs for user roles; use `userId` and role from metadata.
- All access control logic should reference session claims.

---

### Existing GitHub Repository Labels

| NAME                 | DESCRIPTION                                      | COLOR    |
|----------------------|--------------------------------------------------|----------|
| bug                  | Something isn't working                          | #d73a4a  |
| documentation        | Improvements or additions to documentation       | #0075ca  |
| duplicate            | This issue or pull request already exists        | #cfd3d7  |
| enhancement          | New feature or request                           | #a2eeef  |
| good first issue     | Good for newcomers                               | #7057ff  |
| help wanted          | Extra attention is needed                        | #008672  |
| invalid              | This doesn't seem right                          | #e4e669  |
| question             | Further information is requested                 | #d876e3  |
| wontfix              | This will not be worked on                       | #ffffff  |
| domain:admin         | Related to admin domain functionality            | #FF6B6B  |
| domain:analytics     | Related to analytics domain functionality        | #4ECDC4  |
| domain:auth          | Related to authentication domain functionality   | #45B7D1  |
| domain:compliance    | Related to compliance domain functionality       | #96CEB4  |
| domain:dashboard     | Related to dashboard domain functionality        | #FFEAA7  |
| domain:dispatch      | Related to dispatch domain functionality         | #DDA0DD  |
| domain:ifta          | Related to IFTA domain functionality             | #98D8C8  |
| domain:onboarding    | Related to onboarding domain functionality       | #F7DC6F  |
| domain:settings      | Related to settings domain functionality         | #BB8FCE  |
| domain:vehicles      | Related to vehicles domain functionality         | #85C1E9  |
| phase:survey         | Survey phase - identifying and cataloging files  | #0052CC  |
| phase:execution      | Execution phase - implementing changes           | #36B37E  |
| phase:planning       | Planning phase - creating refactoring strategy   | #0747A6  |
| phase:documentation  | Documentation phase - updating docs              | #FFAB00  |
| phase:validation     | Validation phase - testing and verification      | #6554C0  |
| task:cleanup         | Removing unused code/files                       | #FF5630  |
| task:dedup           | Deduplicating code and logic                     | #FF8B00  |
| task:separation      | Separating client/server components              | #00B8D9  |
| task:organization    | Organizing files and folders                     | #00875A  |
| task:auth            | Auth/RBAC/permissions related                    | #8777D9  |
| task:optimization    | Optimizing actions/fetchers/types                | #6554C0  |

---

### Label Reference Guidance

When referencing labels in issues, PRs, or documentation, use the exact label names as listed above.

---
