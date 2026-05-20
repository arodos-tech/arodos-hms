/**
 * Hotel Management System Constants
 */

export const USER_ROLES = {
  ADMIN: 'admin',
  RECEPTIONIST: 'receptionist',
  KITCHEN_STAFF: 'kitchen',
  HOUSEKEEPING: 'housekeeping',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROOM_STATUSES = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  OCCUPIED: 'occupied',
  CLEANING: 'cleaning',
  MAINTENANCE: 'maintenance',
} as const;

export type RoomStatus = typeof ROOM_STATUSES[keyof typeof ROOM_STATUSES];

export const BOOKING_STATUSES = {
  BOOKED: 'booked',
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
  CANCELLED: 'cancelled',
} as const;

export type BookingStatus = typeof BOOKING_STATUSES[keyof typeof BOOKING_STATUSES];

export const PAYMENT_STATUSES = {
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  PAID: 'paid',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUSES[keyof typeof PAYMENT_STATUSES];

export const PAYMENT_MODES = {
  CASH: 'Cash',
  CARD: 'Card',
  UPI: 'UPI',
  BANK_TRANSFER: 'Bank Transfer',
  ROOM_CHARGE: 'Room Charge',
} as const;

export type PaymentMode = typeof PAYMENT_MODES[keyof typeof PAYMENT_MODES];

export const ORDER_STATUSES = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];

export const FOOD_CATEGORIES = [
  'Starters',
  'Main Course',
  'Desserts',
  'Beverages',
  'Snacks',
  'Soups',
] as const;

export const INVENTORY_CATEGORIES = [
  'Linen',
  'Guest Amenities',
  'Housekeeping supplies',
  'Kitchen raw material',
  'Maintenance assets',
] as const;

export const TAX_RATES = {
  GST_5: 5,
  GST_12: 12,
  GST_18: 18,
} as const;
