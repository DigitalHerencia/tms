# Domain Audit Workflow for FleetFusion

For the following domains:

- admin
- analytics
- auth
- compliance
- dashboard
- dispatch
- ifta
- onboarding
- settings
- vehicles

can you develop an audit workflow that we can iterate across each domain that does the following

- removes unused code/logic/files
- dedupes code/logic/files
- separates client and server components
- organizes components and features into proper folders
- check actions and fetchers
- checks types and schemas
- moves interfaces to proper types file and schemas to proper schema file
- checks deps and imports
>
and in general simplifies logic/code and deletes or consolidates non essential files and removes anything that is not meant to be shipped to production
>
determine what the best option for utilizing the specific workflow you develop based on the tasks and choose one or more from from the following:

- custom instructions
- custom prompts
- custom agentic mode
- custom tools sets
- github v2 project board with issues/pr templates organized into milestones

format your response as the artifacts needed for an implementation that is robust and extremely specialized to complete this process 

the workflow tasks should be developed to process one domain per cycle with approval from the user between iterations and consider including the following:
>
- a preliminary step that surveys the codebase to identify the files relevant to the domain
- a planning step that is presented to the user for approval before edits are made
- checklists that the agent uses to track edits/progress and prevent duplication
- consideration for clerk auth/rbac/permissions/neon db tables/prisma schemas
- update documentation files in the docs directory
- progress reports/status updates for the user that summarise edits at the end of each cycle
>