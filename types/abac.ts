/**
 * FleetFusion ABAC (Attribute-Based Access Control) Type Definitions
 *
 * This file defines all role types, permissions, and attributes used for
 * authorization throughout the application. These implement a custom RBAC system
 * since Clerk organizations (and their roles/permissions) are disabled.
 */

/**
 * System Roles - Core roles available in the FleetFusion platform
 * These match your original Clerk configuration before disabling organizations
 */
export const SystemRoles = {
  ADMIN: 'admin',
  DISPATCHER: 'dispatcher', 
  DRIVER: 'driver',
  COMPLIANCE: 'compliance',
  MEMBER: 'member',
} as const;

export type SystemRole = (typeof SystemRoles)[keyof typeof SystemRoles];

/**
 * Permission strings - exact permission names from your Clerk configuration
 * These are the specific permissions that were defined in Clerk before disabling orgs
 */
export const Permissions = {
  // System permissions
  'org:sys_domains:read': 'org:sys_domains:read',
  'org:sys_domains:manage': 'org:sys_domains:manage', 
  'org:sys_profile:manage': 'org:sys_profile:manage',
  'org:sys_profile:delete': 'org:sys_profile:delete',
  'org:sys_memberships:read': 'org:sys_memberships:read',
  'org:sys_memberships:manage': 'org:sys_memberships:manage',
  'org:sys_billing:manage': 'org:sys_billing:manage',
  'org:sys_billing:read': 'org:sys_billing:read',

  // Admin permissions
  'org:admin:access_all_reports': 'org:admin:access_all_reports',
  'org:admin:configure_company_settings': 'org:admin:configure_company_settings',
  'org:admin:view_audit_logs': 'org:admin:view_audit_logs',
  'org:admin:manage_users_and_roles': 'org:admin:manage_users_and_roles',
  'org:admin:view_edit_all_loads': 'org:admin:view_edit_all_loads',

  // Compliance permissions
  'org:compliance:view_compliance_dashboard': 'org:compliance:view_compliance_dashboard',
  'org:compliance:access_audit_logs': 'org:compliance:access_audit_logs',
  'org:compliance:generate_compliance_req': 'org:compliance:generate_compliance_req',
  'org:compliance:upload_review_compliance': 'org:compliance:upload_review_compliance',

  // Dispatcher permissions
  'org:dispatcher:create_edit_loads': 'org:dispatcher:create_edit_loads',
  'org:dispatcher:assign_drivers': 'org:dispatcher:assign_drivers', 
  'org:dispatcher:view_driver_vehicle_status': 'org:dispatcher:view_driver_vehicle_status',
  'org:dispatcher:access_dispatch_dashboard': 'org:dispatcher:access_dispatch_dashboard',

  // Driver permissions
  'org:driver:view_assigned_loads': 'org:driver:view_assigned_loads',
  'org:driver:update_load_status': 'org:driver:update_load_status',
  'org:driver:upload_documents': 'org:driver:upload_documents',
  'org:driver:log_hos': 'org:driver:log_hos',
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];

/**
 * Role Permission Map - Maps each role to its specific permissions
 * This replicates the exact permission structure from your Clerk configuration
 */
export const RolePermissions: Record<SystemRole, Permission[]> = {
  [SystemRoles.ADMIN]: [
    // Admin has all system permissions
    Permissions['org:sys_domains:read'],
    Permissions['org:sys_domains:manage'],
    Permissions['org:sys_profile:manage'],
    Permissions['org:sys_profile:delete'],
    Permissions['org:sys_memberships:read'],
    Permissions['org:sys_memberships:manage'],
    Permissions['org:admin:access_all_reports'],
    Permissions['org:admin:configure_company_settings'],
    Permissions['org:admin:view_audit_logs'],
    Permissions['org:admin:manage_users_and_roles'],
    Permissions['org:admin:view_edit_all_loads'],
    Permissions['org:sys_billing:manage'],
    Permissions['org:sys_billing:read'],
  ],

  [SystemRoles.COMPLIANCE]: [
    // Compliance permissions
    Permissions['org:sys_memberships:read'],
    Permissions['org:compliance:view_compliance_dashboard'],
    Permissions['org:compliance:access_audit_logs'],
    Permissions['org:compliance:generate_compliance_req'],
    Permissions['org:compliance:upload_review_compliance'],
  ],

  [SystemRoles.DISPATCHER]: [
    // Dispatcher permissions
    Permissions['org:sys_memberships:read'],
    Permissions['org:dispatcher:create_edit_loads'],
    Permissions['org:dispatcher:assign_drivers'],
    Permissions['org:dispatcher:view_driver_vehicle_status'],
    Permissions['org:dispatcher:access_dispatch_dashboard'],
  ],

  [SystemRoles.DRIVER]: [
    // Driver permissions
    Permissions['org:sys_memberships:read'],
    Permissions['org:driver:view_assigned_loads'],
    Permissions['org:driver:update_load_status'],
    Permissions['org:driver:upload_documents'],
    Permissions['org:driver:log_hos'],
  ],

  [SystemRoles.MEMBER]: [
    // Member (default role) - minimal permissions
    Permissions['org:sys_memberships:read'],
  ],
};

/**
 * Interface for user session with ABAC attributes
 * This is what will be stored in Clerk session claims (privateMetadata)
 */
export interface UserSessionAttributes {
  role: SystemRole;
  organizationId: string;
  permissions: Permission[];
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  userPermissions: Permission[],
  permission: Permission
): boolean {
  return userPermissions.includes(permission);
}

/**
 * Get permissions for a specific role
 */
export function getPermissionsForRole(role: SystemRole): Permission[] {
  return RolePermissions[role] || [];
}

/**
 * Check if user has admin access (convenience function)
 */
export function isAdmin(role: SystemRole): boolean {
  return role === SystemRoles.ADMIN;
}

/**
 * Check if user can access compliance features
 */
export function canAccessCompliance(userPermissions: Permission[]): boolean {
  return hasPermission(userPermissions, Permissions['org:compliance:view_compliance_dashboard']) ||
         hasPermission(userPermissions, Permissions['org:admin:access_all_reports']);
}

/**
 * Check if user can manage users and roles
 */
export function canManageUsers(userPermissions: Permission[]): boolean {
  return hasPermission(userPermissions, Permissions['org:admin:manage_users_and_roles']);
}

/**
 * Check if user can create/edit loads
 */
export function canManageLoads(userPermissions: Permission[]): boolean {
  return hasPermission(userPermissions, Permissions['org:dispatcher:create_edit_loads']) ||
         hasPermission(userPermissions, Permissions['org:admin:view_edit_all_loads']);
}

/**
 * Permission Action Enum - defines the basic actions that can be performed on resources
 */
export enum PermissionAction {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete'
}

/**
 * Resource Enum - defines the main resources in the FleetFusion system
 */
export enum Resource {
  ORGANIZATION = 'organization',
  VEHICLE = 'vehicle',
  LOAD = 'load'
}
