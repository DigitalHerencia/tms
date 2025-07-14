# Custom Labels for GitHub Project

These labels will provide excellent visibility and organization for your domain audit workflow, making it easy to track progress and filter issues/PRs by domain, phase, and task type.

## Usage Examples

- **Domain audit issue:** `domain:compliance`, `phase:survey`, `priority:high`
- **Cleanup PR:** `domain:auth`, `task:cleanup`, `status:review-needed`
- **Planning approval:** `domain:dashboard`, `phase:planning`, `status:awaiting-approval`

## Core Audit Labels

```yaml
- name: "domain:admin"
  color: "FF6B6B"
  description: "Related to admin domain functionality"

- name: "domain:analytics" 
  color: "4ECDC4"
  description: "Related to analytics domain functionality"

- name: "domain:auth"
  color: "45B7D1" 
  description: "Related to authentication domain functionality"

- name: "domain:compliance"
  color: "96CEB4"
  description: "Related to compliance domain functionality"

- name: "domain:dashboard"
  color: "FFEAA7"
  description: "Related to dashboard domain functionality"

- name: "domain:dispatch"
  color: "DDA0DD"
  description: "Related to dispatch domain functionality"

- name: "domain:ifta"
  color: "98D8C8"
  description: "Related to IFTA domain functionality"

- name: "domain:onboarding"
  color: "F7DC6F"
  description: "Related to onboarding domain functionality"

- name: "domain:settings"
  color: "BB8FCE"
  description: "Related to settings domain functionality"

- name: "domain:vehicles"
  color: "85C1E9"
  description: "Related to vehicles domain functionality"
```

## Workflow Phase Labels

```yaml
# Phase tracking labels
- name: "phase:survey"
  color: "0052CC"
  description: "Survey phase - identifying and cataloging files"

- name: "phase:planning"
  color: "0747A6" 
  description: "Planning phase - creating refactoring strategy"

- name: "phase:execution"
  color: "36B37E"
  description: "Execution phase - implementing changes"

- name: "phase:documentation"
  color: "FFAB00"
  description: "Documentation phase - updating docs"

- name: "phase:validation"
  color: "6554C0"
  description: "Validation phase - testing and verification"
```

## Task Type Labels

```yaml
- name: "task:cleanup"
  color: "FF5630"
  description: "Removing unused code/files"

- name: "task:dedup"
  color: "FF8B00"
  description: "Deduplicating code and logic"

- name: "task:separation"
  color: "00B8D9"
  description: "Separating client/server components"

- name: "task:organization"
  color: "00875A"
  description: "Organizing files and folders"

- name: "task:optimization"
  color: "6554C0"
  description: "Optimizing actions/fetchers/types"

- name: "task:auth"
  color: "8777D9"
  description: "Auth/RBAC/permissions related"

- name: "task:database"
  color: "5243AA"
  description: "Database/Prisma schema related"
```

## Priority Labels

```yaml
- name: "priority:critical"
  color: "D93F0B"
  description: "Critical priority - blocks other work"

- name: "priority:high"
  color: "FF8B00"
  description: "High priority - important for domain completion"

- name: "priority:medium"
  color: "FFAB00"
  description: "Medium priority - standard workflow"

- name: "priority:low"
  color: "36B37E"
  description: "Low priority - nice to have"
```

## Status labels

```yaml
- name: "status:awaiting-approval"
  color: "FFAB00"
  description: "Waiting for user approval to proceed"

- name: "status:in-progress"
  color: "0052CC"
  description: "Currently being worked on"

- name: "status:review-needed"
  color: "6554C0"
  description: "Ready for review"

- name: "status:blocked"
  color: "FF5630"
  description: "Blocked by dependencies or issues"
```
