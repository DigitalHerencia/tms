# Pull Request Template

## Domain Audit PR

**Related Issue:** #[issue_number]
**Domain:** [domain_name]
**Phase:** [survey/planning/execution/documentation]

### Changes Made

#### Component Organization
- [ ] Moved components to proper folders
- [ ] Separated client/server components
- [ ] Removed unused components
- [ ] Deduplicated component logic

#### Feature Organization  
- [ ] Organized features by domain
- [ ] Consolidated feature logic
- [ ] Removed unused features

#### Actions & Fetchers
- [ ] Optimized server actions
- [ ] Consolidated fetchers
- [ ] Removed unused actions/fetchers
- [ ] Updated error handling

#### Types & Schemas
- [ ] Moved interfaces to types files
- [ ] Consolidated schemas
- [ ] Removed duplicate types
- [ ] Updated import statements

#### Dependencies & Imports
- [ ] Cleaned up unused imports
- [ ] Updated dependency paths
- [ ] Resolved circular dependencies

#### Auth & Database
- [ ] Updated Clerk auth configurations
- [ ] Updated RBAC permissions
- [ ] Updated Prisma schema (if needed)
- [ ] Verified database operations

#### Documentation
- [ ] Updated User Documentation
- [ ] Updated Developer Documentation
- [ ] Updated inline code comments

### Files Changed
<!-- List key files that were modified, added, or removed -->

### Testing Checklist
- [ ] TypeScript compilation passes
- [ ] All imports resolve correctly
- [ ] Domain functionality works as expected
- [ ] Authentication/authorization works
- [ ] Database operations work correctly
- [ ] No runtime errors

### Breaking Changes
<!-- List any breaking changes and migration steps -->

### Additional Notes
<!-- Any additional context or notes -->

