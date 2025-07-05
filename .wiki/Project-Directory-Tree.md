FleetFusion
├─ .env
├─ .env.example
├─ .git
├─ .gitignore
├─ .prettierrc
├─ .wiki
│  ├─ API-Documentation.md
│  ├─ API-Reference.md
│  ├─ Architecture.md
│  ├─ Authentication.md
│  ├─ Changelog.md
│  ├─ Component-Library.md
│  ├─ Contributing.md
│  ├─ Dashboard-Guide.md
│  ├─ Database.md
│  ├─ Deployment.md
│  ├─ Design-System.md
│  ├─ Domains.md
│  ├─ drivers-testing.md
│  ├─ Environment.md
│  ├─ Getting-Started.md
│  ├─ Home.md
│  ├─ Monitoring.md
│  ├─ Security.md
│  ├─ Testing-Prompts.md
│  ├─ Testing-Strategy.md
│  ├─ Troubleshooting.md
│  ├─ Types.md
│  └─ vehicles-testing.md
├─ AGENTS.md
├─ app
│  ├─ (auth)
│  │  ├─ accept-invitation
│  │  │  └─ page.tsx
│  │  ├─ error.tsx
│  │  ├─ forgot-password
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ loading.tsx
│  │  ├─ onboarding
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ sign-in
│  │  │  └─ [[...sign-in]]
│  │  │     └─ page.tsx
│  │  ├─ sign-out
│  │  │  └─ page.tsx
│  │  └─ sign-up
│  │     └─ [[...sign-up]]
│  │        └─ page.tsx
│  ├─ (funnel)
│  │  ├─ about
│  │  │  └─ page.tsx
│  │  ├─ contact
│  │  │  └─ page.tsx
│  │  ├─ error.tsx
│  │  ├─ features
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ loading.tsx
│  │  ├─ pricing
│  │  │  └─ page.tsx
│  │  ├─ privacy
│  │  │  └─ page.tsx
│  │  ├─ refund
│  │  │  └─ page.tsx
│  │  ├─ services
│  │  │  └─ page.tsx
│  │  └─ terms
│  │     └─ page.tsx
│  ├─ (tenant)
│  │  └─ [orgId]
│  │     ├─ admin
│  │     │  ├─ page.tsx
│  │     │  └─ [userId]
│  │     │     └─ page.tsx
│  │     ├─ analytics
│  │     │  └─ page.tsx
│  │     ├─ compliance
│  │     │  ├─ page.tsx
│  │     │  └─ [userId]
│  │     │     ├─ hos-logs
│  │     │     │  └─ page.tsx
│  │     │     └─ page.tsx
│  │     ├─ dashboard
│  │     │  ├─ page.tsx
│  │     │  └─ [userId]
│  │     │     ├─ layout.tsx
│  │     │     └─ page.tsx
│  │     ├─ dispatch
│  │     │  └─ [userId]
│  │     │     ├─ edit
│  │     │     │  └─ page.tsx
│  │     │     ├─ new
│  │     │     │  └─ page.tsx
│  │     │     └─ page.tsx
│  │     ├─ drivers
│  │     │  ├─ page.tsx
│  │     │  └─ [userId]
│  │     │     └─ page.tsx
│  │     ├─ error.tsx
│  │     ├─ ifta
│  │     │  └─ page.tsx
│  │     ├─ layout.tsx
│  │     ├─ loading.tsx
│  │     ├─ settings
│  │     │  └─ page.tsx
│  │     └─ vehicles
│  │        └─ page.tsx
│  ├─ api
│  │  ├─ analytics
│  │  │  └─ [orgId]
│  │  │     ├─ export
│  │  │     │  └─ route.ts
│  │  │     ├─ schedule
│  │  │     │  └─ route.ts
│  │  │     └─ stream
│  │  │        └─ route.ts
│  │  ├─ clerk
│  │  │  ├─ webhook-handler
│  │  │  │  └─ route.ts
│  │  │  └─ __tests__
│  │  │     └─ webhook-handler.test.ts
│  │  ├─ dispatch
│  │  │  └─ [orgId]
│  │  │     ├─ stream
│  │  │     │  └─ route.ts
│  │  │     └─ updates
│  │  │        └─ route.ts
│  │  ├─ files
│  │  │  ├─ upload
│  │  │  │  └─ route.ts
│  │  │  └─ __tests__
│  │  │     └─ upload.test.ts
│  │  └─ test
│  │     └─ auth
│  │        └─ route.ts
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ mobile
│  │  └─ [orgId]
│  │     ├─ compliance
│  │     │  └─ page.tsx
│  │     └─ layout.tsx
│  └─ page.tsx
├─ components
│  ├─ admin
│  │  ├─ AdminOverview.tsx
│  │  ├─ AuditLogViewer.tsx
│  │  ├─ BillingManagement.tsx
│  │  ├─ BulkUserActions.tsx
│  │  ├─ OrganizationStats.tsx
│  │  ├─ SystemHealth.tsx
│  │  └─ users
│  │     ├─ InviteUserForm.tsx
│  │     ├─ RoleAssignmentModal.tsx
│  │     └─ UserTable.tsx
│  ├─ analytics
│  │  ├─ analytics-dashboard.tsx
│  │  ├─ driver-performance.tsx
│  │  ├─ export-options.tsx
│  │  ├─ financial-metrics.tsx
│  │  ├─ geographic-analysis.tsx
│  │  ├─ interactive-charts.tsx
│  │  ├─ MetricCard.tsx
│  │  ├─ mobile-analytics.tsx
│  │  ├─ realtime-dashboard.tsx
│  │  └─ vehicle-utilization.tsx
│  ├─ auth
│  │  ├─ context.tsx
│  │  └─ protected-route.tsx
│  ├─ compliance
│  │  ├─ compliance-alerts.tsx
│  │  ├─ compliance-dashboard.tsx
│  │  ├─ compliance-documents.tsx
│  │  ├─ DocumentUploadForm.tsx
│  │  ├─ dot-inspection-management.tsx
│  │  ├─ driver-compliance-table.tsx
│  │  ├─ hos-log-viewer.tsx
│  │  └─ vehicle-compliance-table.tsx
│  ├─ dashboard
│  │  ├─ compliance-alerts.tsx
│  │  ├─ dashboard-cards.tsx
│  │  ├─ dashboard-preferences.tsx
│  │  ├─ dashboard-skeleton.tsx
│  │  ├─ fleet-overview-header.tsx
│  │  ├─ kpi-cards.tsx
│  │  ├─ mobile-dashboard-layout.tsx
│  │  ├─ mobile-dashboard.tsx
│  │  ├─ quick-actions-widget.tsx
│  │  ├─ quick-actions.tsx
│  │  ├─ recent-activity.tsx
│  │  ├─ recent-alerts-widget.tsx
│  │  └─ todays-schedule-widget.tsx
│  ├─ dispatch
│  │  ├─ dispatch-board.tsx
│  │  ├─ dispatch-skeleton.tsx
│  │  ├─ load-card.tsx
│  │  ├─ load-details-dialog.tsx
│  │  └─ load-form.tsx
│  ├─ drivers
│  │  ├─ driver-card.tsx
│  │  ├─ driver-details-dialog.tsx
│  │  └─ DriverForm.tsx
│  ├─ ifta
│  │  ├─ ifta-columns.tsx
│  │  ├─ ifta-dashboard.tsx
│  │  ├─ ifta-report-table.tsx
│  │  ├─ ifta-tables.tsx
│  │  ├─ ifta-trip-table.tsx
│  │  ├─ IftaReportForm.tsx
│  │  ├─ TaxRateManager.tsx
│  │  └─ TaxRateManagerClient.tsx
│  ├─ onboarding
│  │  ├─ CompanySetupForm.tsx
│  │  ├─ OnboardingStepper.tsx
│  │  ├─ PreferencesForm.tsx
│  │  ├─ ProfileSetupForm.tsx
│  │  └─ steps
│  │     ├─ CompanySetupStep.tsx
│  │     ├─ EmployeeJoinStep.tsx
│  │     ├─ PersonalInfoStep.tsx
│  │     ├─ ReviewSubmitStep.tsx
│  │     └─ RoleSelectionStep.tsx
│  ├─ pricing
│  │  └─ pricing-section.tsx
│  ├─ settings
│  │  ├─ billing-settings.tsx
│  │  ├─ company-settings.tsx
│  │  ├─ CompanyProfileForm.tsx
│  │  ├─ integration-settings.tsx
│  │  ├─ notification-settings.tsx
│  │  ├─ settings-dashboard.tsx
│  │  └─ user-settings.tsx
│  ├─ shared
│  │  ├─ AddressFields.tsx
│  │  ├─ ContactFields.tsx
│  │  ├─ DocumentUpload.tsx
│  │  ├─ ErrorBoundary.tsx
│  │  ├─ GlobalSearchBar.tsx
│  │  ├─ loading-spinner.tsx
│  │  ├─ LoadingSpinner.tsx
│  │  ├─ MainNav.tsx
│  │  ├─ MobileNav.tsx
│  │  ├─ navigation
│  │  │  └─ nav-links.ts
│  │  ├─ NotificationCenter.tsx
│  │  ├─ optimized-image.tsx
│  │  ├─ PageHeader.tsx
│  │  ├─ PublicNav.tsx
│  │  ├─ RedirectMessage.tsx
│  │  ├─ SharedFooter.tsx
│  │  ├─ sidebar
│  │  │  └─ SidebarNav.tsx
│  │  ├─ ThemeProvider.tsx
│  │  ├─ TopNavBar.tsx
│  │  └─ UserNav.tsx
│  ├─ ui
│  │  ├─ accordion.tsx
│  │  ├─ alert-dialog.tsx
│  │  ├─ alert.tsx
│  │  ├─ aspect-ratio.tsx
│  │  ├─ avatar.tsx
│  │  ├─ badge.tsx
│  │  ├─ breadcrumb.tsx
│  │  ├─ button.tsx
│  │  ├─ calendar.tsx
│  │  ├─ card.tsx
│  │  ├─ carousel.tsx
│  │  ├─ chart.tsx
│  │  ├─ checkbox.tsx
│  │  ├─ collapsible.tsx
│  │  ├─ command.tsx
│  │  ├─ context-menu.tsx
│  │  ├─ data-table.tsx
│  │  ├─ dialog.tsx
│  │  ├─ drawer.tsx
│  │  ├─ dropdown-menu.tsx
│  │  ├─ form.tsx
│  │  ├─ hover-card.tsx
│  │  ├─ input-otp.tsx
│  │  ├─ input.tsx
│  │  ├─ label.tsx
│  │  ├─ loading-spinner.tsx
│  │  ├─ menubar.tsx
│  │  ├─ mobile-table.tsx
│  │  ├─ navigation-menu.tsx
│  │  ├─ popover.tsx
│  │  ├─ progress.tsx
│  │  ├─ radio-group.tsx
│  │  ├─ resizable.tsx
│  │  ├─ responsive-layout.tsx
│  │  ├─ scroll-area.tsx
│  │  ├─ select.tsx
│  │  ├─ separator.tsx
│  │  ├─ sheet.tsx
│  │  ├─ sidebar.tsx
│  │  ├─ skeleton.tsx
│  │  ├─ slider.tsx
│  │  ├─ sonner.tsx
│  │  ├─ switch.tsx
│  │  ├─ table.tsx
│  │  ├─ tabs.tsx
│  │  ├─ textarea.tsx
│  │  ├─ toast.tsx
│  │  ├─ toaster.tsx
│  │  ├─ toggle-group.tsx
│  │  ├─ toggle.tsx
│  │  └─ tooltip.tsx
│  └─ vehicles
│     ├─ vehicle-card.tsx
│     ├─ vehicle-details-dialog.tsx
│     ├─ vehicle-table.tsx
│     └─ VehicleForm.tsx
├─ components.json
├─ config
│  └─ pdf.ts
├─ CONTRIBUTING.md
├─ docs
│  ├─ Developer-Documentation.md
│  └─ User-Documentation.md
├─ eslint.config.js
├─ features
│  ├─ admin
│  │  ├─ AdminDashboard.tsx
│  │  ├─ users
│  │  │  └─ UserManagementDashboard.tsx
│  │  └─ __tests__
│  │     └─ AdminDashboard.test.tsx
│  ├─ analytics
│  │  ├─ dashboard-metrics.tsx
│  │  ├─ MainDashboardFeature.tsx
│  │  └─ performance-metrics.tsx
│  ├─ compliance
│  │  └─ ComplianceDashboard.tsx
│  ├─ dispatch
│  │  └─ recent-activity.tsx
│  ├─ drivers
│  │  ├─ AddDriverDialog.tsx
│  │  ├─ AssignmentDialogButton.tsx
│  │  ├─ DriverAssignmentDialog.tsx
│  │  ├─ DriverFormFeature.tsx
│  │  └─ DriverListPage.tsx
│  ├─ ifta
│  │  └─ IftaReportingFeature.tsx
│  ├─ onboarding
│  │  └─ OnboardingWizard.tsx
│  ├─ settings
│  │  ├─ CompanySettingsPage.tsx
│  │  ├─ UserSettingsPage.tsx
│  │  └─ __tests__
│  │     └─ CompanySettingsPage.test.tsx
│  └─ vehicles
│     ├─ add-vehicle-dialog.tsx
│     ├─ vehicle-list-client.tsx
│     └─ VehicleListPage.tsx
├─ hooks
│  ├─ use-dispatch-realtime.ts
│  ├─ use-mobile.tsx
│  ├─ use-toast.ts
│  └─ useDashboardPreferences.ts
├─ lib
│  ├─ actions
│  │  ├─ adminActions.ts
│  │  ├─ analyticsActions.ts
│  │  ├─ analyticsReportActions.ts
│  │  ├─ auditActions.ts
│  │  ├─ auditLogActions.ts
│  │  ├─ complianceActions.ts
│  │  ├─ complianceMonitoring.ts
│  │  ├─ complianceReportActions.ts
│  │  ├─ dashboardActions.ts
│  │  ├─ dispatchActions.ts
│  │  ├─ driverActions.ts
│  │  ├─ fileUploadActions.ts
│  │  ├─ inspectionActions.ts
│  │  ├─ invitationActions.ts
│  │  ├─ loadActions.ts
│  │  ├─ notificationActions.ts
│  │  ├─ onboardingActions.ts
│  │  ├─ regulatoryAuditActions.ts
│  │  ├─ searchActions.ts
│  │  ├─ settingsActions.ts
│  │  ├─ userActions.ts
│  │  └─ vehicleActions.ts
│  ├─ admin
│  │  └─ logging.ts
│  ├─ auth
│  │  ├─ auth.ts
│  │  ├─ permissions.ts
│  │  ├─ secure-session-management.ts
│  │  ├─ session-claims-utils.ts
│  │  └─ utils.ts
│  ├─ cache
│  │  ├─ auth-cache.ts
│  │  └─ redis.ts
│  ├─ compliance
│  │  └─ regulatoryEngine.ts
│  ├─ config
│  │  └─ environment.ts
│  ├─ database
│  │  └─ db.ts
│  ├─ errors
│  │  └─ handleError.ts
│  ├─ fetchers
│  │  ├─ adminFetchers.ts
│  │  ├─ analyticsFetchers.ts
│  │  ├─ complianceFetchers.ts
│  │  ├─ dashboardFetchers.ts
│  │  ├─ dispatchFetchers.ts
│  │  ├─ driverFetchers.ts
│  │  ├─ iftaFetchers.ts
│  │  ├─ kpiFetchers.ts
│  │  ├─ notificationFetchers.ts
│  │  ├─ onboardingFetchers.ts
│  │  ├─ searchFetchers.ts
│  │  ├─ settingsFetchers.ts
│  │  ├─ userFetchers.ts
│  │  └─ vehicleFetchers.ts
│  ├─ pdf
│  │  ├─ ifta-pdf-service.ts
│  │  ├─ ifta-pdf-templates.tsx
│  │  └─ pdf-utils.ts
│  ├─ services
│  │  └─ pdfService.ts
│  ├─ utils
│  │  ├─ hos.ts
│  │  ├─ ifta.ts
│  │  ├─ mvp-verification.ts
│  │  ├─ rate-limit.ts
│  │  ├─ slug.ts
│  │  └─ utils.ts
│  └─ utils.ts
├─ LICENSE
├─ middleware.ts
├─ next-env.d.ts
├─ next.config.ts
├─ node_modules
├─ package-lock.json
├─ package.json
├─ playwright.config.ts
├─ postcss.config.mjs
├─ prisma
│  ├─ migrations
│  │  ├─ 20250601171552_initial_schema
│  │  │  └─ migration.sql
│  │  ├─ 20250605021047_dispatch_system_fixes
│  │  │  └─ migration.sql
│  │  ├─ 20250605031003_add_compliance_alerts
│  │  │  └─ migration.sql
│  │  ├─ 20250605031503_add_compliance_document_metadata
│  │  │  └─ migration.sql
│  │  ├─ 20250619171733_make_clerk_id_nullable
│  │  │  └─ migration.sql
│  │  ├─ 20250619213339_add_missing_models_and_fields
│  │  │  └─ migration.sql
│  │  ├─ 20250619221833_update_ifta_models
│  │  │  └─ migration.sql
│  │  ├─ 20250619233756_add_load_document_relation
│  │  │  └─ migration.sql
│  │  ├─ 20250619235025_add_missing_fields_for_code
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  ├─ schema.prisma
│  └─ seed.ts
├─ public
│  ├─ black_logo.png
│  ├─ blue_cover.png
│  ├─ cockpit_bg.png
│  ├─ landing_hero.png
│  ├─ map-pinned_icon.png
│  ├─ mountain_bg.png
│  ├─ readme_hero.jpeg
│  ├─ route_icon.png
│  ├─ social-card.png
│  ├─ sunset_bg.png
│  ├─ sunset_hero.png
│  ├─ sunset_loading.png
│  ├─ tiers_bg.png
│  ├─ trucksz_splash.png
│  ├─ twighlight_loading.png
│  ├─ valley_bg.png
│  ├─ white_logo.png
│  └─ winding_bg.png
├─ README.md
├─ schemas
│  ├─ analytics.ts
│  ├─ auth.ts
│  ├─ compliance.ts
│  ├─ dispatch.ts
│  ├─ drivers.ts
│  ├─ ifta.ts
│  ├─ invitations.ts
│  ├─ onboarding.ts
│  ├─ regulatory.ts
│  ├─ settings.ts
│  ├─ shared.ts
│  └─ vehicles.ts
├─ scripts
│  ├─ database-maintenance.ts
│  ├─ deploy-fleetfusion-agent.ps1
│  └─ validate-tests.js
├─ tailwind.config.ts
├─ tsconfig.json
├─ types
│  ├─ abac.ts
│  ├─ actions.ts
│  ├─ admin.ts
│  ├─ analytics.ts
│  ├─ api.ts
│  ├─ auth.ts
│  ├─ compliance.ts
│  ├─ dashboard.ts
│  ├─ dispatch.ts
│  ├─ drivers.ts
│  ├─ globals.d.ts
│  ├─ ifta.ts
│  ├─ index.ts
│  ├─ kpi.ts
│  ├─ metadata.ts
│  ├─ notifications.ts
│  ├─ onboarding.ts
│  ├─ prisma.d.ts
│  ├─ search.ts
│  ├─ settings.ts
│  ├─ vehicles.ts
│  └─ webhooks.ts
└─ vitest.config.ts
