import { USER_ROLES, type UserRole } from './constants';

export interface ResourcePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export type ResourceType =
  | 'rooms'
  | 'foods'
  | 'users'
  | 'guests'
  | 'orders'
  | 'bookings'
  | 'payments'
  | 'settings'
  | 'inventory'
  | 'guests_docs'
  | 'transactions';

export type RolePermissions = Record<ResourceType, ResourcePermissions>;

const ALLOW_ALL: ResourcePermissions = {
  view: true,
  edit: true,
  create: true,
  delete: true,
};

const DENY_ALL: ResourcePermissions = {
  view: false,
  edit: false,
  create: false,
  delete: false,
};

export const RBAC_POLICIES: Record<UserRole, RolePermissions> = {
  [USER_ROLES.ADMIN]: {
    rooms: ALLOW_ALL,
    foods: ALLOW_ALL,
    users: ALLOW_ALL,
    guests: ALLOW_ALL,
    orders: ALLOW_ALL,
    bookings: ALLOW_ALL,
    payments: ALLOW_ALL,
    settings: ALLOW_ALL,
    inventory: ALLOW_ALL,
    guests_docs: ALLOW_ALL,
    transactions: ALLOW_ALL,
  },
  [USER_ROLES.RECEPTIONIST]: {
    users: DENY_ALL,
    settings: DENY_ALL,
    rooms: { view: true, create: false, edit: true, delete: false },
    guests: { view: true, create: true, edit: true, delete: false },
    orders: { view: true, create: true, edit: true, delete: false },
    foods: { view: true, create: false, edit: false, delete: false },
    bookings: { view: true, create: true, edit: true, delete: false },
    payments: { view: true, create: true, edit: true, delete: false },
    inventory: { view: true, create: false, edit: false, delete: false },
    guests_docs: { view: true, create: true, edit: true, delete: false },
    transactions: { view: true, create: true, edit: false, delete: false },
  },
  [USER_ROLES.KITCHEN_STAFF]: {
    rooms: DENY_ALL,
    users: DENY_ALL,
    guests: DENY_ALL,
    bookings: DENY_ALL,
    payments: DENY_ALL,
    settings: DENY_ALL,
    guests_docs: DENY_ALL,
    transactions: DENY_ALL,
    foods: { view: true, create: true, edit: true, delete: false },
    orders: { view: true, create: false, edit: true, delete: false },
    inventory: { view: true, create: false, edit: true, delete: false },
  },
  [USER_ROLES.HOUSEKEEPING]: {
    foods: DENY_ALL,
    users: DENY_ALL,
    guests: DENY_ALL,
    orders: DENY_ALL,
    bookings: DENY_ALL,
    payments: DENY_ALL,
    settings: DENY_ALL,
    guests_docs: DENY_ALL,
    transactions: DENY_ALL,
    rooms: { view: true, create: false, edit: true, delete: false },
    inventory: { view: true, create: true, edit: true, delete: false },
  },
};

/**
 * Checks if a user role has permission to perform a specific action on a resource.
 */
export function hasPermission(
  role: string | null | undefined,
  resource: ResourceType,
  action: keyof ResourcePermissions
): boolean {
  if (!role) return false;
  const policy = RBAC_POLICIES[role as UserRole];
  if (!policy) return false;

  const resourcePolicy = policy[resource];
  return resourcePolicy ? resourcePolicy[action] : false;
}
