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
            const response = await fetch(`/api/settings/${orgId}/export`)
            const data = await response.blob()
            const url = window.URL.createObjectURL(data)
            const a = document.createElement("a")
            a.href = url
            a.download = `settings-${orgId}-${new Date().toISOString().split("T")[0]}.json`
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
                window.location.reload()
            }
        } catch (error) {
            console.error("Failed to import settings:", error)
        } finally {
            setIsImporting(false)
        }
    }

    return (
        <div className="min-h-screen space-y-6 bg-neutral-900 p-6 pt-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Settings className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-white">Settings Management</h1>
                        <span className="border border-blue-200 bg-blue-50 text-blue-700 rounded px-2 py-1 text-xs font-semibold">Admin</span>
                    </div>
                    <p className="text-gray-400">
                        Export, import, and manage your organization settings
                    </p>
                </div>
                {accessibleTabs.includes("organization") && (
                    <div className="flex flex-row gap-4 mt-4 md:mt-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportSettings}
                            disabled={isExporting}
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            {isExporting ? "Exporting..." : "Export"}
                        </Button>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImportSettings}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={isImporting}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isImporting}
                                className="flex items-center gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                {isImporting ? "Importing..." : "Import"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Settings Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
            >
                <TabsList className="grid w-auto grid-cols-2 md:grid-cols-6 bg-black border border-gray-200">
                    {accessibleTabs.includes("organization") && (
                        <TabsTrigger
                            value="organization"
                            className="flex items-center gap-2 text-white data-[state=active]:bg-blue-600"
                        >
                            <Settings className="h-4 w-4" />
                            <span className="hidden sm:inline">Organization</span>
                        </TabsTrigger>
                    )}
                    {accessibleTabs.includes("user") && (
                        <TabsTrigger
                            value="user"
                            className="flex items-center gap-2 text-white data-[state=active]:bg-blue-600"
                        >
                            <User className="h-4 w-4" />
                            <span className="hidden sm:inline">Profile</span>
                        </TabsTrigger>
                    )}
                    {accessibleTabs.includes("notifications") && (
                        <TabsTrigger
                            value="notifications"
                            className="flex items-center gap-2 text-white data-[state=active]:bg-blue-600"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="hidden sm:inline">Notifications</span>
                        </TabsTrigger>
                    )}
                    {accessibleTabs.includes("integrations") && (
                        <TabsTrigger
                            value="integrations"
                            className="flex items-center gap-2 text-white data-[state=active]:bg-blue-600"
                        >
                            <Plug className="h-4 w-4" />
                            <span className="hidden sm:inline">Integrations</span>
                        </TabsTrigger>
                    )}
                    {accessibleTabs.includes("billing") && (
                        <TabsTrigger
                            value="billing"
                            className="flex items-center gap-2 text-white data-[state=active]:bg-blue-600"
                        >
                            <CreditCard className="h-4 w-4" />
                            <span className="hidden sm:inline">Billing</span>
                        </TabsTrigger>
                    )}
                    {accessibleTabs.includes("audit") && (
                        <TabsTrigger
                            value="audit"
                            className="flex items-center gap-2 text-white data-[state=active]:bg-blue-600"
                        >
                            <History className="h-4 w-4" />
                            <span className="hidden sm:inline">Audit</span>
                        </TabsTrigger>
                    )}
                </TabsList>
                {/* Role Badge */}
                <div className="flex items-center gap-2 mt-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {userRole.replace("_", " ").toUpperCase()}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                        You have access to {accessibleTabs.length} setting{accessibleTabs.length !== 1 ? "s" : ""} categories
                    </span>
                </div>
                <Separator />
                {/* Tab Contents */}
                {accessibleTabs.includes("organization") && (
                    <TabsContent value="organization" className="mt-6 space-y-6">
                        <Card className="bg-black border border-gray-200">
                            <CardHeader>
                                <CardTitle>
                                    <h1 className="text-2xl font-medium flex items-center gap-2 text-white">
                                        <Settings className="h-6 w-6" />
                                        Organization Settings
                                    </h1>
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Manage your organization details and preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CompanySettings />
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
                {accessibleTabs.includes("user") && (
                    <TabsContent value="user" className="mt-6 space-y-6">
                        <Card className="bg-black border border-gray-200">
                            <CardHeader>
                                <CardTitle>
                                    <h1 className="text-2xl font-medium flex items-center gap-2 text-white">
                                        <User className="h-6 w-6" />
                                        Profile Settings
                                    </h1>
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Manage your user profile and preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UserSettings />
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
                {accessibleTabs.includes("notifications") && (
                    <TabsContent value="notifications" className="mt-6 space-y-6">
                        <Card className="bg-black border border-gray-200">
                            <CardHeader>
                                <CardTitle>
                                    <h1 className="text-2xl font-medium flex items-center gap-2 text-white">
                                        <Bell className="h-6 w-6" />
                                        Notification Settings
                                    </h1>
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Manage notification preferences and alerts
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <NotificationSettings />
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
                {accessibleTabs.includes("integrations") && (
                    <TabsContent value="integrations" className="mt-6 space-y-6">
                        <Card className="bg-black border border-gray-200">
                            <CardHeader>
                                <CardTitle>
                                    <h1 className="text-2xl font-medium flex items-center gap-2 text-white">
                                        <Plug className="h-6 w-6" />
                                        Integration Settings
                                    </h1>
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Manage integrations and connected services
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <IntegrationSettings />
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
                {accessibleTabs.includes("billing") && (
                    <TabsContent value="billing" className="mt-6 space-y-6">
                        <Card className="bg-black border border-gray-200">
                            <CardHeader>
                                <CardTitle>
                                    <h1 className="text-2xl font-medium flex items-center gap-2 text-white">
                                        <CreditCard className="h-6 w-6" />
                                        Billing Settings
                                    </h1>
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Manage billing, payment methods, and subscriptions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
                {accessibleTabs.includes("audit") && (
                    <TabsContent value="audit" className="mt-6 space-y-6">
                        <Card className="bg-black border border-gray-200">
                            <CardHeader>
                                <CardTitle>
                                    <h1 className="text-2xl font-medium flex items-center gap-2 text-white">
                                        <History className="h-6 w-6" />
                                        Settings Audit Trail
                                    </h1>
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    View all changes made to organization and user settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Audit trail implementation coming soon...</p>
                                    <p className="text-sm">
                                        This will show all settings changes with timestamps and user details.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
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
