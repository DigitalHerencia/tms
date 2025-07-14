# Domain Audit Checklist: [DOMAIN_NAME]

## Phase 1: Survey ✅

### File Discovery
- [ ] Components identified: `components/[domain]/`
- [ ] Features identified: `features/[domain]/`  
- [ ] Actions identified: `lib/actions/[domain]Actions.ts`
- [ ] Fetchers identified: `lib/fetchers/[domain]Fetchers.ts`
- [ ] Types identified: `types/[domain].ts`
- [ ] Schemas identified: `schemas/[domain].ts`
- [ ] Related page files identified: `app/(tenant)/[orgId]/[domain]/`

### Dependency Analysis
- [ ] Import/export map created
- [ ] Circular dependencies identified
- [ ] Unused exports found
- [ ] Duplicate code located
- [ ] External dependencies verified

### Auth/Database Analysis  
- [ ] Clerk auth usage mapped
- [ ] RBAC permissions verified
- [ ] Prisma schema dependencies identified
- [ ] Database operations catalogued

### Survey Report Generated
- [ ] Complete file inventory
- [ ] Dependency graph
- [ ] Cleanup opportunities
- [ ] Risk assessment

## Phase 2: Planning ✅

### Organization Strategy
- [ ] Component organization plan
- [ ] Feature consolidation plan  
- [ ] Client/server separation plan
- [ ] Action/fetcher optimization plan
- [ ] Type/schema consolidation plan

### Cleanup Strategy
- [ ] Files to delete identified
- [ ] Code deduplication plan
- [ ] Dependency removal plan
- [ ] Import cleanup strategy

### Impact Assessment
- [ ] Breaking changes identified
- [ ] Migration plan created
- [ ] Testing strategy defined
- [ ] Rollback plan prepared

### User Approval
- [ ] Plan presented to user
- [ ] Feedback incorporated  
- [ ] Final approval received
- [ ] Execution authorized

## Phase 3: Execution ✅

### Cleanup Operations
- [ ] Unused files deleted
- [ ] Dead code removed
- [ ] Duplicate logic consolidated
- [ ] Commented code cleaned

### Structure Organization
- [ ] Components moved to `/components/[domain]/`
- [ ] Features moved to `/features/[domain]/`
- [ ] Actions consolidated in `/lib/actions/[domain]Actions.ts`
- [ ] Fetchers consolidated in `/lib/fetchers/[domain]Fetchers.ts`
- [ ] Types moved to `/types/[domain].ts`
- [ ] Schemas moved to `/schemas/[domain].ts`

### Component Separation
- [ ] Client components marked with `"use client"`
- [ ] Server components optimized for SSR
- [ ] Shared utilities extracted
- [ ] Props interfaces defined

### Logic Optimization
- [ ] Server actions streamlined
- [ ] Fetchers consolidated
- [ ] Error handling standardized
- [ ] Validation schemas optimized

### Dependency Management
- [ ] Import paths updated
- [ ] Unused imports removed
- [ ] Circular dependencies resolved
- [ ] External deps verified

### Auth/Database Updates
- [ ] Clerk configurations verified
- [ ] RBAC permissions updated
- [ ] Prisma schema updated (if needed)
- [ ] Database operations tested

## Phase 4: Documentation ✅

### Developer Documentation
- [ ] Architecture updates in `docs/Developer-Documentation.md`
- [ ] API changes documented
- [ ] Migration notes added
- [ ] Code examples updated

### User Documentation  
- [ ] Feature updates in `docs/User-Documentation.md`
- [ ] Workflow changes documented
- [ ] Screenshots updated (if needed)
- [ ] FAQ section updated

### Inline Documentation
- [ ] Component props documented
- [ ] Function signatures documented
- [ ] Complex logic explained
- [ ] TODOs addressed or documented

## Phase 5: Validation ✅

### Technical Validation
- [ ] TypeScript compilation successful
- [ ] All imports resolve correctly
- [ ] ESLint passes without errors
- [ ] Build process successful

### Functional Validation
- [ ] Domain features work correctly
- [ ] Authentication/authorization intact
- [ ] Database operations verified
- [ ] Error handling works

### Integration Testing
- [ ] Cross-domain integrations work
- [ ] API endpoints respond correctly  
- [ ] UI components render properly
- [ ] User workflows complete successfully

### Performance Validation
- [ ] Bundle size impact assessed
- [ ] Runtime performance verified
- [ ] Memory usage optimized
- [ ] Loading times improved

## Final Report ✅

### Metrics
- [ ] Files before/after count
- [ ] Lines of code reduced
- [ ] Duplicate code eliminated
- [ ] Dependencies removed

### Achievements  
- [ ] Organization improvements
- [ ] Performance gains
- [ ] Maintainability improvements
- [ ] Type safety enhancements

### Recommendations
- [ ] Next domain priorities
- [ ] Follow-up tasks
- [ ] Monitoring requirements
- [ ] Future optimizations

### Sign-off
- [ ] Technical review complete
- [ ] User acceptance received
- [ ] Documentation updated
- [ ] Ready for next domain
