---
applyTo: '**'
---

# Review Selection Instructions

## Standards for Selecting Reviews

### Review Criteria
- **Code Quality:** Ensure adherence to coding standards and conventions.
- **Functionality:** Validate that features work as intended.
- **Documentation:** Check for updated and accurate documentation.
- **Testing:** Verify that tests are present and passing.
- **Impact Assessment:** Evaluate the scope and risk of changes.

### Review Process
- **Automated Checks:**
  - Run CI/CD pipelines.
  - Validate branch and PR title conventions.
  - Ensure all tests pass.
- **Manual Checks:**
  - Review code for readability and maintainability.
  - Confirm adherence to architectural guidelines.
  - Validate business logic and edge cases.

### Automation Features
- **Auto-labeling:** Based on branch prefix (`Feature`, `Bug`, `Documentation`, etc.)
- **Comments:** Provide actionable feedback for convention violations.
- **Merge restrictions:** PRs cannot be merged if conventions are not followed.

## Additional Guidance
- Clarify requirements if ambiguity exists before generating code.
- Specify file paths and use clear code blocks for changes.
- Document all systems, flows, and configs after significant changes.
- Ensure all flows are validated and tested before marking as complete.
