# Codebase Context

**I am working on a software system with the following directory structure, architecture, and analyzed files:**

## Executive Summary

### Project Overview

- **Project Root Directory:** D:\FleetFusion-MT_RBAC_TMS_SaaS\FleetFusion-Main
- **Framework:** Next.js v15 App Router
- **CI/CD Pipeline:** GitHub `main` ==> Vercel `production`
- **Total Files:** 347
- **Languages:** tsx, typescript, css, json, plaintext
- **Generated:** 7/21/2025, 2:09:56 PM

### File Types

- **tsx:** 226 files
- **ts:** 110 files
- **json:** 3 files
- **sql:** 3 files
- **css:** 1 files
- **mjs:** 1 files
- **toml:** 1 files
- **prisma:** 1 files
- **example:** 1 files

### Directory Structure

- **D:/FleetFusion-MT_RBAC_TMS_SaaS/FleetFusion-Main:** 347 files

```
FleetFusion-Main
├── app
│   ├── (auth)
│   │   ├── accept-invitation
│   │   │   └── page.tsx
│   │   ├── forgot-password
│   │   │   └── page.tsx
│   │   ├── onboarding
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── sign-in
│   │   │   └── [[...sign-in]]
│   │   │       └── page.tsx
│   │   ├── sign-out
│   │   │   └── page.tsx
│   │   ├── sign-up
│   │   │   └── [[...sign-up]]
│   │   │       └── page.tsx
│   │   ├── error.tsx
│   │   ├── layout.tsx
│   │   └── loading.tsx
│   ├── (funnel)
│   │   ├── about
│   │   │   └── page.tsx
│   │   ├── contact
│   │   │   └── page.tsx
│   │   ├── features
│   │   │   └── page.tsx
│   │   ├── pricing
│   │   │   └── page.tsx
│   │   ├── privacy
│   │   │   └── page.tsx
│   │   ├── refund
│   │   │   └── page.tsx
│   │   ├── services
│   │   │   └── page.tsx
│   │   ├── terms
│   │   │   └── page.tsx
│   │   ├── error.tsx
│   │   ├── layout.tsx
│   │   └── loading.tsx
│   ├── (tenant)
│   │   └── [orgId]
│   │       ├── analytics
│   │       │   └── page.tsx
│   │       ├── compliance
│   │       │   ├── [userId]
│   │       │   │   ├── hos-logs
│   │       │   │   │   └── page.tsx
│   │       │   │   └── page.tsx
│   │       │   └── page.tsx
│   │       ├── dashboard
│   │       │   └── [userId]
│   │       │       └── page.tsx
│   │       ├── dispatch
│   │       │   └── [userId]
│   │       │       ├── edit
│   │       │       │   └── page.tsx
│   │       │       ├── new
│   │       │       │   └── page.tsx
│   │       │       └── page.tsx
│   │       ├── drivers
│   │       │   ├── [userId]
│   │       │   │   ├── edit
│   │       │   │   │   └── page.tsx
│   │       │   │   └── page.tsx
│   │       │   ├── new
│   │       │   │   └── page.tsx
│   │       │   └── page.tsx
│   │       ├── ifta
│   │       │   └── page.tsx
│   │       ├── settings
│   │       │   └── page.tsx
│   │       ├── vehicles
│   │       │   ├── [vehicleId]
│   │       │   │   ├── edit
│   │       │   │   │   ├── edit-vehicle-client.tsx
│   │       │   │   │   └── page.tsx
│   │       │   │   ├── page.tsx
│   │       │   │   └── vehicle-details-client.tsx
│   │       │   ├── new
│   │       │   │   ├── new-vehicle-client.tsx
│   │       │   │   └── page.tsx
│   │       │   ├── page.tsx
│   │       │   └── vehicles-client.tsx
│   │       ├── error.tsx
│   │       ├── layout.tsx
│   │       └── loading.tsx
│   ├── api
│   │   ├── analytics
│   │   │   └── [orgId]
│   │   │       ├── export
│   │   │       │   └── route.ts
│   │   │       ├── schedule
│   │   │       │   └── route.ts
│   │   │       └── stream
│   │   │           └── route.ts
│   │   ├── clerk
│   │   │   ├── __tests__
│   │   │   │   └── webhook-handler.test.ts
│   │   │   └── webhook-handler
│   │   │       └── route.ts
│   │   ├── dispatch
│   │   │   └── [orgId]
│   │   │       ├── stream
│   │   │       │   └── route.ts
│   │   │       └── updates
│   │   │           └── route.ts
│   │   ├── files
│   │   │   ├── __tests__
│   │   │   │   └── upload.test.ts
│   │   │   └── upload
│   │   │       └── route.ts
│   │   └── test
│   │       └── auth
│   │           └── route.ts
│   ├── mobile
│   │   └── [orgId]
│   │       ├── compliance
│   │       │   └── page.tsx
│   │       ├── dashboard
│   │       │   └── [userId]
│   │       │       ├── mobile-dashboard-layout.tsx
│   │       │       └── mobile-dashboard.tsx
│   │       └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── analytics
│   │   ├── analytics-dashboard.tsx
│   │   ├── driver-performance.tsx
│   │   ├── export-options.tsx
│   │   ├── financial-metrics.tsx
│   │   ├── geographic-analysis.tsx
│   │   ├── interactive-charts.tsx
│   │   ├── MetricCard.tsx
│   │   ├── mobile-analytics.tsx
│   │   ├── realtime-dashboard.tsx
│   │   └── vehicle-utilization.tsx
│   ├── auth
│   │   ├── context.tsx
│   │   └── protected-route.tsx
│   ├── compliance
│   │   ├── compliance-alerts.tsx
│   │   ├── compliance-dashboard.tsx
│   │   ├── compliance-documents.tsx
│   │   ├── DocumentUploadForm.tsx
│   │   ├── dot-inspection-management.tsx
│   │   ├── driver-compliance-table.tsx
│   │   ├── hos-log-viewer.tsx
│   │   └── vehicle-compliance-table.tsx
│   ├── dashboard
│   │   ├── audit-log-filters.tsx
│   │   ├── audit-log-table.tsx
│   │   ├── billing-actions.tsx
│   │   ├── billing-plan-comparison.tsx
│   │   ├── billing-plan-overview.tsx
│   │   ├── billing-usage-metrics.tsx
│   │   ├── bulk-user-actions.tsx
│   │   ├── dashboard-skeleton.tsx
│   │   ├── fleet-overview-header.tsx
│   │   ├── invite-user-form.tsx
│   │   ├── organization-stats.tsx
│   │   ├── resource-usage-cards.tsx
│   │   ├── role-assignment-modal.tsx
│   │   ├── system-health-checks.tsx
│   │   ├── system-overview-cards.tsx
│   │   └── user-table.tsx
│   ├── dispatch
│   │   ├── dispatch-board.tsx
│   │   ├── dispatch-skeleton.tsx
│   │   ├── load-card.tsx
│   │   ├── load-details-dialog.tsx
│   │   └── load-form.tsx
│   ├── drivers
│   │   ├── current-load-card.tsx
│   │   ├── document-status-card.tsx
│   │   ├── driver-card.tsx
│   │   ├── drivers-list-header.tsx
│   │   ├── drivers-skeleton.tsx
│   │   ├── hos-status-cards.tsx
│   │   ├── performance-card.tsx
│   │   ├── recent-activity-card.tsx
│   │   └── upcoming-loads-card.tsx
│   ├── ifta
│   │   ├── ifta-columns.tsx
│   │   ├── ifta-dashboard.tsx
│   │   ├── ifta-tables.tsx
│   │   ├── TaxRateManager.tsx
│   │   └── TaxRateManagerClient.tsx
│   ├── navigation
│   │   ├── MainNav.tsx
│   │   ├── MobileNav.tsx
│   │   ├── PublicNav.tsx
│   │   └── TopNavBar.tsx
│   ├── onboarding
│   │   ├── CompanySetupStep.tsx
│   │   ├── EmployeeJoinStep.tsx
│   │   ├── PersonalInfoStep.tsx
│   │   ├── ReviewSubmitStep.tsx
│   │   └── RoleSelectionStep.tsx
│   ├── pricing
│   │   └── pricing-section.tsx
│   ├── settings
│   │   ├── billing-settings.tsx
│   │   ├── company-settings.tsx
│   │   ├── CompanyProfileForm.tsx
│   │   ├── integration-settings.tsx
│   │   ├── notification-settings.tsx
│   │   ├── settings-dashboard.tsx
│   │   └── user-settings.tsx
│   ├── shared
│   │   ├── AddressFields.tsx
│   │   ├── ContactFields.tsx
│   │   ├── DocumentUpload.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── GlobalSearchBar.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── OptimizedImage.tsx
│   │   ├── RedirectMessage.tsx
│   │   ├── SharedFooter.tsx
│   │   └── ThemeProvider.tsx
│   ├── ui
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── container.tsx
│   │   ├── context-menu.tsx
│   │   ├── data-table.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── hover-card.tsx
│   │   ├── input-otp.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── loading-spinner.tsx
│   │   ├── menubar.tsx
│   │   ├── mobile-table.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── page-header.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── resizable.tsx
│   │   ├── responsive-layout.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── toggle-group.tsx
│   │   ├── toggle.tsx
│   │   └── tooltip.tsx
│   └── vehicles
│       ├── add-vehicle-dialog.tsx
│       ├── vehicle-card.tsx
│       ├── vehicle-details-dialog.tsx
│       ├── vehicle-form.tsx
│       ├── vehicle-list-client.tsx
│       └── vehicle-table.tsx
├── config
│   └── pdf.ts
├── docs
│   ├── Architecture.mermaid
│   ├── Developer-Documentation.md
│   ├── dispatch-domain-audit-report.md
│   ├── FleetFusion-PRD.md
│   ├── User-Documentation.md
│   └── vehicles-domain-audit-report.md
├── features
│   ├── analytics
│   │   ├── dashboard-metrics.tsx
│   │   ├── MainDashboardFeature.tsx
│   │   └── performance-metrics.tsx
│   ├── auth
│   │   └── index.ts
│   ├── compliance
│   │   └── ComplianceDashboard.tsx
│   ├── dashboard
│   │   ├── AdminOverview.tsx
│   │   ├── AuditLogViewer.tsx
│   │   ├── BillingManagement.tsx
│   │   ├── SystemHealth.tsx
│   │   └── UserManagementDashboard.tsx
│   ├── dispatch
│   │   ├── DispatchBoardFeature.tsx
│   │   └── recent-activity.tsx
│   ├── drivers
│   │   ├── AssignmentDialogButton.tsx
│   │   ├── AssignmentDialogWrapper.tsx
│   │   ├── DriverAssignmentDialog.tsx
│   │   ├── DriverDetailsDialog.tsx
│   │   ├── DriverForm.tsx
│   │   ├── DriverFormFeature.tsx
│   │   ├── DriversList.tsx
│   │   └── DriversListClient.tsx
│   ├── ifta
│   │   └── IftaReportingFeature.tsx
│   ├── onboarding
│   │   └── OnboardingStepper.tsx
│   ├── settings
│   │   ├── __tests__
│   │   │   └── CompanySettingsPage.test.tsx
│   │   ├── CompanySettingsPage.tsx
│   │   └── UserSettingsPage.tsx
│   └── vehicles
│       ├── add-vehicle-dialog.tsx
│       ├── edit-vehicle-dialog.tsx
│       └── VehicleListPage.tsx
├── hooks
│   ├── use-dispatch-realtime.ts
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   └── useDashboardPreferences.ts
├── lib
│   ├── actions
│   │   ├── analyticsActions.ts
│   │   ├── analyticsReportActions.ts
│   │   ├── auditActions.ts
│   │   ├── auditLogActions.ts
│   │   ├── authActions.ts
│   │   ├── complianceActions.ts
│   │   ├── complianceMonitoring.ts
│   │   ├── complianceReportActions.ts
│   │   ├── dashboardActions.ts
│   │   ├── dispatchActions.ts
│   │   ├── driverActions.ts
│   │   ├── fileUploadActions.ts
│   │   ├── inspectionActions.ts
│   │   ├── invitationActions.ts
│   │   ├── loadActions.ts
│   │   ├── notificationActions.ts
│   │   ├── onboardingActions.ts
│   │   ├── regulatoryAuditActions.ts
│   │   ├── searchActions.ts
│   │   ├── settingsActions.ts
│   │   ├── userActions.ts
│   │   └── vehicleActions.ts
│   ├── admin
│   │   └── logging.ts
│   ├── auth
│   │   ├── auth.ts
│   │   ├── permissions.ts
│   │   ├── secure-session-management.ts
│   │   ├── session-claims-utils.ts
│   │   └── utils.ts
│   ├── cache
│   │   ├── auth-cache.ts
│   │   └── redis.ts
│   ├── compliance
│   │   └── regulatoryEngine.ts
│   ├── config
│   │   └── environment.ts
│   ├── database
│   │   └── db.ts
│   ├── errors
│   │   └── handleError.ts
│   ├── fetchers
│   │   ├── analyticsFetchers.ts
│   │   ├── authFetchers.ts
│   │   ├── complianceFetchers.ts
│   │   ├── dashboardFetchers.ts
│   │   ├── dispatchFetchers.ts
│   │   ├── driverFetchers.ts
│   │   ├── iftaFetchers.ts
│   │   ├── notificationFetchers.ts
│   │   ├── onboardingFetchers.ts
│   │   ├── searchFetchers.ts
│   │   ├── settingsFetchers.ts
│   │   ├── userFetchers.ts
│   │   └── vehicleFetchers.ts
│   ├── pdf
│   │   ├── ifta-pdf-service.ts
│   │   ├── ifta-pdf-templates.tsx
│   │   └── pdf-utils.ts
│   ├── services
│   │   ├── mcp-clerk.ts
│   │   └── pdfService.ts
│   └── utils
│       ├── hos.ts
│       ├── ifta.ts
│       ├── mvp-verification.ts
│       ├── prisma-serializer.ts
│       ├── rate-limit.ts
│       ├── slugUtils.ts
│       └── utils.ts
├── prisma
│   ├── migrations
│   │   ├── 20250707061329_initial_schema
│   │   │   └── migration.sql
│   │   ├── 20250707065454_add_preferences_field_to_user_model
│   │   │   └── migration.sql
│   │   ├── 20250707073801_remove_clerk_id_from_user_model
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   └── seed.ts
├── public
│   ├── black_logo.png
│   ├── blue_cover.png
│   ├── cockpit_bg.png
│   ├── landing_hero.png
│   ├── map-pinned_icon.png
│   ├── mountain_bg.png
│   ├── readme_hero.jpeg
│   ├── route_icon.png
│   ├── social-card.png
│   ├── sunset_bg.png
│   ├── sunset_hero.png
│   ├── sunset_loading.png
│   ├── tiers_bg.png
│   ├── trucksz_splash.png
│   ├── twighlight_loading.png
│   ├── valley_bg.png
│   ├── white_logo.png
│   └── winding_bg.png
├── schemas
│   ├── analytics.ts
│   ├── auditLogSchema.ts
│   ├── auth.ts
│   ├── compliance.ts
│   ├── dashboard.ts
│   ├── dispatch.ts
│   ├── drivers.ts
│   ├── ifta.ts
│   ├── onboarding.ts
│   ├── regulatory.ts
│   ├── settings.ts
│   ├── shared.ts
│   └── vehicles.ts
├── tests
│   ├── __health-check__
│   │   ├── playwright-health.spec.ts
│   │   ├── test-environment.test.ts
│   │   └── vitest-health.test.ts
│   ├── __integration__
│   │   ├── api-endpoints.test.ts
│   │   ├── auth-flow.test.ts
│   │   └── database-connection.test.ts
│   ├── __mocks__
│   │   ├── mockAnalytics.ts
│   │   └── mockDb.ts
│   ├── __validation__
│   │   ├── component-rendering.test.tsx
│   │   ├── middleware.test.ts
│   │   └── server-actions.test.ts
│   ├── domains
│   │   ├── analytics
│   │   │   ├── dashboard-summary.test.ts
│   │   │   ├── report-schedule.test.ts
│   │   │   └── utils.test.ts
│   │   ├── compliance
│   │   │   ├── auditLogActions.test.ts
│   │   │   └── complianceActions.test.ts
│   │   ├── drivers
│   │   │   ├── credentialValidation.test.ts
│   │   │   ├── driver-e2e.spec.ts
│   │   │   ├── driverOnboarding.test.ts
│   │   │   ├── hosCompliance.test.ts
│   │   │   └── performance.test.ts
│   │   └── vehicles
│   │       ├── vehicleActions.test.ts
│   │       └── vehicles.test.ts
│   ├── e2e
│   │   ├── admin.spec.ts
│   │   ├── analytics.spec.ts
│   │   ├── auth-flow.playwright.spec.ts
│   │   ├── compliance.spec.ts
│   │   ├── dispatcher.spec.ts
│   │   ├── ifta.spec.ts
│   │   ├── sign-up-captcha.spec.ts
│   │   ├── sitewide-interactive.playwright.spec.ts
│   │   └── vehicle-workflow.spec.ts
│   ├── fixtures
│   │   └── auth.ts
│   ├── lib
│   │   └── auth
│   │       └── auth.test.ts
│   └── test-setup.global.ts
├── types
│   ├── abac.ts
│   ├── actions.ts
│   ├── analytics.ts
│   ├── api.ts
│   ├── auth.ts
│   ├── compliance.ts
│   ├── dashboard.ts
│   ├── dispatch.ts
│   ├── drivers.ts
│   ├── globals.d.ts
│   ├── ifta.ts
│   ├── index.ts
│   ├── metadata.ts
│   ├── notifications.ts
│   ├── onboarding.ts
│   ├── prisma.d.ts
│   ├── search.ts
│   ├── settings.ts
│   ├── vehicles.ts
│   └── webhooks.ts
├── .env.example
├── components.json
├── middleware.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── playwright.config.ts
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
├── test-build.ps1
├── tsconfig.json
└── vitest.config.ts

```

## Architecture

### File Overview

**Multi-Tenant RBAC TMS SaaS aimed at SME Freight & Logistics Operators**

**Domains:**

- analytics
- auth
- compliance
- dashboard
- dispatch
- drivers
- ifta
- settings
- vehicles

**Public Pages:**

- About
- Features
- Home
- Pricing
- Privacy Policy
- Refunds
- Terms of Service

### Tech Stack Summary

**Current Tech Stack (FleetFusion & Companion Tooling)**

| Layer                        | Main Libraries / Services                                                                         | Notes                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Core framework & runtime** | • Next.js 15.4 (App Router, RSC) <br>• React 19.1 <br>• Node 18+                                  | First-class React Server Components, parallel builds enabled |
| **Language & Tooling**       | • TypeScript 5.8.3                                                                                | Strict mode ON, Vitest type-level tests supported            |
| **Database & ORM**           | • PostgreSQL (Neon Cloud) <br>• Prisma ORM 6.11.1 + `@prisma/adapter-neon`                        | Row-level multitenancy (`companyId` FK)                      |
| **Auth & Permissions**       | • Clerk 6.22 <br>• Custom ABAC + RBAC layers <br>• `@clerk/agent-toolkit`                         | Combines role + attribute checks in middleware               |
| **UI / Styling**             | • Tailwind CSS 4.1 <br>• shadcn/ui & Radix UI <br>• Framer Motion 12.18 <br>• Lucide-react 0.517  | Dark-mode default via `next-themes`                          |
| **Data-viz**                 | • Recharts 2.15 <br>• Chart.js 4 + React wrapper                                                  | Lightweight charts in RSC                                    |
| **Forms & Validation**       | • React-Hook-Form <br>• Zod + `@hookform/resolvers` <br>• `input-otp`                             | End-to-end typed form flow                                   |
| **State, Cache, Jobs**       | • Next.js `unstable_cache`, React Server Actions <br>• Upstash Redis rate-limit                   | Server-side mutations + throttling                           |
| **File / Doc handling**      | • `@react-pdf/renderer`, `pdf-lib`, `react-pdf` <br>• ExcelJS <br>• @vercel/blob                  | Generates freight docs, BOLs, Excel exports                  |
| **Testing**                  | • Vitest 3.2 <br>• Playwright 1.53 <br>• Testing-library/react                                    | Unit + e2e + type assertion coverage                         |
| **Dev / Build ops**          | • Vercel deploys <br>• ESLint, Prettier, tsx, dotenv <br>• Webpack build worker & parallel traces | CI uses GitHub Actions + MCP AI agents                       |
| **Utilities**                | • clsx, cva, tailwind-merge, uuid, js-cookie                                                      | Standard helpers                                             |
| **Date / Time**              | • date-fns, react-datepicker + TZ support                                                         | Handles carrier local times                                  |
| **Mobile & UX extras**       | • Vaul drawers, `react-resizable-panels`, Embla Carousel                                          | Responsive layout patterns                                   |

### Files by Directory

#### FleetFusion-Main

##### Root Level Configs

- FleetFusion-Main/components.json (json)
- FleetFusion-Main/middleware.ts (typescript)
- FleetFusion-Main/next.config.ts (typescript)
- FleetFusion-Main/package.json (json)
- FleetFusion-Main/postcss.config.mjs (plaintext)
- FleetFusion-Main/tailwind.config.ts (typescript)
- FleetFusion-Main/.env.example (plaintext)
- FleetFusion-Main/tsconfig.json (json)

##### FleetFusion-Main/app

- FleetFusion-Main/app/(auth)/accept-invitation/page.tsx (tsx)
- FleetFusion-Main/app/(auth)/forgot-password/page.tsx (tsx)
- FleetFusion-Main/app/(auth)/onboarding/layout.tsx (tsx)
- FleetFusion-Main/app/(auth)/onboarding/page.tsx (tsx)
- FleetFusion-Main/app/(auth)/sign-in/[[...sign-in]]/page.tsx (tsx)
- FleetFusion-Main/app/(auth)/sign-out/page.tsx (tsx)
- FleetFusion-Main/app/(auth)/sign-up/[[...sign-up]]/page.tsx (tsx)
- FleetFusion-Main/app/(auth)/error.tsx (tsx)
- FleetFusion-Main/app/(auth)/layout.tsx (tsx)
- FleetFusion-Main/app/(auth)/loading.tsx (tsx)
- FleetFusion-Main/app/(funnel)/about/page.tsx (tsx)
- FleetFusion-Main/app/(funnel)/contact/page.tsx (tsx)
- FleetFusion-Main/app/(funnel)/features/page.tsx (tsx)
- FleetFusion-Main/app/(funnel)/pricing/page.tsx (tsx)
- FleetFusion-Main/app/(funnel)/privacy/page.tsx (tsx)
- FleetFusion-Main/app/(funnel)/refund/page.tsx (tsx)
- FleetFusion-Main/app/(funnel)/services/page.tsx (tsx)
- FleetFusion-Main/app/(funnel)/terms/page.tsx (tsx)
- FleetFusion-Main/app/(funnel)/error.tsx (tsx)
- FleetFusion-Main/app/(funnel)/layout.tsx (tsx)
- FleetFusion-Main/app/(funnel)/loading.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/analytics/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/compliance/[userId]/hos-logs/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/compliance/[userId]/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/compliance/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/dashboard/[userId]/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/dispatch/[userId]/edit/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/dispatch/[userId]/new/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/dispatch/[userId]/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/drivers/new/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/drivers/[userId]/edit/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/drivers/[userId]/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/drivers/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/ifta/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/settings/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/new/new-vehicle-client.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/new/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/[vehicleId]/edit/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/[vehicleId]/edit/edit-vehicle-client.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/[vehicleId]/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/[vehicleId]/vehicle-details-client.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/page.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/vehicles-client.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/error.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/layout.tsx (tsx)
- FleetFusion-Main/app/(tenant)/[orgId]/loading.tsx (tsx)
- FleetFusion-Main/app/api/analytics/[orgId]/export/route.ts (typescript)
- FleetFusion-Main/app/api/analytics/[orgId]/schedule/route.ts (typescript)
- FleetFusion-Main/app/api/analytics/[orgId]/stream/route.ts (typescript)
- FleetFusion-Main/app/api/clerk/webhook-handler/route.ts (typescript)
- FleetFusion-Main/app/api/clerk/**tests**/webhook-handler.test.ts (typescript)
- FleetFusion-Main/app/api/dispatch/[orgId]/stream/route.ts (typescript)
- FleetFusion-Main/app/api/dispatch/[orgId]/updates/route.ts (typescript)
- FleetFusion-Main/app/api/files/upload/route.ts (typescript)
- FleetFusion-Main/app/api/files/**tests**/upload.test.ts (typescript)
- FleetFusion-Main/app/api/test/auth/route.ts (typescript)
- FleetFusion-Main/app/mobile/[orgId]/compliance/page.tsx (tsx)
- FleetFusion-Main/app/mobile/[orgId]/dashboard/[userId]/mobile-dashboard-layout.tsx (tsx)
- FleetFusion-Main/app/mobile/[orgId]/dashboard/[userId]/mobile-dashboard.tsx (tsx)
- FleetFusion-Main/app/mobile/[orgId]/layout.tsx (tsx)
- FleetFusion-Main/app/globals.css (css)
- FleetFusion-Main/app/layout.tsx (tsx)
- FleetFusion-Main/app/page.tsx (tsx)

##### FleetFusion-Main/components

- FleetFusion-Main/components/analytics/analytics-dashboard.tsx (tsx)
- FleetFusion-Main/components/analytics/driver-performance.tsx (tsx)
- FleetFusion-Main/components/analytics/financial-metrics.tsx (tsx)
- FleetFusion-Main/components/analytics/export-options.tsx (tsx)
- FleetFusion-Main/components/analytics/geographic-analysis.tsx (tsx)
- FleetFusion-Main/components/analytics/interactive-charts.tsx (tsx)
- FleetFusion-Main/components/analytics/MetricCard.tsx (tsx)
- FleetFusion-Main/components/analytics/mobile-analytics.tsx (tsx)
- FleetFusion-Main/components/analytics/realtime-dashboard.tsx (tsx)
- FleetFusion-Main/components/analytics/vehicle-utilization.tsx (tsx)
- FleetFusion-Main/components/auth/protected-route.tsx (tsx)
- FleetFusion-Main/components/auth/context.tsx (tsx)
- FleetFusion-Main/components/compliance/compliance-alerts.tsx (tsx)
- FleetFusion-Main/components/compliance/compliance-dashboard.tsx (tsx)
- FleetFusion-Main/components/compliance/compliance-documents.tsx (tsx)
- FleetFusion-Main/components/compliance/DocumentUploadForm.tsx (tsx)
- FleetFusion-Main/components/compliance/dot-inspection-management.tsx (tsx)
- FleetFusion-Main/components/compliance/driver-compliance-table.tsx (tsx)
- FleetFusion-Main/components/compliance/hos-log-viewer.tsx (tsx)
- FleetFusion-Main/components/compliance/vehicle-compliance-table.tsx (tsx)
- FleetFusion-Main/components/dashboard/audit-log-filters.tsx (tsx)
- FleetFusion-Main/components/dashboard/audit-log-table.tsx (tsx)
- FleetFusion-Main/components/dashboard/billing-actions.tsx (tsx)
- FleetFusion-Main/components/dashboard/billing-plan-comparison.tsx (tsx)
- FleetFusion-Main/components/dashboard/billing-plan-overview.tsx (tsx)
- FleetFusion-Main/components/dashboard/billing-usage-metrics.tsx (tsx)
- FleetFusion-Main/components/dashboard/bulk-user-actions.tsx (tsx)
- FleetFusion-Main/components/dashboard/dashboard-skeleton.tsx (tsx)
- FleetFusion-Main/components/dashboard/fleet-overview-header.tsx (tsx)
- FleetFusion-Main/components/dashboard/invite-user-form.tsx (tsx)
- FleetFusion-Main/components/dashboard/organization-stats.tsx (tsx)
- FleetFusion-Main/components/dashboard/resource-usage-cards.tsx (tsx)
- FleetFusion-Main/components/dashboard/role-assignment-modal.tsx (tsx)
- FleetFusion-Main/components/dashboard/system-health-checks.tsx (tsx)
- FleetFusion-Main/components/dashboard/system-overview-cards.tsx (tsx)
- FleetFusion-Main/components/dashboard/user-table.tsx (tsx)
- FleetFusion-Main/components/dispatch/dispatch-board.tsx (tsx)
- FleetFusion-Main/components/dispatch/dispatch-skeleton.tsx (tsx)
- FleetFusion-Main/components/dispatch/load-card.tsx (tsx)
- FleetFusion-Main/components/dispatch/load-details-dialog.tsx (tsx)
- FleetFusion-Main/components/dispatch/load-form.tsx (tsx)
- FleetFusion-Main/components/drivers/current-load-card.tsx (tsx)
- FleetFusion-Main/components/drivers/document-status-card.tsx (tsx)
- FleetFusion-Main/components/drivers/driver-card.tsx (tsx)
- FleetFusion-Main/components/drivers/drivers-skeleton.tsx (tsx)
- FleetFusion-Main/components/drivers/drivers-list-header.tsx (tsx)
- FleetFusion-Main/components/drivers/hos-status-cards.tsx (tsx)
- FleetFusion-Main/components/drivers/performance-card.tsx (tsx)
- FleetFusion-Main/components/drivers/recent-activity-card.tsx (tsx)
- FleetFusion-Main/components/drivers/upcoming-loads-card.tsx (tsx)
- FleetFusion-Main/components/ifta/ifta-columns.tsx (tsx)
- FleetFusion-Main/components/ifta/ifta-dashboard.tsx (tsx)
- FleetFusion-Main/components/ifta/ifta-tables.tsx (tsx)
- FleetFusion-Main/components/ifta/TaxRateManager.tsx (tsx)
- FleetFusion-Main/components/ifta/TaxRateManagerClient.tsx (tsx)
- FleetFusion-Main/components/navigation/MainNav.tsx (tsx)
- FleetFusion-Main/components/navigation/MobileNav.tsx (tsx)
- FleetFusion-Main/components/navigation/PublicNav.tsx (tsx)
- FleetFusion-Main/components/navigation/TopNavBar.tsx (tsx)
- FleetFusion-Main/components/onboarding/CompanySetupStep.tsx (tsx)
- FleetFusion-Main/components/onboarding/EmployeeJoinStep.tsx (tsx)
- FleetFusion-Main/components/onboarding/PersonalInfoStep.tsx (tsx)
- FleetFusion-Main/components/onboarding/ReviewSubmitStep.tsx (tsx)
- FleetFusion-Main/components/onboarding/RoleSelectionStep.tsx (tsx)
- FleetFusion-Main/components/pricing/pricing-section.tsx (tsx)
- FleetFusion-Main/components/settings/billing-settings.tsx (tsx)
- FleetFusion-Main/components/settings/company-settings.tsx (tsx)
- FleetFusion-Main/components/settings/CompanyProfileForm.tsx (tsx)
- FleetFusion-Main/components/settings/notification-settings.tsx (tsx)
- FleetFusion-Main/components/settings/integration-settings.tsx (tsx)
- FleetFusion-Main/components/settings/settings-dashboard.tsx (tsx)
- FleetFusion-Main/components/settings/user-settings.tsx (tsx)
- FleetFusion-Main/components/shared/AddressFields.tsx (tsx)
- FleetFusion-Main/components/shared/DocumentUpload.tsx (tsx)
- FleetFusion-Main/components/shared/ContactFields.tsx (tsx)
- FleetFusion-Main/components/shared/ErrorBoundary.tsx (tsx)
- FleetFusion-Main/components/shared/GlobalSearchBar.tsx (tsx)
- FleetFusion-Main/components/shared/LoadingSpinner.tsx (tsx)
- FleetFusion-Main/components/shared/NotificationCenter.tsx (tsx)
- FleetFusion-Main/components/shared/OptimizedImage.tsx (tsx)
- FleetFusion-Main/components/shared/RedirectMessage.tsx (tsx)
- FleetFusion-Main/components/shared/SharedFooter.tsx (tsx)
- FleetFusion-Main/components/shared/ThemeProvider.tsx (tsx)
- FleetFusion-Main/components/ui/accordion.tsx (tsx)
- FleetFusion-Main/components/ui/alert-dialog.tsx (tsx)
- FleetFusion-Main/components/ui/alert.tsx (tsx)
- FleetFusion-Main/components/ui/aspect-ratio.tsx (tsx)
- FleetFusion-Main/components/ui/avatar.tsx (tsx)
- FleetFusion-Main/components/ui/badge.tsx (tsx)
- FleetFusion-Main/components/ui/breadcrumb.tsx (tsx)
- FleetFusion-Main/components/ui/button.tsx (tsx)
- FleetFusion-Main/components/ui/calendar.tsx (tsx)
- FleetFusion-Main/components/ui/card.tsx (tsx)
- FleetFusion-Main/components/ui/carousel.tsx (tsx)
- FleetFusion-Main/components/ui/chart.tsx (tsx)
- FleetFusion-Main/components/ui/checkbox.tsx (tsx)
- FleetFusion-Main/components/ui/collapsible.tsx (tsx)
- FleetFusion-Main/components/ui/command.tsx (tsx)
- FleetFusion-Main/components/ui/container.tsx (tsx)
- FleetFusion-Main/components/ui/data-table.tsx (tsx)
- FleetFusion-Main/components/ui/context-menu.tsx (tsx)
- FleetFusion-Main/components/ui/dialog.tsx (tsx)
- FleetFusion-Main/components/ui/drawer.tsx (tsx)
- FleetFusion-Main/components/ui/dropdown-menu.tsx (tsx)
- FleetFusion-Main/components/ui/form.tsx (tsx)
- FleetFusion-Main/components/ui/hover-card.tsx (tsx)
- FleetFusion-Main/components/ui/input-otp.tsx (tsx)
- FleetFusion-Main/components/ui/input.tsx (tsx)
- FleetFusion-Main/components/ui/label.tsx (tsx)
- FleetFusion-Main/components/ui/loading-spinner.tsx (tsx)
- FleetFusion-Main/components/ui/menubar.tsx (tsx)
- FleetFusion-Main/components/ui/mobile-table.tsx (tsx)
- FleetFusion-Main/components/ui/navigation-menu.tsx (tsx)
- FleetFusion-Main/components/ui/page-header.tsx (tsx)
- FleetFusion-Main/components/ui/popover.tsx (tsx)
- FleetFusion-Main/components/ui/progress.tsx (tsx)
- FleetFusion-Main/components/ui/radio-group.tsx (tsx)
- FleetFusion-Main/components/ui/resizable.tsx (tsx)
- FleetFusion-Main/components/ui/responsive-layout.tsx (tsx)
- FleetFusion-Main/components/ui/scroll-area.tsx (tsx)
- FleetFusion-Main/components/ui/select.tsx (tsx)
- FleetFusion-Main/components/ui/separator.tsx (tsx)
- FleetFusion-Main/components/ui/sheet.tsx (tsx)
- FleetFusion-Main/components/ui/sidebar.tsx (tsx)
- FleetFusion-Main/components/ui/skeleton.tsx (tsx)
- FleetFusion-Main/components/ui/slider.tsx (tsx)
- FleetFusion-Main/components/ui/sonner.tsx (tsx)
- FleetFusion-Main/components/ui/switch.tsx (tsx)
- FleetFusion-Main/components/ui/table.tsx (tsx)
- FleetFusion-Main/components/ui/tabs.tsx (tsx)
- FleetFusion-Main/components/ui/textarea.tsx (tsx)
- FleetFusion-Main/components/ui/toast.tsx (tsx)
- FleetFusion-Main/components/ui/toaster.tsx (tsx)
- FleetFusion-Main/components/ui/toggle.tsx (tsx)
- FleetFusion-Main/components/ui/tooltip.tsx (tsx)
- FleetFusion-Main/components/ui/toggle-group.tsx (tsx)
- FleetFusion-Main/components/vehicles/add-vehicle-dialog.tsx (tsx)
- FleetFusion-Main/components/vehicles/vehicle-card.tsx (tsx)
- FleetFusion-Main/components/vehicles/vehicle-details-dialog.tsx (tsx)
- FleetFusion-Main/components/vehicles/vehicle-form.tsx (tsx)
- FleetFusion-Main/components/vehicles/vehicle-list-client.tsx (tsx)
- FleetFusion-Main/components/vehicles/vehicle-table.tsx (tsx)

##### FleetFusion-Main/config

- FleetFusion-Main/config/pdf.ts (typescript)

##### FleetFusion-Main/features

- FleetFusion-Main/features/analytics/dashboard-metrics.tsx (tsx)
- FleetFusion-Main/features/analytics/MainDashboardFeature.tsx (tsx)
- FleetFusion-Main/features/analytics/performance-metrics.tsx (tsx)
- FleetFusion-Main/features/auth/index.ts (typescript)
- FleetFusion-Main/features/compliance/ComplianceDashboard.tsx (tsx)
- FleetFusion-Main/features/dashboard/AdminOverview.tsx (tsx)
- FleetFusion-Main/features/dashboard/AuditLogViewer.tsx (tsx)
- FleetFusion-Main/features/dashboard/BillingManagement.tsx (tsx)
- FleetFusion-Main/features/dashboard/SystemHealth.tsx (tsx)
- FleetFusion-Main/features/dashboard/UserManagementDashboard.tsx (tsx)
- FleetFusion-Main/features/dispatch/DispatchBoardFeature.tsx (tsx)
- FleetFusion-Main/features/dispatch/recent-activity.tsx (tsx)
- FleetFusion-Main/features/drivers/AssignmentDialogButton.tsx (tsx)
- FleetFusion-Main/features/drivers/AssignmentDialogWrapper.tsx (tsx)
- FleetFusion-Main/features/drivers/DriverAssignmentDialog.tsx (tsx)
- FleetFusion-Main/features/drivers/DriverDetailsDialog.tsx (tsx)
- FleetFusion-Main/features/drivers/DriverForm.tsx (tsx)
- FleetFusion-Main/features/drivers/DriverFormFeature.tsx (tsx)
- FleetFusion-Main/features/drivers/DriversList.tsx (tsx)
- FleetFusion-Main/features/drivers/DriversListClient.tsx (tsx)
- FleetFusion-Main/features/ifta/IftaReportingFeature.tsx (tsx)
- FleetFusion-Main/features/onboarding/OnboardingStepper.tsx (tsx)
- FleetFusion-Main/features/settings/**tests**/CompanySettingsPage.test.tsx (tsx)
- FleetFusion-Main/features/settings/CompanySettingsPage.tsx (tsx)
- FleetFusion-Main/features/settings/UserSettingsPage.tsx (tsx)
- FleetFusion-Main/features/vehicles/add-vehicle-dialog.tsx (tsx)
- FleetFusion-Main/features/vehicles/edit-vehicle-dialog.tsx (tsx)
- FleetFusion-Main/features/vehicles/VehicleListPage.tsx (tsx)

##### FleetFusion-Main/hooks

- FleetFusion-Main/hooks/use-dispatch-realtime.ts (typescript)
- FleetFusion-Main/hooks/use-mobile.tsx (tsx)
- FleetFusion-Main/hooks/use-toast.ts (typescript)
- FleetFusion-Main/hooks/useDashboardPreferences.ts (typescript)

##### FleetFusion-Main/lib

- FleetFusion-Main/lib/actions/analyticsActions.ts (typescript)
- FleetFusion-Main/lib/actions/analyticsReportActions.ts (typescript)
- FleetFusion-Main/lib/actions/auditActions.ts (typescript)
- FleetFusion-Main/lib/actions/auditLogActions.ts (typescript)
- FleetFusion-Main/lib/actions/authActions.ts (typescript)
- FleetFusion-Main/lib/actions/complianceActions.ts (typescript)
- FleetFusion-Main/lib/actions/complianceMonitoring.ts (typescript)
- FleetFusion-Main/lib/actions/complianceReportActions.ts (typescript)
- FleetFusion-Main/lib/actions/dashboardActions.ts (typescript)
- FleetFusion-Main/lib/actions/dispatchActions.ts (typescript)
- FleetFusion-Main/lib/actions/driverActions.ts (typescript)
- FleetFusion-Main/lib/actions/fileUploadActions.ts (typescript)
- FleetFusion-Main/lib/actions/inspectionActions.ts (typescript)
- FleetFusion-Main/lib/actions/invitationActions.ts (typescript)
- FleetFusion-Main/lib/actions/loadActions.ts (typescript)
- FleetFusion-Main/lib/actions/notificationActions.ts (typescript)
- FleetFusion-Main/lib/actions/onboardingActions.ts (typescript)
- FleetFusion-Main/lib/actions/regulatoryAuditActions.ts (typescript)
- FleetFusion-Main/lib/actions/searchActions.ts (typescript)
- FleetFusion-Main/lib/actions/settingsActions.ts (typescript)
- FleetFusion-Main/lib/actions/userActions.ts (typescript)
- FleetFusion-Main/lib/actions/vehicleActions.ts (typescript)
- FleetFusion-Main/lib/admin/logging.ts (typescript)
- FleetFusion-Main/lib/auth/auth.ts (typescript)
- FleetFusion-Main/lib/auth/permissions.ts (typescript)
- FleetFusion-Main/lib/auth/secure-session-management.ts (typescript)
- FleetFusion-Main/lib/auth/session-claims-utils.ts (typescript)
- FleetFusion-Main/lib/auth/utils.ts (typescript)
- FleetFusion-Main/lib/cache/auth-cache.ts (typescript)
- FleetFusion-Main/lib/cache/redis.ts (typescript)
- FleetFusion-Main/lib/compliance/regulatoryEngine.ts (typescript)
- FleetFusion-Main/lib/config/environment.ts (typescript)
- FleetFusion-Main/lib/database/db.ts (typescript)
- FleetFusion-Main/lib/errors/handleError.ts (typescript)
- FleetFusion-Main/lib/fetchers/analyticsFetchers.ts (typescript)
- FleetFusion-Main/lib/fetchers/authFetchers.ts (typescript)
- FleetFusion-Main/lib/fetchers/complianceFetchers.ts (typescript)
- FleetFusion-Main/lib/fetchers/dashboardFetchers.ts (typescript)
- FleetFusion-Main/lib/fetchers/dispatchFetchers.ts (typescript)
- FleetFusion-Main/lib/fetchers/driverFetchers.ts (typescript)
- FleetFusion-Main/lib/fetchers/iftaFetchers.ts (typescript)
- FleetFusion-Main/lib/fetchers/onboardingFetchers.ts (typescript)
- FleetFusion-Main/lib/fetchers/notificationFetchers.ts (typescript)
- FleetFusion-Main/lib/fetchers/searchFetchers.ts (typescript)
- FleetFusion-Main/lib/fetchers/settingsFetchers.ts (typescript)
- FleetFusion-Main/lib/fetchers/userFetchers.ts (typescript)
- FleetFusion-Main/lib/fetchers/vehicleFetchers.ts (typescript)
- FleetFusion-Main/lib/pdf/ifta-pdf-service.ts (typescript)
- FleetFusion-Main/lib/pdf/ifta-pdf-templates.tsx (tsx)
- FleetFusion-Main/lib/pdf/pdf-utils.ts (typescript)
- FleetFusion-Main/lib/services/mcp-clerk.ts (typescript)
- FleetFusion-Main/lib/services/pdfService.ts (typescript)
- FleetFusion-Main/lib/utils/hos.ts (typescript)
- FleetFusion-Main/lib/utils/ifta.ts (typescript)
- FleetFusion-Main/lib/utils/mvp-verification.ts (typescript)
- FleetFusion-Main/lib/utils/prisma-serializer.ts (typescript)
- FleetFusion-Main/lib/utils/rate-limit.ts (typescript)
- FleetFusion-Main/lib/utils/utils.ts (typescript)
- FleetFusion-Main/lib/utils/slugUtils.ts (typescript)

##### FleetFusion-Main/schemas

- FleetFusion-Main/schemas/analytics.ts (typescript)
- FleetFusion-Main/schemas/auditLogSchema.ts (typescript)
- FleetFusion-Main/schemas/auth.ts (typescript)
- FleetFusion-Main/schemas/compliance.ts (typescript)
- FleetFusion-Main/schemas/dashboard.ts (typescript)
- FleetFusion-Main/schemas/dispatch.ts (typescript)
- FleetFusion-Main/schemas/drivers.ts (typescript)
- FleetFusion-Main/schemas/ifta.ts (typescript)
- FleetFusion-Main/schemas/onboarding.ts (typescript)
- FleetFusion-Main/schemas/regulatory.ts (typescript)
- FleetFusion-Main/schemas/settings.ts (typescript)
- FleetFusion-Main/schemas/shared.ts (typescript)
- FleetFusion-Main/schemas/vehicles.ts (typescript)

##### FleetFusion-Main/types

- FleetFusion-Main/types/abac.ts (typescript)
- FleetFusion-Main/types/actions.ts (typescript)
- FleetFusion-Main/types/analytics.ts (typescript)
- FleetFusion-Main/types/api.ts (typescript)
- FleetFusion-Main/types/auth.ts (typescript)
- FleetFusion-Main/types/compliance.ts (typescript)
- FleetFusion-Main/types/dashboard.ts (typescript)
- FleetFusion-Main/types/dispatch.ts (typescript)
- FleetFusion-Main/types/drivers.ts (typescript)
- FleetFusion-Main/types/globals.d.ts (typescript)
- FleetFusion-Main/types/ifta.ts (typescript)
- FleetFusion-Main/types/index.ts (typescript)
- FleetFusion-Main/types/metadata.ts (typescript)
- FleetFusion-Main/types/notifications.ts (typescript)
- FleetFusion-Main/types/onboarding.ts (typescript)
- FleetFusion-Main/types/prisma.d.ts (typescript)
- FleetFusion-Main/types/search.ts (typescript)
- FleetFusion-Main/types/settings.ts (typescript)
- FleetFusion-Main/types/vehicles.ts (typescript)
- FleetFusion-Main/types/webhooks.ts (typescript)

##### FleetFusion-Main/prisma

- FleetFusion-Main/prisma/migrations/20250707061329_initial_schema/migration.sql (plaintext)
- FleetFusion-Main/prisma/migrations/20250707065454_add_preferences_field_to_user_model/migration.sql (plaintext)
- FleetFusion-Main/prisma/migrations/20250707073801_remove_clerk_id_from_user_model/migration.sql (plaintext)
- FleetFusion-Main/prisma/migrations/migration_lock.toml (plaintext)
- FleetFusion-Main/prisma/schema.prisma (plaintext)
- FleetFusion-Main/prisma/seed.ts (typescript)

### Key Dependencies

#### FleetFusion-Main/app/(auth)/accept-invitation

- FleetFusion-Main/app/(auth)/accept-invitation/page.tsx
  - Imports: react, next/navigation, @clerk/nextjs, lucide-react, @/components/ui/button, @/components/ui/input, @/components/ui/label, @/components/ui/card, @/hooks/use-toast, @/types/abac

#### FleetFusion-Main/app/(auth)/forgot-password

- FleetFusion-Main/app/(auth)/forgot-password/page.tsx
  - Imports: react, @clerk/nextjs, next/navigation, next

#### FleetFusion-Main/app/(auth)/onboarding

- FleetFusion-Main/app/(auth)/onboarding/layout.tsx
  - Imports: next/navigation, @/lib/auth/auth
- FleetFusion-Main/app/(auth)/onboarding/page.tsx
  - Imports: react, @/features/onboarding/OnboardingStepper

#### FleetFusion-Main/app/(auth)/sign-in/[[...sign-in]]

- FleetFusion-Main/app/(auth)/sign-in/[[...sign-in]]/page.tsx
  - Imports: @clerk/nextjs, lucide-react, next/link, next/navigation, react, @/components/ui/button

#### FleetFusion-Main/app/(auth)/sign-out

- FleetFusion-Main/app/(auth)/sign-out/page.tsx
  - Imports: react, @clerk/nextjs, lucide-react

#### FleetFusion-Main/app/(auth)/sign-up/[[...sign-up]]

- FleetFusion-Main/app/(auth)/sign-up/[[...sign-up]]/page.tsx
  - Imports: next/link, react, @clerk/nextjs, lucide-react

#### FleetFusion-Main/app/(auth)

- FleetFusion-Main/app/(auth)/error.tsx
  - Imports: @/components/ui/button, lucide-react, next/link, react
- FleetFusion-Main/app/(auth)/layout.tsx
  - Imports: react
- FleetFusion-Main/app/(auth)/loading.tsx
  - Imports: react, @/components/shared/RedirectMessage

#### FleetFusion-Main/app/(funnel)/about

- FleetFusion-Main/app/(funnel)/about/page.tsx
  - Imports: next/image, next/link

#### FleetFusion-Main/app/(funnel)/contact

- FleetFusion-Main/app/(funnel)/contact/page.tsx
  - Imports: react

#### FleetFusion-Main/app/(funnel)/features

- FleetFusion-Main/app/(funnel)/features/page.tsx
  - Imports: lucide-react, next/image, next/link

#### FleetFusion-Main/app/(funnel)/pricing

- FleetFusion-Main/app/(funnel)/pricing/page.tsx
  - Imports: @/components/pricing/pricing-section, @/components/shared/SharedFooter

#### FleetFusion-Main/app/(funnel)/privacy

- FleetFusion-Main/app/(funnel)/privacy/page.tsx
  - Imports: next/link, next/image

#### FleetFusion-Main/app/(funnel)/refund

- FleetFusion-Main/app/(funnel)/refund/page.tsx
  - Imports: next/link

#### FleetFusion-Main/app/(funnel)/services

- FleetFusion-Main/app/(funnel)/services/page.tsx

#### FleetFusion-Main/app/(funnel)/terms

- FleetFusion-Main/app/(funnel)/terms/page.tsx
  - Imports: next/link, next/image

#### FleetFusion-Main/app/(funnel)

- FleetFusion-Main/app/(funnel)/error.tsx
  - Imports: next/image
- FleetFusion-Main/app/(funnel)/layout.tsx
  - Imports: react, @/components/navigation/PublicNav
- FleetFusion-Main/app/(funnel)/loading.tsx
  - Imports: react, @/components/shared/RedirectMessage

#### FleetFusion-Main/app/(tenant)/[orgId]/analytics

- FleetFusion-Main/app/(tenant)/[orgId]/analytics/page.tsx
  - Imports: lucide-react, @/components/analytics/driver-performance, @/components/analytics/export-options, @/components/analytics/financial-metrics, @/components/analytics/geographic-analysis, @/components/analytics/interactive-charts, @/components/analytics/mobile-analytics, @/features/analytics/performance-metrics, @/components/analytics/realtime-dashboard, @/components/analytics/vehicle-utilization, @/components/ui/card, @/components/ui/tabs, @/lib/fetchers/analyticsFetchers, @/lib/fetchers/driverFetchers, @/types/analytics

#### FleetFusion-Main/app/(tenant)/[orgId]/compliance/[userId]/hos-logs

- FleetFusion-Main/app/(tenant)/[orgId]/compliance/[userId]/hos-logs/page.tsx
  - Imports: @/components/compliance/hos-log-viewer

#### FleetFusion-Main/app/(tenant)/[orgId]/compliance/[userId]

- FleetFusion-Main/app/(tenant)/[orgId]/compliance/[userId]/page.tsx
  - Imports: react, lucide-react, @/components/ui/card, @/components/shared/LoadingSpinner, @/components/compliance/driver-compliance-table, @/components/ui/button, @/components/ui/badge, @/components/ui/progress

#### FleetFusion-Main/app/(tenant)/[orgId]/compliance

- FleetFusion-Main/app/(tenant)/[orgId]/compliance/page.tsx
  - Imports: react, lucide-react, @/components/ui/tabs, @/components/ui/card, @/components/ui/button, @/components/compliance/driver-compliance-table, @/components/compliance/vehicle-compliance-table, @/components/compliance/compliance-documents, @/components/compliance/compliance-dashboard, @/components/compliance/dot-inspection-management, @/components/compliance/compliance-alerts, @/lib/fetchers/complianceFetchers

#### FleetFusion-Main/app/(tenant)/[orgId]/dashboard/[userId]

- FleetFusion-Main/app/(tenant)/[orgId]/dashboard/[userId]/page.tsx
  - Imports: react, lucide-react, @/components/dashboard/fleet-overview-header, @/features/dashboard/UserManagementDashboard, @/components/dashboard/dashboard-skeleton, @/lib/auth/auth, @/components/shared/LoadingSpinner, @/components/ui/card, @/features/dashboard/AdminOverview, @/features/dashboard/AuditLogViewer, @/features/dashboard/BillingManagement, @/lib/fetchers/dashboardFetchers, @/types/dashboard, @/features/dashboard/SystemHealth, @/components/ui/tabs, next/link, @/components/ui/button, @/components/dashboard/billing-actions

#### FleetFusion-Main/app/(tenant)/[orgId]/dispatch/[userId]/edit

- FleetFusion-Main/app/(tenant)/[orgId]/dispatch/[userId]/edit/page.tsx
  - Imports: next/navigation, @/components/dispatch/load-form, @/lib/fetchers/dispatchFetchers, @/lib/auth/auth

#### FleetFusion-Main/app/(tenant)/[orgId]/dispatch/[userId]/new

- FleetFusion-Main/app/(tenant)/[orgId]/dispatch/[userId]/new/page.tsx
  - Imports: @/components/dispatch/load-form, @/lib/fetchers/dispatchFetchers, @/lib/auth/auth

#### FleetFusion-Main/app/(tenant)/[orgId]/dispatch/[userId]

- FleetFusion-Main/app/(tenant)/[orgId]/dispatch/[userId]/page.tsx
  - Imports: react, @/components/ui/card, lucide-react, @/components/dispatch/dispatch-skeleton, @/features/dispatch/DispatchBoardFeature

#### FleetFusion-Main/app/(tenant)/[orgId]/drivers/new

- FleetFusion-Main/app/(tenant)/[orgId]/drivers/new/page.tsx
  - Imports: @/features/drivers/DriverFormFeature, @/components/drivers/drivers-skeleton, react, @/components/drivers/drivers-list-header, @/schemas/drivers

#### FleetFusion-Main/app/(tenant)/[orgId]/drivers/[userId]/edit

- FleetFusion-Main/app/(tenant)/[orgId]/drivers/[userId]/edit/page.tsx
  - Imports: @/features/drivers/DriverFormFeature, @/components/drivers/drivers-skeleton, react, @/components/drivers/drivers-list-header, @/lib/fetchers/driverFetchers

#### FleetFusion-Main/app/(tenant)/[orgId]/drivers/[userId]

- FleetFusion-Main/app/(tenant)/[orgId]/drivers/[userId]/page.tsx
  - Imports: react, next/navigation, @/lib/fetchers/driverFetchers, @/components/drivers/current-load-card, @/components/drivers/upcoming-loads-card, @/components/drivers/recent-activity-card, @/components/drivers/performance-card, @/components/drivers/hos-status-cards, @/components/drivers/document-status-card, @/features/drivers/AssignmentDialogWrapper, @/types/drivers, @/components/drivers/drivers-skeleton, @/components/drivers/drivers-list-header, @/components/ui/button, lucide-react, next/link, @/components/ui/badge, @/components/ui/avatar

#### FleetFusion-Main/app/(tenant)/[orgId]/drivers

- FleetFusion-Main/app/(tenant)/[orgId]/drivers/page.tsx
  - Imports: @/components/drivers/drivers-skeleton, react, @/components/drivers/drivers-list-header, @/features/drivers/DriversList

#### FleetFusion-Main/app/(tenant)/[orgId]/ifta

- FleetFusion-Main/app/(tenant)/[orgId]/ifta/page.tsx
  - Imports: react, lucide-react, @/components/ifta/ifta-columns, @/components/ifta/ifta-tables, @/components/ui/button, @/components/ui/card, @/components/ui/tabs, @/lib/fetchers/iftaFetchers, @/types/ifta

#### FleetFusion-Main/app/(tenant)/[orgId]/settings

- FleetFusion-Main/app/(tenant)/[orgId]/settings/page.tsx
  - Imports: react, @clerk/nextjs/server, next/navigation, @/components/settings/settings-dashboard, @/lib/fetchers/settingsFetchers, @/lib/database/db, @/components/shared/LoadingSpinner, @/lib/auth/auth

#### FleetFusion-Main/app/(tenant)/[orgId]/vehicles/new

- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/new/new-vehicle-client.tsx
  - Imports: react, next/navigation, @/components/vehicles/vehicle-form, @/types/vehicles, @/lib/actions/vehicleActions, @/hooks/use-toast
- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/new/page.tsx
  - Imports: react, ./new-vehicle-client

#### FleetFusion-Main/app/(tenant)/[orgId]/vehicles/[vehicleId]/edit

- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/[vehicleId]/edit/page.tsx
  - Imports: react, next/navigation, @/lib/fetchers/vehicleFetchers, ./edit-vehicle-client
- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/[vehicleId]/edit/edit-vehicle-client.tsx
  - Imports: react, next/navigation, @/components/vehicles/vehicle-form, @/types/vehicles, @/lib/actions/vehicleActions, @/hooks/use-toast

#### FleetFusion-Main/app/(tenant)/[orgId]/vehicles/[vehicleId]

- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/[vehicleId]/page.tsx
  - Imports: react, next/navigation, @/lib/fetchers/vehicleFetchers, ./vehicle-details-client
- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/[vehicleId]/vehicle-details-client.tsx
  - Imports: react, @/types/vehicles, @/components/vehicles/vehicle-table, @/components/ui/card, @/components/ui/badge, @/components/ui/button, @/components/ui/tabs, lucide-react, next/link

#### FleetFusion-Main/app/(tenant)/[orgId]/vehicles

- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/page.tsx
  - Imports: react, @/lib/fetchers/vehicleFetchers, lucide-react, next/link, ./vehicles-client
- FleetFusion-Main/app/(tenant)/[orgId]/vehicles/vehicles-client.tsx
  - Imports: react, @/types/vehicles, @/components/vehicles/vehicle-table, @/components/vehicles/vehicle-card, @/components/vehicles/vehicle-details-dialog, @/components/ui/button, lucide-react

#### FleetFusion-Main/app/(tenant)/[orgId]

- FleetFusion-Main/app/(tenant)/[orgId]/error.tsx
  - Imports: next/image
- FleetFusion-Main/app/(tenant)/[orgId]/layout.tsx
  - Imports: @/components/navigation/TopNavBar, @/components/navigation/MainNav, @/hooks/use-mobile, @/components/auth/context, react
- FleetFusion-Main/app/(tenant)/[orgId]/loading.tsx
  - Imports: react, @/components/shared/RedirectMessage

#### FleetFusion-Main/app/api/analytics/[orgId]/export

- FleetFusion-Main/app/api/analytics/[orgId]/export/route.ts
  - Imports: exceljs, next/server

#### FleetFusion-Main/app/api/analytics/[orgId]/schedule

- FleetFusion-Main/app/api/analytics/[orgId]/schedule/route.ts
  - Imports: next/server, @clerk/nextjs/server, @/lib/database/db

#### FleetFusion-Main/app/api/analytics/[orgId]/stream

- FleetFusion-Main/app/api/analytics/[orgId]/stream/route.ts
  - Imports: next/server, @clerk/nextjs/server, @/lib/database/db, @/lib/fetchers/analyticsFetchers

#### FleetFusion-Main/app/api/clerk/webhook-handler

- FleetFusion-Main/app/api/clerk/webhook-handler/route.ts
  - Imports: @clerk/types, next/server, svix, @/lib/database/db

#### FleetFusion-Main/app/api/clerk/**tests**

- FleetFusion-Main/app/api/clerk/**tests**/webhook-handler.test.ts
  - Imports: vitest, next/server

#### FleetFusion-Main/app/api/dispatch/[orgId]/stream

- FleetFusion-Main/app/api/dispatch/[orgId]/stream/route.ts
  - Imports: @/lib/database/db, @clerk/nextjs/server, next/server

#### FleetFusion-Main/app/api/dispatch/[orgId]/updates

- FleetFusion-Main/app/api/dispatch/[orgId]/updates/route.ts
  - Imports: @clerk/nextjs/server, @/lib/database/db

#### FleetFusion-Main/app/api/files/upload

- FleetFusion-Main/app/api/files/upload/route.ts
  - Imports: next/server, @clerk/nextjs/server, @vercel/blob/client

#### FleetFusion-Main/app/api/files/**tests**

- FleetFusion-Main/app/api/files/**tests**/upload.test.ts
  - Imports: vitest, next/server, ../upload/route

#### FleetFusion-Main/app/api/test/auth

- FleetFusion-Main/app/api/test/auth/route.ts
  - Imports: next/server

#### FleetFusion-Main/app/mobile/[orgId]/compliance

- FleetFusion-Main/app/mobile/[orgId]/compliance/page.tsx
  - Imports: react, @/components/compliance/DocumentUploadForm

#### FleetFusion-Main/app/mobile/[orgId]/dashboard/[userId]

- FleetFusion-Main/app/mobile/[orgId]/dashboard/[userId]/mobile-dashboard-layout.tsx
  - Imports: react, @/components/ui/card, @/components/ui/button, @/components/ui/badge, @/components/ui/sheet, lucide-react, @/hooks/use-mobile, @/types/dashboard, @/types/auth, @/types/abac
- FleetFusion-Main/app/mobile/[orgId]/dashboard/[userId]/mobile-dashboard.tsx
  - Imports: react, @/components/ui/card, @/components/ui/badge, @/components/ui/button, @/components/ui/responsive-layout, @/components/ui/mobile-table, @/hooks/use-mobile, lucide-react

#### FleetFusion-Main/app/mobile/[orgId]

- FleetFusion-Main/app/mobile/[orgId]/layout.tsx
  - Imports: react, @/components/auth/protected-route

#### FleetFusion-Main/app

- FleetFusion-Main/app/globals.css
- FleetFusion-Main/app/layout.tsx
  - Imports: react, @/app/globals.css, @clerk/nextjs, next, next/font/google, @/components/auth/context, @/components/shared/ThemeProvider
- FleetFusion-Main/app/page.tsx
  - Imports: lucide-react, next/image, next/link, react, @/components/ui/button, @/components/pricing/pricing-section, @/components/shared/SharedFooter, @/components/navigation/PublicNav

#### FleetFusion-Main/components/analytics

- FleetFusion-Main/components/analytics/analytics-dashboard.tsx
  - Imports: react, lucide-react, @/components/ui/card, @/components/ui/tabs, @/components/ui/button, @/components/ui/select, @/features/analytics/performance-metrics, ./financial-metrics, ./driver-performance, ./vehicle-utilization
- FleetFusion-Main/components/analytics/driver-performance.tsx
  - Imports: recharts, @/components/ui/chart, @/components/ui/table, @/types/analytics
- FleetFusion-Main/components/analytics/financial-metrics.tsx
  - Imports: recharts, @/components/ui/chart, @/types/analytics
- FleetFusion-Main/components/analytics/export-options.tsx
  - Imports: @/components/ui/button, @/components/ui/checkbox, @/components/ui/dialog, @/components/ui/dropdown-menu, @/components/ui/input, @/components/ui/label, @/components/ui/select, @/components/ui/textarea, @/hooks/use-toast, @/lib/fetchers/analyticsFetchers, lucide-react, react
- FleetFusion-Main/components/analytics/geographic-analysis.tsx
  - Imports: react, framer-motion, @/components/ui/card, @/components/ui/button, @/components/ui/badge, @/components/ui/tabs, @/components/ui/select, lucide-react, @/types/analytics
- FleetFusion-Main/components/analytics/interactive-charts.tsx
  - Imports: @/components/ui/badge, @/components/ui/button, @/components/ui/card, @/components/ui/select, @/components/ui/tabs, @/types/analytics, framer-motion, lucide-react, react, react-intersection-observer, recharts
- FleetFusion-Main/components/analytics/MetricCard.tsx
  - Imports: react
- FleetFusion-Main/components/analytics/mobile-analytics.tsx
  - Imports: @/components/ui/badge, @/components/ui/button, @/components/ui/card, @/components/ui/drawer, @/components/ui/sheet, @/components/ui/tabs, @/types/analytics, chart.js, framer-motion, lucide-react, react, react-chartjs-2
- FleetFusion-Main/components/analytics/realtime-dashboard.tsx
  - Imports: react, framer-motion, @/components/ui/card, @/components/ui/badge, @/components/ui/button, @/components/ui/alert, lucide-react, @/types/analytics, react/jsx-runtime
- FleetFusion-Main/components/analytics/vehicle-utilization.tsx
  - Imports: recharts, @/components/ui/chart, @/components/ui/table, @/components/ui/badge, @/types/vehicles, @prisma/client

#### FleetFusion-Main/components/auth

- FleetFusion-Main/components/auth/protected-route.tsx
  - Imports: react, next/navigation, lucide-react, @/components/auth/context
- FleetFusion-Main/components/auth/context.tsx
  - Imports: react, @clerk/nextjs, @/types/auth, @/types/abac, @/lib/cache/auth-cache

#### FleetFusion-Main/components/compliance

- FleetFusion-Main/components/compliance/compliance-alerts.tsx
  - Imports: react, lucide-react, @/components/ui/card, @/components/ui/button, @/components/ui/badge, @/components/ui/alert, @/components/ui/separator
- FleetFusion-Main/components/compliance/compliance-dashboard.tsx
  - Imports: react, lucide-react, @/components/ui/card, @/components/ui/tabs, @/components/ui/button, @/components/ui/badge, @/components/ui/progress, ./driver-compliance-table, ./vehicle-compliance-table, ./compliance-documents, @/lib/actions/regulatoryAuditActions
- FleetFusion-Main/components/compliance/compliance-documents.tsx
  - Imports: lucide-react, @tanstack/react-table, @/components/ui/button, @/components/ui/dropdown-menu, @/components/ui/badge, @/types/compliance, @/components/shared/DocumentUpload
- FleetFusion-Main/components/compliance/DocumentUploadForm.tsx
  - Imports: react, @vercel/blob/client, @/types/compliance, @/lib/actions/fileUploadActions
- FleetFusion-Main/components/compliance/dot-inspection-management.tsx
  - Imports: react, lucide-react, @tanstack/react-table, @/components/ui/button, @/components/ui/card, @/components/ui/input, @/components/ui/badge, @/components/ui/dropdown-menu, @/components/ui/dialog, @/components/ui/label, @/components/ui/textarea, @/components/ui/select, @/components/ui/data-table
- FleetFusion-Main/components/compliance/driver-compliance-table.tsx
  - Imports: lucide-react, @/components/ui/table, @/components/ui/badge, @/components/ui/dropdown-menu, @/components/ui/button, @/lib/fetchers/complianceFetchers
- FleetFusion-Main/components/compliance/hos-log-viewer.tsx
  - Imports: react, date-fns, lucide-react, @/components/ui/card, @/components/ui/tabs, @/components/ui/button, @/components/ui/select, @/components/ui/calendar, @/components/ui/popover
- FleetFusion-Main/components/compliance/vehicle-compliance-table.tsx
  - Imports: react, lucide-react, @tanstack/react-table, @/components/ui/badge, @/components/ui/button, @/components/ui/dropdown-menu

#### FleetFusion-Main/components/dashboard

- FleetFusion-Main/components/dashboard/audit-log-filters.tsx
  - Imports: lucide-react, @/components/ui/button, @/components/ui/input, @/components/ui/select
- FleetFusion-Main/components/dashboard/audit-log-table.tsx
  - Imports: @/components/ui/badge, @/components/ui/button, @/components/ui/dialog, lucide-react, @/types/dashboard
- FleetFusion-Main/components/dashboard/billing-actions.tsx
  - Imports: @clerk/nextjs, @/components/ui/button
- FleetFusion-Main/components/dashboard/billing-plan-comparison.tsx
  - Imports: react, @clerk/nextjs
- FleetFusion-Main/components/dashboard/billing-plan-overview.tsx
  - Imports: @/components/ui/card, @/components/ui/separator, lucide-react
- FleetFusion-Main/components/dashboard/billing-usage-metrics.tsx
  - Imports: @/components/ui/card, @/components/ui/progress, @/components/ui/alert, lucide-react
- FleetFusion-Main/components/dashboard/bulk-user-actions.tsx
  - Imports: react, lucide-react, @/components/ui/button, @/components/ui/card, @/components/ui/dialog, @/components/ui/label, @/components/ui/select, @/components/ui/textarea, @/hooks/use-toast, @/lib/actions/dashboardActions, @/lib/actions/userActions
- FleetFusion-Main/components/dashboard/dashboard-skeleton.tsx
  - Imports: @/components/ui/skeleton, @/components/ui/card
- FleetFusion-Main/components/dashboard/fleet-overview-header.tsx
  - Imports: @/components/ui/card, @/lib/fetchers/analyticsFetchers, @/types/dashboard, lucide-react
- FleetFusion-Main/components/dashboard/invite-user-form.tsx
  - Imports: react
- FleetFusion-Main/components/dashboard/organization-stats.tsx
  - Imports: lucide-react, @/components/ui/badge, @/components/ui/card, @/lib/fetchers/dashboardFetchers, @/components/ui/button
- FleetFusion-Main/components/dashboard/resource-usage-cards.tsx
  - Imports: @/components/ui/card, @/components/ui/progress, @/components/ui/alert, lucide-react, react
- FleetFusion-Main/components/dashboard/role-assignment-modal.tsx
  - Imports: react, lucide-react, @/components/ui/button, @/components/ui/card, @/components/ui/dialog, @/components/ui/label, @/components/ui/select
- FleetFusion-Main/components/dashboard/system-health-checks.tsx
  - Imports: @/components/ui/card, lucide-react, react
- FleetFusion-Main/components/dashboard/system-overview-cards.tsx
  - Imports: @/components/ui/card, @/components/ui/badge, lucide-react, react
- FleetFusion-Main/components/dashboard/user-table.tsx
  - Imports: react, @/types/dashboard, @/components/ui/card, lucide-react, @/lib/fetchers/userFetchers, @/components/dashboard/role-assignment-modal, @/components/ui/button, @/lib/actions/onboardingActions, @/types/abac

#### FleetFusion-Main/components/dispatch

- FleetFusion-Main/components/dispatch/dispatch-board.tsx
  - Imports: @/hooks/use-dispatch-realtime, @/types/dispatch, lucide-react, next/navigation, react, @/components/dispatch/load-card, @/components/dispatch/load-details-dialog, @/components/dispatch/load-form, @/components/ui/badge, @/components/ui/button, @/components/ui/card, @/components/ui/dialog, @/components/ui/input, @/components/ui/label, @/components/ui/select, @/components/ui/tabs, @/lib/actions/loadActions
- FleetFusion-Main/components/dispatch/dispatch-skeleton.tsx
  - Imports: @/components/ui/skeleton, @/components/ui/card
- FleetFusion-Main/components/dispatch/load-card.tsx
  - Imports: lucide-react, @prisma/client, @/types/dispatch, @/components/ui/card, @/components/ui/badge, @/components/ui/button, @/lib/utils/utils
- FleetFusion-Main/components/dispatch/load-details-dialog.tsx
  - Imports: @prisma/client, lucide-react, next/link, react, @/components/ui/badge, @/components/ui/button, @/components/ui/card, @/components/ui/dialog, @/components/ui/label, @/components/ui/select, @/components/ui/tabs, @/lib/utils/utils, @/types/dispatch
- FleetFusion-Main/components/dispatch/load-form.tsx
  - Imports: react, next/navigation, @/components/ui/button, @/components/ui/card, @/components/ui/input, @/components/ui/label, @/components/ui/textarea, @/components/ui/select, @/components/ui/tabs, @/hooks/use-toast, @/lib/actions/loadActions, @/components/shared/AddressFields, @/components/shared/ContactFields

#### FleetFusion-Main/components/drivers

- FleetFusion-Main/components/drivers/current-load-card.tsx
  - Imports: react, @/components/ui/card, @/components/ui/badge, @/components/ui/button, lucide-react
- FleetFusion-Main/components/drivers/document-status-card.tsx
  - Imports: react, @/components/ui/card, @/components/ui/badge, @/components/ui/button
- FleetFusion-Main/components/drivers/driver-card.tsx
  - Imports: lucide-react, @/components/ui/card, @/components/ui/badge, @/components/ui/avatar, @/lib/utils/utils, @/types/drivers
- FleetFusion-Main/components/drivers/drivers-skeleton.tsx
  - Imports: @/components/ui/skeleton, @/components/ui/card
- FleetFusion-Main/components/drivers/drivers-list-header.tsx
  - Imports: next/link, next/navigation, ../ui/button, lucide-react
- FleetFusion-Main/components/drivers/hos-status-cards.tsx
  - Imports: react, @/components/ui/card, @/components/ui/badge, lucide-react
- FleetFusion-Main/components/drivers/performance-card.tsx
  - Imports: react, @/components/ui/card, @/components/ui/button
- FleetFusion-Main/components/drivers/recent-activity-card.tsx
  - Imports: react, @/components/ui/card, @/components/ui/button
- FleetFusion-Main/components/drivers/upcoming-loads-card.tsx
  - Imports: react, @/components/ui/card, @/components/ui/button

#### FleetFusion-Main/components/ifta

- FleetFusion-Main/components/ifta/ifta-columns.tsx
  - Imports: @tanstack/react-table, @/components/ui/button
- FleetFusion-Main/components/ifta/ifta-dashboard.tsx
  - Imports: lucide-react, next/navigation, react, @/components/ui/button, @/components/ui/card, @/components/ui/select, @/components/ui/tabs, @/types/ifta, @/components/ui/container, @/components/ui/page-header
- FleetFusion-Main/components/ifta/ifta-tables.tsx
  - Imports: @/components/ui/data-table, @/components/ifta/ifta-columns
- FleetFusion-Main/components/ifta/TaxRateManager.tsx
  - Imports: @/lib/fetchers/iftaFetchers, ./TaxRateManagerClient
- FleetFusion-Main/components/ifta/TaxRateManagerClient.tsx
  - Imports: react, @/components/ui/button, @/components/ui/input

#### FleetFusion-Main/components/navigation

- FleetFusion-Main/components/navigation/MainNav.tsx
  - Imports: react, next/link, lucide-react, @clerk/nextjs, @/lib/utils/utils, @/components/auth/context, @/types/abac
- FleetFusion-Main/components/navigation/MobileNav.tsx
  - Imports: react, next/link, lucide-react, @/components/ui/button, @/components/ui/sheet
- FleetFusion-Main/components/navigation/PublicNav.tsx
  - Imports: next/link, lucide-react, @/components/ui/button
- FleetFusion-Main/components/navigation/TopNavBar.tsx
  - Imports: lucide-react, next/link, @/components/shared/NotificationCenter, @/components/ui/avatar, @/components/ui/button, @/components/ui/badge, @/components/ui/dropdown-menu

#### FleetFusion-Main/components/onboarding

- FleetFusion-Main/components/onboarding/CompanySetupStep.tsx
  - Imports: react, @/components/ui/input, @/components/ui/label, @/components/ui/button, lucide-react, @/features/onboarding/OnboardingStepper
- FleetFusion-Main/components/onboarding/EmployeeJoinStep.tsx
  - Imports: react, @/components/ui/input, @/components/ui/label, @/components/ui/button, @/components/ui/alert, lucide-react, @/features/onboarding/OnboardingStepper
- FleetFusion-Main/components/onboarding/PersonalInfoStep.tsx
  - Imports: react, @/components/ui/input, @/components/ui/label, @/components/ui/button, lucide-react, @/features/onboarding/OnboardingStepper
- FleetFusion-Main/components/onboarding/ReviewSubmitStep.tsx
  - Imports: @/components/ui/badge, @/components/ui/button, @/components/ui/card, lucide-react, @/features/onboarding/OnboardingStepper
- FleetFusion-Main/components/onboarding/RoleSelectionStep.tsx
  - Imports: @/components/ui/button, @/components/ui/label, @/components/ui/select, @/types/abac, lucide-react, react, @/features/onboarding/OnboardingStepper

#### FleetFusion-Main/components/pricing

- FleetFusion-Main/components/pricing/pricing-section.tsx
  - Imports: next/link, react, next/image, @/components/ui/button

#### FleetFusion-Main/components/settings

- FleetFusion-Main/components/settings/billing-settings.tsx
  - Imports: react, @/components/ui/button, @/components/ui/input, @/components/ui/label, @/lib/actions/settingsActions, @/types/settings
- FleetFusion-Main/components/settings/company-settings.tsx
  - Imports: react, lucide-react, @/components/ui/button, @/components/ui/input, @/components/ui/label, @/components/ui/select, @/components/ui/separator
- FleetFusion-Main/components/settings/CompanyProfileForm.tsx
  - Imports: react, zod, @/schemas/settings, @/types/settings
- FleetFusion-Main/components/settings/notification-settings.tsx
  - Imports: react, @/components/ui/button, @/components/ui/switch, @/components/ui/label, @/components/ui/separator, @/components/ui/input, @/components/ui/tabs
- FleetFusion-Main/components/settings/integration-settings.tsx
  - Imports: react, next/image, lucide-react, @/components/ui/button, @/components/ui/card, @/components/ui/switch, @/components/ui/badge
- FleetFusion-Main/components/settings/settings-dashboard.tsx
  - Imports: lucide-react, react, @/components/ui/badge, @/components/ui/button, @/components/ui/card, @/components/ui/separator, @/components/ui/tabs, ./billing-settings, ./company-settings, ./integration-settings, ./notification-settings, ./user-settings, @/types/settings
- FleetFusion-Main/components/settings/user-settings.tsx
  - Imports: @clerk/nextjs, lucide-react, react, @/components/ui/badge, @/components/ui/button, @/components/ui/checkbox, @/components/ui/dialog, @/components/ui/dropdown-menu, @/components/ui/input, @/components/ui/label, @/components/ui/select, @/components/ui/table, @/components/ui/tabs, @/hooks/use-toast, @/lib/actions/invitationActions, @/types/abac

#### FleetFusion-Main/components/shared

- FleetFusion-Main/components/shared/AddressFields.tsx
  - Imports: react, @/components/ui/input, @/components/ui/label
- FleetFusion-Main/components/shared/DocumentUpload.tsx
  - Imports: lucide-react, react, @/components/ui/button
- FleetFusion-Main/components/shared/ContactFields.tsx
  - Imports: react, @/components/ui/input, @/components/ui/label
- FleetFusion-Main/components/shared/ErrorBoundary.tsx
  - Imports: react
- FleetFusion-Main/components/shared/GlobalSearchBar.tsx
  - Imports: react, next/link, lucide-react, @/components/ui/input, @/lib/actions/searchActions, @/types/search, @/components/auth/context
- FleetFusion-Main/components/shared/LoadingSpinner.tsx
  - Imports: @/lib/utils/utils
- FleetFusion-Main/components/shared/NotificationCenter.tsx
  - Imports: react, lucide-react, @/components/ui/button, @/components/ui/badge, @/components/ui/dropdown-menu, @/lib/actions/notificationActions, @/types/notifications, @/components/auth/context
- FleetFusion-Main/components/shared/OptimizedImage.tsx
  - Imports: next/image, @/lib/utils/utils, react
- FleetFusion-Main/components/shared/RedirectMessage.tsx
  - Imports: react, next/image, @/components/shared/LoadingSpinner, next/link, lucide-react
- FleetFusion-Main/components/shared/SharedFooter.tsx
  - Imports: next/link
- FleetFusion-Main/components/shared/ThemeProvider.tsx
  - Imports: react, next-themes

#### FleetFusion-Main/components/ui

- FleetFusion-Main/components/ui/accordion.tsx
  - Imports: react, @radix-ui/react-accordion, lucide-react, @/lib/utils/utils
- FleetFusion-Main/components/ui/alert-dialog.tsx
  - Imports: react, @radix-ui/react-alert-dialog, @/lib/utils/utils, @/components/ui/button
- FleetFusion-Main/components/ui/alert.tsx
  - Imports: react, class-variance-authority, @/lib/utils/utils
- FleetFusion-Main/components/ui/aspect-ratio.tsx
  - Imports: @radix-ui/react-aspect-ratio
- FleetFusion-Main/components/ui/avatar.tsx
  - Imports: react, @radix-ui/react-avatar, @/lib/utils/utils
- FleetFusion-Main/components/ui/badge.tsx
  - Imports: react, class-variance-authority, @/lib/utils/utils
- FleetFusion-Main/components/ui/breadcrumb.tsx
  - Imports: react, @radix-ui/react-slot, lucide-react, @/lib/utils/utils
- FleetFusion-Main/components/ui/button.tsx
  - Imports: react, @radix-ui/react-slot, class-variance-authority, @/lib/utils/utils
- FleetFusion-Main/components/ui/calendar.tsx
  - Imports: react, react-datepicker, @/lib/utils/utils
- FleetFusion-Main/components/ui/card.tsx
  - Imports: react, @/lib/utils/utils
- FleetFusion-Main/components/ui/carousel.tsx
  - Imports: react, embla-carousel-react, lucide-react, @/lib/utils/utils, @/components/ui/button
- FleetFusion-Main/components/ui/chart.tsx
  - Imports: react, recharts, @/lib/utils/utils
- FleetFusion-Main/components/ui/checkbox.tsx
  - Imports: react, @radix-ui/react-checkbox, lucide-react, @/lib/utils/utils
- FleetFusion-Main/components/ui/collapsible.tsx
  - Imports: @radix-ui/react-collapsible
- FleetFusion-Main/components/ui/command.tsx
  - Imports: react, @radix-ui/react-dialog, cmdk, lucide-react, @/lib/utils/utils, @/components/ui/dialog
- FleetFusion-Main/components/ui/container.tsx
  - Imports: react
- FleetFusion-Main/components/ui/data-table.tsx
  - Imports: @tanstack/react-table, @/components/ui/table
- FleetFusion-Main/components/ui/context-menu.tsx
  - Imports: react, @radix-ui/react-context-menu, lucide-react, @/lib/utils/utils
- FleetFusion-Main/components/ui/dialog.tsx
  - Imports: react, @radix-ui/react-dialog, lucide-react, @/lib/utils/utils
- FleetFusion-Main/components/ui/drawer.tsx
  - Imports: react, vaul, @/lib/utils/utils
- FleetFusion-Main/components/ui/dropdown-menu.tsx
  - Imports: react, @radix-ui/react-dropdown-menu, lucide-react, @/lib/utils/utils
- FleetFusion-Main/components/ui/form.tsx
  - Imports: react, @radix-ui/react-label, @radix-ui/react-slot, react-hook-form, @/lib/utils/utils, @/components/ui/label
- FleetFusion-Main/components/ui/hover-card.tsx
  - Imports: react, @radix-ui/react-hover-card, @/lib/utils/utils
- FleetFusion-Main/components/ui/input-otp.tsx
  - Imports: input-otp, lucide-react, react, @/lib/utils/utils
  - Used by: FleetFusion-Main/components/ui/input-otp.tsx
- FleetFusion-Main/components/ui/input.tsx
  - Imports: react, @/lib/utils/utils
- FleetFusion-Main/components/ui/label.tsx
  - Imports: react, @radix-ui/react-label, class-variance-authority, @/lib/utils/utils
- FleetFusion-Main/components/ui/loading-spinner.tsx
- FleetFusion-Main/components/ui/menubar.tsx
  - Imports: react, @radix-ui/react-menubar, lucide-react, @/lib/utils/utils
- FleetFusion-Main/components/ui/mobile-table.tsx
  - Imports: react, @/components/ui/card, @/components/ui/button, @/components/ui/sheet, @/components/ui/badge, lucide-react, @/hooks/use-mobile
- FleetFusion-Main/components/ui/navigation-menu.tsx
  - Imports: react, @radix-ui/react-navigation-menu, class-variance-authority, lucide-react, @/lib/utils/utils
- FleetFusion-Main/components/ui/page-header.tsx
  - Imports: react
- FleetFusion-Main/components/ui/popover.tsx
  - Imports: react, @radix-ui/react-popover, @/lib/utils/utils
- FleetFusion-Main/components/ui/progress.tsx
  - Imports: react, @radix-ui/react-progress, @/lib/utils/utils
- FleetFusion-Main/components/ui/radio-group.tsx
  - Imports: react, @radix-ui/react-radio-group, lucide-react, @/lib/utils/utils
- FleetFusion-Main/components/ui/resizable.tsx
  - Imports: lucide-react, react-resizable-panels, @/lib/utils/utils
- FleetFusion-Main/components/ui/responsive-layout.tsx
  - Imports: react, @/lib/utils/utils, @/hooks/use-mobile
- FleetFusion-Main/components/ui/scroll-area.tsx
  - Imports: react, @radix-ui/react-scroll-area, @/lib/utils/utils
- FleetFusion-Main/components/ui/select.tsx
  - Imports: react, @radix-ui/react-select, lucide-react, @/lib/utils/utils
- FleetFusion-Main/components/ui/separator.tsx
  - Imports: react, @radix-ui/react-separator, @/lib/utils/utils
- FleetFusion-Main/components/ui/sheet.tsx
  - Imports: react, @radix-ui/react-dialog, class-variance-authority, lucide-react, @/lib/utils/utils
- FleetFusion-Main/components/ui/sidebar.tsx
  - Imports: react, @radix-ui/react-slot, class-variance-authority, lucide-react, @/hooks/use-mobile, @/lib/utils/utils, @/components/ui/button, @/components/ui/input, @/components/ui/separator, @/components/ui/sheet, @/components/ui/skeleton, @/components/ui/tooltip
- FleetFusion-Main/components/ui/skeleton.tsx
  - Imports: @/lib/utils/utils
- FleetFusion-Main/components/ui/slider.tsx
  - Imports: react, @radix-ui/react-slider, @/lib/utils/utils
- FleetFusion-Main/components/ui/sonner.tsx
  - Imports: next-themes, sonner
  - Used by: FleetFusion-Main/components/ui/sonner.tsx
- FleetFusion-Main/components/ui/switch.tsx
  - Imports: react, @radix-ui/react-switch, @/lib/utils/utils
- FleetFusion-Main/components/ui/table.tsx
  - Imports: react, @/lib/utils/utils
- FleetFusion-Main/components/ui/tabs.tsx
  - Imports: react, @radix-ui/react-tabs, @/lib/utils/utils
- FleetFusion-Main/components/ui/textarea.tsx
  - Imports: react, @/lib/utils/utils
- FleetFusion-Main/components/ui/toast.tsx
  - Imports: react, @radix-ui/react-toast, class-variance-authority, lucide-react, @/lib/utils/utils
- FleetFusion-Main/components/ui/toaster.tsx
  - Imports: @/hooks/use-toast, @/components/ui/toast
- FleetFusion-Main/components/ui/toggle.tsx
  - Imports: react, @radix-ui/react-toggle, class-variance-authority, @/lib/utils/utils
- FleetFusion-Main/components/ui/tooltip.tsx
  - Imports: react, @radix-ui/react-tooltip, @/lib/utils/utils
- FleetFusion-Main/components/ui/toggle-group.tsx
  - Imports: react, @radix-ui/react-toggle-group, class-variance-authority, @/lib/utils/utils, @/components/ui/toggle

#### FleetFusion-Main/components/vehicles

- FleetFusion-Main/components/vehicles/add-vehicle-dialog.tsx
  - Imports: react, @/components/ui/button, @/components/ui/dialog, @/components/ui/input, @/components/ui/label, @/components/ui/select, @/types/vehicles, @/lib/actions/vehicleActions
- FleetFusion-Main/components/vehicles/vehicle-card.tsx
  - Imports: lucide-react, @/components/ui/card, @/components/ui/badge, @/lib/utils/utils
- FleetFusion-Main/components/vehicles/vehicle-details-dialog.tsx
  - Imports: react, next/link, lucide-react, @/components/ui/dialog, @/components/ui/button, @/components/ui/badge, @/components/ui/tabs, @/components/ui/card, @/components/ui/label, @/lib/utils/utils, @/lib/actions/vehicleActions, @/hooks/use-toast, @/types/vehicles
- FleetFusion-Main/components/vehicles/vehicle-form.tsx
  - Imports: react, @/types/vehicles, @/components/ui/input, @/components/ui/label, @/components/ui/select, @/components/ui/textarea, @/components/ui/card, @/components/ui/tabs
- FleetFusion-Main/components/vehicles/vehicle-list-client.tsx
  - Imports: react, lucide-react, @/types/vehicles, @/components/ui/input, @/components/ui/button, @/components/vehicles/vehicle-card, @/components/vehicles/vehicle-details-dialog, ../../components/vehicles/add-vehicle-dialog
- FleetFusion-Main/components/vehicles/vehicle-table.tsx
  - Imports: react, @/types/vehicles, @/components/ui/table, @/components/ui/badge, @/components/ui/button, @/components/ui/input, @/components/ui/select, @/components/ui/card, lucide-react, next/link

#### FleetFusion-Main/config

- FleetFusion-Main/config/pdf.ts
  - Imports: path

#### FleetFusion-Main/features/analytics

- FleetFusion-Main/features/analytics/dashboard-metrics.tsx
  - Imports: lucide-react, react, @/components/ui/card, @/lib/fetchers/analyticsFetchers, @/types/analytics
- FleetFusion-Main/features/analytics/MainDashboardFeature.tsx
  - Imports: @/components/ui/card, @/lib/fetchers/analyticsFetchers
- FleetFusion-Main/features/analytics/performance-metrics.tsx
  - Imports: recharts, @/components/ui/chart, @/types/analytics

#### FleetFusion-Main/features/auth

- FleetFusion-Main/features/auth/index.ts

#### FleetFusion-Main/features/compliance

- FleetFusion-Main/features/compliance/ComplianceDashboard.tsx
  - Imports: @/components/ui/card, @/lib/fetchers/complianceFetchers

#### FleetFusion-Main/features/dashboard

- FleetFusion-Main/features/dashboard/AdminOverview.tsx
  - Imports: react, @/components/dashboard/organization-stats, @/components/dashboard/dashboard-skeleton
- FleetFusion-Main/features/dashboard/AuditLogViewer.tsx
  - Imports: react, @/components/ui/card, @/components/dashboard/audit-log-table, @/components/dashboard/audit-log-filters, @/lib/actions/auditLogActions, @/types/dashboard
- FleetFusion-Main/features/dashboard/BillingManagement.tsx
  - Imports: react, @/components/dashboard/billing-plan-overview, @/components/dashboard/dashboard-skeleton, @/components/ui/card, @/components/ui/separator, @/components/ui/progress, @/components/ui/alert, lucide-react, @/components/ui/button, @/components/navigation/MainNav, @/lib/utils/utils, @/types/dashboard
- FleetFusion-Main/features/dashboard/SystemHealth.tsx
  - Imports: react, @/components/ui/button, @/components/ui/badge, @/components/ui/card, lucide-react, @/components/dashboard/system-overview-cards, @/components/dashboard/resource-usage-cards, @/components/dashboard/system-health-checks, @/lib/actions/dashboardActions
- FleetFusion-Main/features/dashboard/UserManagementDashboard.tsx
  - Imports: @/components/dashboard/bulk-user-actions, @/components/dashboard/user-table, @/types/dashboard, react

#### FleetFusion-Main/features/dispatch

- FleetFusion-Main/features/dispatch/DispatchBoardFeature.tsx
  - Imports: react, @/components/dispatch/dispatch-board, @/lib/fetchers/dispatchFetchers, @/types/dispatch, @prisma/client
- FleetFusion-Main/features/dispatch/recent-activity.tsx
  - Imports: lucide-react, @/lib/fetchers/dispatchFetchers

#### FleetFusion-Main/features/drivers

- FleetFusion-Main/features/drivers/AssignmentDialogButton.tsx
  - Imports: react, @/components/ui/button, @/features/drivers/DriverAssignmentDialog
- FleetFusion-Main/features/drivers/AssignmentDialogWrapper.tsx
  - Imports: @/features/drivers/AssignmentDialogButton
- FleetFusion-Main/features/drivers/DriverAssignmentDialog.tsx
  - Imports: react, zod, @/components/ui/dialog, @/components/ui/button, @/components/ui/input, @/lib/actions/driverActions, @/hooks/use-toast, @/schemas/drivers
- FleetFusion-Main/features/drivers/DriverDetailsDialog.tsx
  - Imports: react, lucide-react, next/link, @/components/ui/dialog, @/components/ui/button, @/components/ui/badge, @/components/ui/tabs, @/components/ui/card, @/components/ui/avatar, @/lib/utils/utils, @/components/shared/DocumentUpload, @/lib/actions/driverActions, @/hooks/use-toast
- FleetFusion-Main/features/drivers/DriverForm.tsx
  - Imports: react, react-hook-form, @/components/ui/button, @/components/ui/input, @/components/ui/textarea, @/components/ui/label, @/components/ui/card, lucide-react
- FleetFusion-Main/features/drivers/DriverFormFeature.tsx
  - Imports: @/features/drivers/DriverForm, @/lib/actions/driverActions
- FleetFusion-Main/features/drivers/DriversList.tsx
  - Imports: @/lib/fetchers/driverFetchers, ./DriversListClient
- FleetFusion-Main/features/drivers/DriversListClient.tsx
  - Imports: react, @/components/drivers/driver-card, @/components/ui/tabs, @/components/ui/badge, @/types/drivers, lucide-react, @/components/ui/button, @/components/ui/input, @/features/drivers/DriverDetailsDialog

#### FleetFusion-Main/features/ifta

- FleetFusion-Main/features/ifta/IftaReportingFeature.tsx
  - Imports: @/components/ifta/ifta-dashboard

#### FleetFusion-Main/features/onboarding

- FleetFusion-Main/features/onboarding/OnboardingStepper.tsx
  - Imports: @/components/ui/progress, @/hooks/use-toast, @clerk/nextjs, lucide-react, next/navigation, react, @/components/onboarding/CompanySetupStep, @/components/onboarding/EmployeeJoinStep, @/components/onboarding/PersonalInfoStep, @/components/onboarding/ReviewSubmitStep, @/components/onboarding/RoleSelectionStep, @/lib/actions/onboardingActions, @/schemas/onboarding, @/types/abac

#### FleetFusion-Main/features/settings/**tests**

- FleetFusion-Main/features/settings/**tests**/CompanySettingsPage.test.tsx
  - Imports: react, @testing-library/dom, @testing-library/react, vitest, ../CompanySettingsPage

#### FleetFusion-Main/features/settings

- FleetFusion-Main/features/settings/CompanySettingsPage.tsx
  - Imports: @/lib/fetchers/settingsFetchers, @/components/settings/CompanyProfileForm, @/lib/actions/settingsActions
- FleetFusion-Main/features/settings/UserSettingsPage.tsx
  - Imports: react

#### FleetFusion-Main/features/vehicles

- FleetFusion-Main/features/vehicles/add-vehicle-dialog.tsx
  - Imports: react, @/components/ui/button, @/components/ui/dialog, @/components/ui/input, @/components/ui/label, @/components/ui/select, @/types/vehicles, @/lib/actions/vehicleActions, @/hooks/use-toast
- FleetFusion-Main/features/vehicles/edit-vehicle-dialog.tsx
  - Imports: react, @/types/vehicles, @/lib/actions/vehicleActions, @/components/ui/dialog, @/components/ui/input, @/components/ui/label, @/components/ui/select, @/components/ui/button, @/hooks/use-toast
- FleetFusion-Main/features/vehicles/VehicleListPage.tsx
  - Imports: react, @/lib/fetchers/vehicleFetchers, @/components/vehicles/vehicle-list-client

#### FleetFusion-Main/hooks

- FleetFusion-Main/hooks/use-dispatch-realtime.ts
  - Imports: react, next/navigation, @/types/dispatch
- FleetFusion-Main/hooks/use-mobile.tsx
  - Imports: react
- FleetFusion-Main/hooks/use-toast.ts
  - Imports: react, @/components/ui/toast
- FleetFusion-Main/hooks/useDashboardPreferences.ts
  - Imports: react, @/types/dashboard

#### FleetFusion-Main/lib/actions

- FleetFusion-Main/lib/actions/analyticsActions.ts
  - Imports: @clerk/nextjs/server, @/lib/auth/auth, @/lib/database/db, @/lib/auth/permissions, @/lib/errors/handleError, @/types/actions
- FleetFusion-Main/lib/actions/analyticsReportActions.ts
  - Imports: @clerk/nextjs/server, pdf-lib, @/lib/fetchers/analyticsFetchers, @/lib/errors/handleError, @/schemas/analytics
- FleetFusion-Main/lib/actions/auditActions.ts
  - Imports: @clerk/nextjs/server, @/lib/database/db, @/lib/errors/handleError
- FleetFusion-Main/lib/actions/auditLogActions.ts
  - Imports: zod, ../database/db, @/schemas/auditLogSchema
- FleetFusion-Main/lib/actions/authActions.ts
- FleetFusion-Main/lib/actions/complianceActions.ts
  - Imports: zod, @/lib/auth/auth, @/lib/errors/handleError, @/schemas/compliance, ../database/db, ./auditLogActions
- FleetFusion-Main/lib/actions/complianceMonitoring.ts
  - Imports: @/lib/auth/auth, @/lib/database/db, @/lib/errors/handleError, date-fns, zod
- FleetFusion-Main/lib/actions/complianceReportActions.ts
  - Imports: zod, @/lib/auth/auth, @/lib/errors/handleError, @/lib/database/db, @/schemas/compliance
- FleetFusion-Main/lib/actions/dashboardActions.ts
  - Imports: @/schemas/dashboard, @/types/dashboard, @clerk/nextjs/server, next/cache, @/lib/database/db, @/lib/errors/handleError, @/lib/fetchers/dashboardFetchers
- FleetFusion-Main/lib/actions/dispatchActions.ts
- FleetFusion-Main/lib/actions/driverActions.ts
  - Imports: @clerk/nextjs/server, next/cache, zod, @/lib/errors/handleError, @/types/drivers, @/lib/database/db, @/lib/actions/auditActions, @/schemas/drivers
- FleetFusion-Main/lib/actions/fileUploadActions.ts
  - Imports: zod, @vercel/blob/client, @/lib/auth/auth, @/lib/errors/handleError, ../database/db
- FleetFusion-Main/lib/actions/inspectionActions.ts
  - Imports: @/lib/auth/auth, @/lib/database/db, @/lib/errors/handleError, zod
- FleetFusion-Main/lib/actions/invitationActions.ts
  - Imports: @/lib/errors/handleError, @/schemas/dashboard, @clerk/nextjs/server, next/cache
- FleetFusion-Main/lib/actions/loadActions.ts
  - Imports: @clerk/nextjs/server, next/cache, @prisma/client, @/lib/database/db, @/lib/errors/handleError, @/schemas/dispatch
- FleetFusion-Main/lib/actions/notificationActions.ts
  - Imports: @/types/notifications, @/lib/fetchers/notificationFetchers, @/lib/errors/handleError, @clerk/nextjs/server, ../database/db
- FleetFusion-Main/lib/actions/onboardingActions.ts
  - Imports: next/navigation, next/cache, @clerk/nextjs/server, @/types/onboarding, @/schemas/onboarding, @/types/abac, @/lib/database/db, ../utils/slugUtils
- FleetFusion-Main/lib/actions/regulatoryAuditActions.ts
  - Imports: @/lib/errors/handleError, @/schemas/regulatory, @clerk/nextjs/server, next/cache, ../compliance/regulatoryEngine
- FleetFusion-Main/lib/actions/searchActions.ts
  - Imports: @/types/search, @/lib/fetchers/searchFetchers, zod, @/lib/auth/auth, @/lib/errors/handleError
- FleetFusion-Main/lib/actions/settingsActions.ts
  - Imports: @clerk/nextjs/server, next/cache, @/lib/database/db, @prisma/client, @/schemas/settings
- FleetFusion-Main/lib/actions/userActions.ts
  - Imports: @/lib/database/db, @/lib/errors/handleError
- FleetFusion-Main/lib/actions/vehicleActions.ts
  - Imports: next/cache, @clerk/nextjs/server, @/lib/database/db, @/lib/errors/handleError, @/lib/auth/permissions, @/schemas/vehicles, @/types/vehicles, @prisma/client/runtime/library

#### FleetFusion-Main/lib/admin

- FleetFusion-Main/lib/admin/logging.ts
  - Imports: @/lib/actions/auditActions

#### FleetFusion-Main/lib/auth

- FleetFusion-Main/lib/auth/auth.ts
  - Imports: @clerk/nextjs/server, next/navigation, @/lib/database/db, @/types/auth
- FleetFusion-Main/lib/auth/permissions.ts
  - Imports: @/types/abac, @/types/auth
- FleetFusion-Main/lib/auth/secure-session-management.ts
  - Imports: @/types/auth
- FleetFusion-Main/lib/auth/session-claims-utils.ts
  - Imports: @/types/abac, @/types/globals
- FleetFusion-Main/lib/auth/utils.ts
  - Imports: @clerk/nextjs/server, @/lib/database/db, @/types/abac

#### FleetFusion-Main/lib/cache

- FleetFusion-Main/lib/cache/auth-cache.ts
  - Imports: @/types/auth
- FleetFusion-Main/lib/cache/redis.ts
  - Imports: @upstash/redis

#### FleetFusion-Main/lib/compliance

- FleetFusion-Main/lib/compliance/regulatoryEngine.ts
  - Imports: @/lib/fetchers/iftaFetchers, @/lib/fetchers/complianceFetchers, @/lib/actions/auditLogActions

#### FleetFusion-Main/lib/config

- FleetFusion-Main/lib/config/environment.ts

#### FleetFusion-Main/lib/database

- FleetFusion-Main/lib/database/db.ts
  - Imports: @prisma/adapter-neon, @prisma/client, @prisma/client/runtime/library, crypto

#### FleetFusion-Main/lib/errors

- FleetFusion-Main/lib/errors/handleError.ts

#### FleetFusion-Main/lib/fetchers

- FleetFusion-Main/lib/fetchers/analyticsFetchers.ts
  - Imports: @clerk/nextjs/server, @/lib/cache/auth-cache, @/lib/database/db, @/types/analytics, next/cache
- FleetFusion-Main/lib/fetchers/authFetchers.ts
- FleetFusion-Main/lib/fetchers/complianceFetchers.ts
  - Imports: @clerk/nextjs/server, zod, @/lib/auth/permissions, @/lib/utils/hos, @/schemas/compliance, @/types/auth, next/cache, @/lib/cache/auth-cache, @/lib/database/db, @/lib/errors/handleError, @/types/compliance
- FleetFusion-Main/lib/fetchers/dashboardFetchers.ts
  - Imports: @/lib/database/db, @/types/dashboard, @clerk/nextjs/server, next/cache, @/lib/auth/utils, @/lib/cache/auth-cache
- FleetFusion-Main/lib/fetchers/dispatchFetchers.ts
  - Imports: @clerk/nextjs/server, next/cache, @/lib/database/db, @/schemas/dispatch, @/types/dispatch
- FleetFusion-Main/lib/fetchers/driverFetchers.ts
  - Imports: @clerk/nextjs/server, @/lib/database/db, @/types/drivers
- FleetFusion-Main/lib/fetchers/iftaFetchers.ts
  - Imports: @clerk/nextjs/server, @/lib/cache/auth-cache, @/lib/database/db, @/types/ifta
- FleetFusion-Main/lib/fetchers/onboardingFetchers.ts
  - Imports: @/lib/database/db, @/types/onboarding, ./../../types/abac
- FleetFusion-Main/lib/fetchers/notificationFetchers.ts
  - Imports: @/types/notifications, @clerk/nextjs/server
- FleetFusion-Main/lib/fetchers/searchFetchers.ts
  - Imports: @clerk/nextjs/server, @/lib/database/db, @/types/search
- FleetFusion-Main/lib/fetchers/settingsFetchers.ts
  - Imports: @clerk/nextjs/server, @/lib/database/db, @/types/settings
- FleetFusion-Main/lib/fetchers/userFetchers.ts
  - Imports: @/lib/database/db, @/types/auth
- FleetFusion-Main/lib/fetchers/vehicleFetchers.ts
  - Imports: @clerk/nextjs/server, react, @/lib/database/db, @/schemas/vehicles, @/types/vehicles

#### FleetFusion-Main/lib/pdf

- FleetFusion-Main/lib/pdf/ifta-pdf-service.ts
  - Imports: pdf-lib, fs/promises, fs, path, @/types/ifta
- FleetFusion-Main/lib/pdf/ifta-pdf-templates.tsx
- FleetFusion-Main/lib/pdf/pdf-utils.ts
  - Imports: @/types/ifta, pdf-lib

#### FleetFusion-Main/lib/services

- FleetFusion-Main/lib/services/mcp-clerk.ts
- FleetFusion-Main/lib/services/pdfService.ts

#### FleetFusion-Main/lib/utils

- FleetFusion-Main/lib/utils/hos.ts
  - Imports: @/types/compliance
- FleetFusion-Main/lib/utils/ifta.ts
  - Imports: ../../types/ifta
- FleetFusion-Main/lib/utils/mvp-verification.ts
- FleetFusion-Main/lib/utils/prisma-serializer.ts
  - Imports: @prisma/client/runtime/library
- FleetFusion-Main/lib/utils/rate-limit.ts
  - Imports: @/lib/cache/redis, @upstash/ratelimit
- FleetFusion-Main/lib/utils/utils.ts
  - Imports: clsx, tailwind-merge
- FleetFusion-Main/lib/utils/slugUtils.ts

#### FleetFusion-Main/schemas

- FleetFusion-Main/schemas/analytics.ts
  - Imports: zod
- FleetFusion-Main/schemas/auditLogSchema.ts
  - Imports: zod
- FleetFusion-Main/schemas/auth.ts
  - Imports: zod, @/types/abac
- FleetFusion-Main/schemas/compliance.ts
  - Imports: zod, ./shared
- FleetFusion-Main/schemas/dashboard.ts
  - Imports: zod, @/types/abac
- FleetFusion-Main/schemas/dispatch.ts
  - Imports: zod, ./shared, @/types/dispatch
- FleetFusion-Main/schemas/drivers.ts
  - Imports: zod
- FleetFusion-Main/schemas/ifta.ts
  - Imports: zod
- FleetFusion-Main/schemas/onboarding.ts
  - Imports: zod
- FleetFusion-Main/schemas/regulatory.ts
  - Imports: zod
- FleetFusion-Main/schemas/settings.ts
  - Imports: zod
- FleetFusion-Main/schemas/shared.ts
  - Imports: zod
- FleetFusion-Main/schemas/vehicles.ts
  - Imports: zod

#### FleetFusion-Main/types

- FleetFusion-Main/types/abac.ts
- FleetFusion-Main/types/actions.ts
- FleetFusion-Main/types/analytics.ts
- FleetFusion-Main/types/api.ts
  - Imports: ./index, ./dispatch, ./drivers, ./compliance, ./ifta, ./vehicles
- FleetFusion-Main/types/auth.ts
  - Imports: ./abac
- FleetFusion-Main/types/compliance.ts
  - Imports: ./metadata
- FleetFusion-Main/types/dashboard.ts
- FleetFusion-Main/types/dispatch.ts
  - Imports: ./index, ./metadata
- FleetFusion-Main/types/drivers.ts
- FleetFusion-Main/types/globals.d.ts
  - Imports: ./abac
- FleetFusion-Main/types/ifta.ts
- FleetFusion-Main/types/index.ts
  - Imports: @/types/auth
- FleetFusion-Main/types/metadata.ts
- FleetFusion-Main/types/notifications.ts
- FleetFusion-Main/types/onboarding.ts
  - Imports: ./auth
- FleetFusion-Main/types/prisma.d.ts
  - Imports: @prisma/client
- FleetFusion-Main/types/search.ts
- FleetFusion-Main/types/settings.ts
- FleetFusion-Main/types/vehicles.ts
  - Imports: ./auth
- FleetFusion-Main/types/webhooks.ts
  - Imports: ./auth, ./metadata

#### FleetFusion-Main

- FleetFusion-Main/components.json
- FleetFusion-Main/middleware.ts
  - Imports: @clerk/nextjs/server, next/server, @/types/abac
- FleetFusion-Main/next.config.ts
  - Imports: path
- FleetFusion-Main/package.json
- FleetFusion-Main/postcss.config.mjs
- FleetFusion-Main/tailwind.config.ts
  - Imports: tailwindcss, tailwindcss-animate
- FleetFusion-Main/.env.example
- FleetFusion-Main/tsconfig.json

#### FleetFusion-Main/prisma/migrations/20250707061329_initial_schema

- FleetFusion-Main/prisma/migrations/20250707061329_initial_schema/migration.sql

#### FleetFusion-Main/prisma/migrations/20250707065454_add_preferences_field_to_user_model

- FleetFusion-Main/prisma/migrations/20250707065454_add_preferences_field_to_user_model/migration.sql

#### FleetFusion-Main/prisma/migrations/20250707073801_remove_clerk_id_from_user_model

- FleetFusion-Main/prisma/migrations/20250707073801_remove_clerk_id_from_user_model/migration.sql

#### FleetFusion-Main/prisma/migrations

- FleetFusion-Main/prisma/migrations/migration_lock.toml

#### FleetFusion-Main/prisma

- FleetFusion-Main/prisma/schema.prisma
- FleetFusion-Main/prisma/seed.ts
  - Imports: @prisma/client, @prisma/adapter-neon
