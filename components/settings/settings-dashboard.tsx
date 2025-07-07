

"use client"

import {
    Bell,
    CreditCard,
    Download,
    History,
    Plug,
    Settings,
    Shield,
    Upload,
    User,
} from "lucide-react"
import React, { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { BillingSettingsForm } from "./billing-settings"
import { CompanySettings } from "./company-settings"
import { IntegrationSettings } from "./integration-settings"
import { NotificationSettings } from "./notification-settings"
import { UserSettings } from "./user-settings"

import type {
    BillingSettings as BillingSettingsType,
    IntegrationSettings as IntegrationSettingsType,
    NotificationSettings as NotificationSettingsType,
    OrganizationSettings,
    UserPreferences,
} from "@/types/settings"

interface SettingsDashboardProps {
    orgId: string
    userId: string
    userRole: string
    initialData: {
        organization: OrganizationSettings | null
        userPreferences: UserPreferences | null
        notifications: NotificationSettingsType | null
        integrations: IntegrationSettingsType | null
        billing: BillingSettingsType | null
    }
}

// Define which tabs each role can access
const ROLE_TAB_ACCESS = {
    admin: [
        "organization",
        "user",
        "notifications",
        "integrations",
        "billing",
        "audit",
    ] as const,
    dispatcher: [
        "organization",
        "user",
        "notifications",
        "integrations",
    ] as const,
    compliance_officer: [
        "organization",
        "user",
        "notifications",
        "audit",
    ] as const,
    accountant: ["billing", "user", "notifications", "audit"] as const,
    driver: ["user", "notifications"] as const,
    viewer: ["user", "notifications"] as const,
} as const

type TabName =
    | "organization"
    | "user"
    | "notifications"
    | "integrations"
    | "billing"
    | "audit"

export function SettingsDashboard({
    orgId,
    userId,
    userRole,
    initialData,
}: SettingsDashboardProps) {
    const accessibleTabs = (ROLE_TAB_ACCESS[
        userRole as keyof typeof ROLE_TAB_ACCESS
    ] || ["user", "notifications"]) as readonly TabName[]
    const [activeTab, setActiveTab] = useState<string>(
        accessibleTabs[0] || "user"
    )
    const [isExporting, setIsExporting] = useState(false)
    const [isImporting, setIsImporting] = useState(false)
    // Set default tab to first accessible tab
    useEffect(() => {
        if (
            accessibleTabs.length > 0 &&
            !accessibleTabs.includes(activeTab as TabName)
        ) {
            const firstTab = accessibleTabs[0]
            if (firstTab) {
                setActiveTab(firstTab)
            } else {
                setActiveTab("user")
            }
        }
    }, [accessibleTabs, activeTab])

    const handleExportSettings = async () => {
        setIsExporting(true)
        try {
            // Implementation for exporting settings
            const response = await fetch(`/api/settings/${orgId}/export`)
            const data = await response.blob()
            const url = window.URL.createObjectURL(data)
            const a = document.createElement("a")
            a.href = url
            a.download = `settings-${orgId}-${
                new Date().toISOString().split("T")[0]
            }.json`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error("Failed to export settings:", error)
        } finally {
            setIsExporting(false)
        }
    }

    const handleImportSettings = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsImporting(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            const response = await fetch(`/api/settings/${orgId}/import`, {
                method: "POST",
                body: formData,
            })
            if (response.ok) {
                window.location.reload() // Refresh to show updated settings
            }
        } catch (error) {
            console.error("Failed to import settings:", error)
        } finally {
            setIsImporting(false)
        }
    }

    return (
        <div className='space-y-6'>
            {/* Header Actions for Admin */}
            {accessibleTabs.includes("organization") && (
                <Card>
                    <CardHeader className='pb-3'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <CardTitle className='text-lg'>
                                    Settings Management
                                </CardTitle>
                                <CardDescription>
                                    Export, import, and manage your organization
                                    settings
                                </CardDescription>
                            </div>
                            <div className='flex gap-2'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={handleExportSettings}
                                    disabled={isExporting}
                                    className='flex items-center gap-2'
                                >
                                    <Download className='h-4 w-4' />
                                    {isExporting ? "Exporting..." : "Export"}
                                </Button>
                                <div className='relative'>
                                    <input
                                        type='file'
                                        accept='.json'
                                        onChange={handleImportSettings}
                                        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                                        disabled={isImporting}
                                    />
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        disabled={isImporting}
                                        className='flex items-center gap-2'
                                    >
                                        <Upload className='h-4 w-4' />
                                        {isImporting
                                            ? "Importing..."
                                            : "Import"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            )}

            {/* Main Settings Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className='space-y-6'
            >
                <TabsList className='grid grid-cols-2 md:grid-cols-6 w-full'>
                    {accessibleTabs.includes("organization") && (
                        <TabsTrigger
                            value='organization'
                            className='flex items-center gap-2'
                        >
                            <Settings className='h-4 w-4' />
                            <span className='hidden sm:inline'>
                                Organization
                            </span>
                        </TabsTrigger>
                    )}

                    {accessibleTabs.includes("user") && (
                        <TabsTrigger
                            value='user'
                            className='flex items-center gap-2'
                        >
                            <User className='h-4 w-4' />
                            <span className='hidden sm:inline'>Profile</span>
                        </TabsTrigger>
                    )}

                    {accessibleTabs.includes("notifications") && (
                        <TabsTrigger
                            value='notifications'
                            className='flex items-center gap-2'
                        >
                            <Bell className='h-4 w-4' />
                            <span className='hidden sm:inline'>
                                Notifications
                            </span>
                        </TabsTrigger>
                    )}

                    {accessibleTabs.includes("integrations") && (
                        <TabsTrigger
                            value='integrations'
                            className='flex items-center gap-2'
                        >
                            <Plug className='h-4 w-4' />
                            <span className='hidden sm:inline'>
                                Integrations
                            </span>
                        </TabsTrigger>
                    )}

                    {accessibleTabs.includes("billing") && (
                        <TabsTrigger
                            value='billing'
                            className='flex items-center gap-2'
                        >
                            <CreditCard className='h-4 w-4' />
                            <span className='hidden sm:inline'>Billing</span>
                        </TabsTrigger>
                    )}

                    {accessibleTabs.includes("audit") && (
                        <TabsTrigger
                            value='audit'
                            className='flex items-center gap-2'
                        >
                            <History className='h-4 w-4' />
                            <span className='hidden sm:inline'>Audit</span>
                        </TabsTrigger>
                    )}
                </TabsList>
                {/* Role Badge */}
                <div className='flex items-center gap-2'>
                    <Badge
                        variant='secondary'
                        className='flex items-center gap-1'
                    >
                        <Shield className='h-3 w-3' />
                        {userRole.replace("_", " ").toUpperCase()}
                    </Badge>
                    <span className='text-muted-foreground text-sm'>
                        You have access to {accessibleTabs.length} setting
                        {accessibleTabs.length !== 1 ? "s" : ""} categories
                    </span>
                </div>
                <Separator /> {/* Tab Contents */}
                {accessibleTabs.includes("organization") && (
                    <TabsContent
                        value='organization'
                        className='space-y-6'
                    >
                        <CompanySettings />
                    </TabsContent>
                )}
                {accessibleTabs.includes("user") && (
                    <TabsContent
                        value='user'
                        className='space-y-6'
                    >
                        <UserSettings />
                    </TabsContent>
                )}
                {accessibleTabs.includes("notifications") && (
                    <TabsContent
                        value='notifications'
                        className='space-y-6'
                    >
                        <NotificationSettings />
                    </TabsContent>
                )}
                {accessibleTabs.includes("integrations") && (
                    <TabsContent
                        value='integrations'
                        className='space-y-6'
                    >
                        <IntegrationSettings />
                    </TabsContent>
                )}
                {accessibleTabs.includes("billing") && (
                    <TabsContent
                        value='billing'
                        className='space-y-6'
                    >
                        <BillingSettingsForm
                            initial={{
                                orgId: orgId,
                                paymentMethod:
                                    initialData.billing?.paymentMethod || "",
                                subscriptionPlan:
                                    initialData.billing?.subscriptionPlan || "",
                                billingEmail:
                                    initialData.billing?.billingEmail || "",
                            }}
                        />
                    </TabsContent>
                )}
                {accessibleTabs.includes("audit") && (
                    <TabsContent
                        value='audit'
                        className='space-y-6'
                    >
                        <AuditTrail orgId={orgId} />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}

// Audit Trail Component
function AuditTrail({ orgId }: { orgId: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings Audit Trail</CardTitle>
                <CardDescription>
                    View all changes made to organization and user settings
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='text-center py-8 text-muted-foreground'>
                    <History className='h-12 w-12 mx-auto mb-4 opacity-50' />
                    <p>Audit trail implementation coming soon...</p>
                    <p className='text-sm'>
                        This will show all settings changes with timestamps and
                        user details.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
