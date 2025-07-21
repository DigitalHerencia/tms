# FleetFusion UI & Architecture Rules

This document defines the rules and conventions for building views, features, and components in FleetFusion, focusing on style, layout, and separation of concerns between UI and business logic.
---

## 1. Page Specifications

- **File Location:** Place page views in `page.tsx`.
- **Header:**
  - Use a header section inside a `Card` with `CardHeader`, `CardTitle`, and `CardDescription`.
  - Header text: `text-3xl font-medium flex items-center gap-2 text-white`.
  - Icon sizing: `h-8 w-8` for main headers.
  - Layout: Wrap header and main content in `<Suspense>` with a skeleton fallback (e.g., `<DashboardSkeleton />`).
- **Tabs:**
  - Use `Tabs`, `TabsList`, and `TabsTrigger` from the UI library.
  - TabsList: `grid w-auto grid-cols-5 bg-black border border-gray-200`.
  - Tab triggers: `flex items-center gap-2 text-white data-[state=active]:bg-blue-500`, each with an icon.
- **Tab Content:**
  - Each tab content section uses a `Card` with:
    - `CardHeader` for title and description.
    - `CardContent` for main content, wrapped in `<Suspense>` if async.
    - Consistent icon usage in headers.
    - Padding: `p-6` for main container, `mt-6 space-y-6` for tab content.
- **Cards:**
  - Use `rounded-md`, `shadow-md`, `bg-black`, `p-6`, and `border border-gray-200`.
  - Card titles: `text-3xl font-medium flex items-center gap-2 text-white`.
  - Card descriptions: `text-gray-400`.
  - Responsive grid layouts: `grid grid-cols-1 md:grid-cols-3 gap-4` or similar.

---

## 2. Feature Specifications

- **File Location:** Feature modules go in /features/{domain}.
- **Layout:**
  - Use vertical spacing: `space-y-6` for stacking sections.
  - Wrap feature content in `<Suspense>` with a skeleton fallback for async data.
- **Component Usage:**
  - Import and use UI components from `components/{domain}`.
  - Pass all data via props; do not fetch data inside components.
  - Example: `<OrganizationStats orgId={orgId} userId={userId} />` inside `<Suspense>`.
- **Data Fetching & Mutation:**
  - Feature modules handle all data fetching and mutation (e.g., `getDashboardMetrics`, `getOrganizationStats`).
  - Use `await` and `Promise.all` for parallel data fetching.
  - No mock data; all data must be real.

---

## 3. Component Specifications

- **File Location:** Components go in `components/{domain}`.
- **Cards:**
  - Use `Card`, `CardHeader`, `CardTitle`, `CardContent`.
  - Card container: `border border-gray-200 bg-black`.
  - Card header: `flex flex-row items-center justify-between space-y-0 pb-2`.
  - Card title: `text-sm font-medium text-white`.
  - Card icons: Use Lucide icons, e.g., `<Users className="h-4 w-4 text-blue-500" />`.
  - Card content: `text-2xl font-bold text-white`, description: `text-xs text-gray-400 mb-2`.
  - Responsive grid: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`.
- **Dialogs, Triggers, and Icons:**
  - Use consistent icon sizing: `h-8 w-8` for main headers.
  - Dialogs and triggers should use Tailwind for spacing and color.
- **Buttons:**
  - Use `Button` component with `className="rounded-md w-full bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"`


---

## 4. Inline Styles, Padding, Spacing, Margins, and Text Styles

- **Containers:** `p-6`, `space-y-6`, `gap-4`, `mt-6`, `mb-2`, `rounded-md`, `shadow-md`.
- **Text:**
  - Main titles: `text-3xl font-medium text-white`.
  - Card titles: `text-sm font-medium text-white`.
  - Card values: `text-2xl font-bold text-white`.
  - Descriptions: `text-xs text-gray-400`, `text-gray-400`, `text-green-500`, etc.
- **Grid Layouts:** Use responsive grids for cards and stats: `grid grid-cols-1 md:grid-cols-3 gap-4`, `sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`.
- **Accessibility:** Ensure sufficient contrast and font hierarchy.
- **Buttons and Badges:** Use color and border classes for status indicators.

---

## 5. General Rules

- No mock data; all data must be real and fetched via feature modules.
- Components are pure UI and receive data via props only.
- All components and pages must be responsive and accessible.
- Use Tailwind CSS utility classes for all styling.
- Maintain separation of concerns: business logic in features, UI in components.

---

## 6. Sitewide & Domain-Agnostic Application

- These style, layout, and UI rules are domain-agnostic and should be applied across all product domains and features for consistent aesthetics.
- Use these conventions for any page, feature, or component—regardless of business domain—to ensure a unified look and feel throughout the site.

---

**All values for styles, spacing, margins, padding, data fetching, mutations, and params are verified and match the actual code in your dashboard page, AdminOverview, and OrganizationStats.**

## 2. Component Composition
- Pages import feature modules and features import components.
- Feature modules encapsulate business logic, data fetching, and mutation.
- Components must be pure UI.
- No mock data should be used in components or features.

## 3. Styling Conventions
- Use Tailwind CSS utility classes for all layout, color, and spacing.
- Cards and sections must use:
  - `rounded-md`, `shadow-md`, `bg-black`, `p-6` for containers
  - Responsive grids: `grid grid-cols-1 md:grid-cols-3 gap-4`
- Stat cards should use color themes (e.g., `bg-black`, `text-white`) and sizing (`w-64`, `gap-4`).
- All components must be responsive and accessible.
- Use specific inline styles consistently across all components.

## 4. Data Flow
- Feature modules handle all data fetching and mutation.
- Components receive data via props only.
- No business logic or data fetching in components.

## 5. UI/UX Patterns
- Use consistent card design for dashboard metrics.
- Ensure sufficient contrast and font hierarchy (`text-xl font-bold`, etc.).
- Layouts must adapt to screen size using Tailwind breakpoints.

## 6. Extensibility
- New dashboard widgets/features should follow the card/grid style and use Tailwind for styling.
- Page-level logic can conditionally render features based on organization settings.

---

## Example Usage

```tsx
// app/(tenant)/[orgId]/dashboard/[userId]/page.tsx
import FeatureModule from '@/features/dashboard/FeatureModule';

export default function DashboardPage({ params }) {
  // ...existing code for fetching data and business logic...
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="container mx-auto py-8">
        <FeatureModule orgId={params.orgId} />
        {/* ...other dashboard widgets... */}
      </div>
    </main>
  );
}
```

```tsx
// features/dashboard/FeatureModule.tsx
import PureUIComponent from '@/components/dashboard/pure-ui-component';

export default function FeatureModule({ orgId, userId }) {
  // Fetch data and handle business logic here
  return (
    <div className="space-y-6">
      <PureUIComponent data={/* ...data from feature module... */} />
      {/* ...other feature components... */}
    </div>
  );
}
```

```tsx
// components/dashboard/pure-ui-component.tsx
export default function PureUIComponent({ data }) {
  return (
    <div className="rounded-md shadow-md bg-black p-6">
      {/* Render the data in using the specifications from the design system */}
    </div>
  );
}
```

---

## Summary
Follow these rules to ensure scalable, maintainable, and consistent dashboard features in FleetFusion. Focus on style, layout, and keeping components pure UI, with feature modules handling all business logic and data operations.
