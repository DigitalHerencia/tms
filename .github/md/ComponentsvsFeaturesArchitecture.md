# Components vs Features Architecture

This architecture ensures **scalability**, **maintainability**, and **clear separation** between presentation logic and business logic, which is essential for complex applications like your FleetFusion TMS platform.

## **Components** (components)
**Pure, reusable UI building blocks** that are:
- **Stateless** and **side-effect free**
- **Technology-agnostic** (don't know about specific data sources)
- **Highly reusable** across different features
- **Presentational only** - receive data via props

```typescript
// components/ui/compliance-card.tsx
interface ComplianceCardProps {
  title: string
  percentage: number
  current: number
  total: number
  icon: React.ReactNode
  variant: 'success' | 'warning' | 'danger'
}

export function ComplianceCard({ title, percentage, current, total, icon, variant }: ComplianceCardProps) {
  return (
    <Card className="card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="card-metric">{percentage}%</div>
        <p className={`text-xs text-[hsl(var(--${variant}))]`}>
          {current} of {total} compliant
        </p>
      </CardContent>
    </Card>
  )
}
```

## **Features** (features)
**Domain-specific modules** that combine:
- **Business logic** and **data fetching**
- **Multiple components** working together
- **Server actions** for mutations
- **Feature-specific state management**

```typescript
// features/compliance/compliance-overview.tsx
import { getComplianceDashboard } from '@/lib/fetchers/compliance'
import { ComplianceCard } from '@/components/ui/compliance-card'
import { UserIcon, TruckIcon, AlertTriangle, FileText } from 'lucide-react'

interface ComplianceOverviewProps {
  orgId: string
}

export async function ComplianceOverview({ orgId }: ComplianceOverviewProps) {
  const dashboardData = await getComplianceDashboard(orgId)
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <ComplianceCard
        title="Driver Compliance"
        percentage={Math.round((dashboardData.driversInCompliance / dashboardData.totalDrivers) * 100)}
        current={dashboardData.driversInCompliance}
        total={dashboardData.totalDrivers}
        icon={<UserIcon className="h-4 w-4 text-[hsl(var(--info))]" />}
        variant="success"
      />
      <ComplianceCard
        title="Vehicle Compliance"
        percentage={Math.round((dashboardData.vehiclesInCompliance / dashboardData.totalVehicles) * 100)}
        current={dashboardData.vehiclesInCompliance}
        total={dashboardData.totalVehicles}
        icon={<TruckIcon className="h-4 w-4 text-[hsl(var(--info))]" />}
        variant="success"
      />
      {/* More cards... */}
    </div>
  )
}
```

## Key Architectural Benefits

### **1. Separation of Concerns**
- **Components**: Handle presentation and UI interactions
- **Features**: Handle business logic and data orchestration
- **Lib**: Handle data fetching, actions, and utilities

### **2. Reusability**
- **Components** can be used across multiple features
- **Features** encapsulate domain-specific behavior
- **Fetchers/Actions** can be shared across features

### **3. Testing Strategy**
- **Components**: Unit test props and rendering
- **Features**: Integration test business logic and data flow
- **Lib**: Unit test individual functions

## Modern Next.js 15 Patterns

### **Server Components by Default**
```typescript
// features/compliance/compliance-dashboard.tsx (Server Component)
export async function ComplianceDashboard({ orgId }: { orgId: string }) {
  const data = await getComplianceDashboard(orgId) // Server-side fetch
  return <ComplianceOverview data={data} />
}
```

### **Client Components When Needed**
```typescript
// features/compliance/compliance-form.tsx (Client Component)
'use client'
import { useActionState } from 'react'
import { updateComplianceStatus } from '@/lib/actions/compliance'

export function ComplianceForm() {
  const [state, action] = useActionState(updateComplianceStatus, null)
  // Client-side form handling
}
```

### **Shared Infrastructure**
```typescript
// lib/fetchers/compliance.ts
export async function getComplianceDashboard(orgId: string) {
  // Reusable data fetching logic
}

// lib/actions/compliance.ts
'use server'
export async function updateComplianceStatus(data: FormData) {
  // Reusable server action
}
```



