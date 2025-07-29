# # FleetFusion Multi-Tenant SaaS TMS PRD, Audit Prompts, LLM Coding Agent Process, and Guidance

---

## 1. Product Requirements Document (PRD)

### Overview

**FleetFusion** is a multi-tenant SaaS platform for fleet management, targeting trucking companies and fleet managers. It provides a unified solution for dispatch, vehicle and driver management, compliance, analytics, and more, with strict role-based access and data isolation.

### Key Features

- **Dispatch Board:** Real-time load assignment, drag-and-drop UI, status tracking, and notifications.
- **Vehicle Management:** Maintenance scheduling, inspections, compliance documentation, analytics.
- **Driver Management:** Licensing, HOS logs, performance metrics, assignment tracking.
- **Compliance:** Central dashboard, document uploads, automated reminders, regulatory reporting.
- **IFTA Reporting:** Automated fuel/miles tracking, tax calculation, exportable reports.
- **Analytics:** Real-time dashboards for performance, utilization, and finance.
- **Role-Based Access:** Admin, Dispatcher, Driver, Compliance Officer, Accountant, Viewer.
- **Multi-Tenancy:** Company-level data isolation, org-based access, RBAC via Clerk.
- **Modern UI:** Responsive, accessible, dark/light mode, mobile-friendly.

### Technical Stack

- **Frontend:** Next.js 15 (App Router, RSC), React 19, Tailwind CSS 4
- **Backend:** Node.js/Edge, React Server Actions, Next.js API Routes
- **Database:** PostgreSQL (Neon), Prisma ORM
- **Auth:** Clerk (org-based, RBAC)
- **Storage:** Vercel Blob Storage
- **Testing:** Vitest, Playwright, React Testing Library
- **CI/CD:** GitHub Actions, Vercel

### Non-Functional Requirements

- **Performance:** Fast load times, optimized bundle size, server-first rendering.
- **Security:** Tenant isolation, RBAC, input validation, secure secrets management.
- **Scalability:** Modular, feature-driven architecture, reusable components and logic.
- **Maintainability:** Strict TypeScript, code linting, automated tests, clear documentation.
- **Compliance:** Adherence to industry standards (e.g., DOT, IFTA).

---

## 2. Scoped Audit Prompts (by Domain)

### User Management

- Verify user roles, permissions, and access controls.
- Ensure RBAC is enforced at all API endpoints, server actions, and UI routes.
- Check that user invitations, onboarding, and role assignments are secure and auditable.
- Validate Clerk integration for multi-tenant org/role claims.

### Vehicle Management

- Check data integrity for vehicle records (CRUD, assignments, compliance docs).
- Validate maintenance and inspection scheduling logic.
- Ensure compliance data is correctly linked to vehicles and not exposed across tenants.

### Dispatch System

- Assess real-time updates, load assignment, and drag-and-drop functionality.
- Validate that only authorized users can assign, edit, or view loads.
- Ensure dispatch events are logged for auditability.

### Analytics

- Validate data accuracy in dashboards and reports.
- Ensure analytics endpoints are tenant-scoped and do not leak cross-tenant data.
- Check export functionality for compliance with data privacy.

### Compliance

- Ensure all compliance documents are securely uploaded, stored, and linked.
- Validate automated reminders and regulatory reporting logic.
- Check that compliance alerts and audit logs are accurate and tamper-proof.

### Billing

- Verify billing settings, payment method updates, and subscription management.
- Ensure only authorized roles can access and modify billing data.
- Validate export/import of billing settings.

### Integrations

- Audit third-party integration points (e.g., map APIs, external analytics).
- Ensure secrets and tokens are never exposed to the client.
- Validate integration settings are tenant-scoped.

### Notifications

- Check notification preferences, delivery, and auditability.
- Ensure notification settings are user-specific and not globally exposed.

---

## 3. LLM Coding Agent Process for Full-Project Analysis

1. **Load Project Structure**

   - Enumerate all files and directories, including app, components, features, lib, types, schemas, etc.

2. **Analyze Each File**

   - Check for syntax errors, type mismatches, and linting issues.
   - Validate adherence to project conventions (feature-driven, modular, server-first).
   - Identify anti-patterns (e.g., over-broad props, missing input validation, direct DB access outside fetchers/actions).

3. **Security & Best Practices Audit**

   - Ensure all mutations use server actions with input validation (Zod or equivalent).
   - Confirm all fetchers are async, typed, and colocated by domain.
   - Check for proper RBAC enforcement and tenant isolation in all data access.
   - Validate that sensitive data is never sent to the client or logged.

4. **Suggest and Implement Corrections**

   - Propose code changes for errors, anti-patterns, or missing validation.
   - Refactor code to align with Next.js 15, React 19, and project conventions.
   - Add or update tests for all critical logic and flows.

5. **Test and Document**
   - Run all unit, integration, and e2e tests.
   - Document changes and rationale in code comments and relevant markdown files.

---

## 4. Guidance for Using LLM Coding Agents

- **Define Clear Objectives:** Specify the domain, file(s), or feature to analyze or refactor.
- **Provide Context:** Share relevant code, error messages, or requirements for targeted improvements.
- **Iterative Feedback:** Use feedback loops—review LLM suggestions, test, and request further refinements as needed.
- **Enforce Conventions:** Instruct the LLM to follow project structure, naming, and security standards.
- **Validate All Changes:** Require the LLM to run and pass all tests, and to document any significant changes.
- **Explore Alternatives:** Encourage the LLM to suggest optimizations or alternative approaches for performance, security, or maintainability.
- **Maintain a Change Log:** Document all LLM-driven changes for traceability and future audits.

---

### Example LLM Usage Flow

1. **Audit a Domain**
   - _Prompt:_ “Audit the dispatch and dispatchActions.ts for security and best practices. List all issues and propose fixes.”
2. **Refactor a Component**
   - _Prompt:_ “Refactor settings-dashboard.tsx to ensure all server mutations use server actions and input validation.”
3. **Add Tests**
   - _Prompt:_ “Generate unit and integration tests for analyticsFetchers.ts and ensure 100% coverage.”
4. **Security Review**
   - _Prompt:_ “Review all API routes in api for RBAC enforcement and tenant isolation. Suggest improvements.”
5. **Documentation**
   - _Prompt:_ “Update the documentation in Developer-Documentation.md to reflect the latest onboarding flow.”
