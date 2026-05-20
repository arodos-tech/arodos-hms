# Hotel Management System — Testing Guide

This document describes the manual testing plan covering all major workflows, module interactions, and edge cases for the Hotel Management System. Since the project currently runs on a mock in-memory database (`Mock_Api.ts`), all tests can be executed fully offline.

---

## Mock Data Available

The `Mock_Api.ts` mock database is pre-seeded with the following data:

| Table | Records |
|---|---|
| `users` | 1 admin user (`admin@hotel.com` / `admin`) |
| `guests` | 2 guests (Rohan Sharma, Emily Watson) |
| `bookings` | 2 bookings (1 checked-in, 1 booked) |
| `bookings_rooms` | 2 room allocations |
| `foods` | 5 menu items |
| `guest_orders` | 1 delivered room-service order |
| `guest_ordered_foods` | 1 line item |
| `inventory` | 3 stock items |
| `inventory_logs` | 1 issuance log |
| `payments` | 1 advance payment |
| `transactions` | 1 ledger entry |
| `settings` | 3 hotel config entries |
| `companies` | 1 corporate client |

---

## Module Test Cases

### Auth

| # | Test | Expected |
|---|---|---|
| 1 | Login with `admin@hotel.com` / `admin` | Redirects to dashboard, stores session |
| 2 | Login with wrong password | Shows error message |
| 3 | Reload page after login | Stays logged in (session from localStorage) |
| 4 | Logout | Clears session, redirects to login |

---

### Bookings

| # | Test | Expected |
|---|---|---|
| 5 | View bookings list | Shows 2 bookings: Rohan (checked_in), Emily (booked) |
| 6 | Click a booking | Opens booking detail with room, payment, guest info |
| 7 | Create new booking | POST to `bookings`, new entry appears in list |
| 8 | Edit booking status | PUT updates booking, reflects in list |
| 9 | Filter bookings by status `checked_in` | Shows only Rohan's booking |

---

### Guests

| # | Test | Expected |
|---|---|---|
| 10 | View guests list | Shows Rohan Sharma, Emily Watson |
| 11 | Click a guest | Shows profile, linked bookings, docs |
| 12 | Add new guest | POST to `guests`, appears in list |
| 13 | Upload guest document | POST to `guests_docs`, visible in guest docs tab |

---

### Room Service / Orders

| # | Test | Expected |
|---|---|---|
| 14 | View orders for booking #1 | Shows 1 delivered order (Butter Chicken) |
| 15 | Create new room-service order | POST to `guest_orders` + `guest_ordered_foods` |
| 16 | Update order status to `delivered` | PUT updates status |
| 17 | Delivered order charged to booking bill | `order_price` increases on booking |

---

### Food Menu

| # | Test | Expected |
|---|---|---|
| 18 | View food menu | Shows 5 items: Sandwich, Butter Chicken, Paneer Tikka, etc. |
| 19 | Add new food item | POST to `foods`, appears in menu list |
| 20 | Edit food price | PUT updates record |

---

### Payments

| # | Test | Expected |
|---|---|---|
| 21 | View payments for booking #1 | Shows advance payment of ₹2000 via UPI |
| 22 | Record a new payment | POST to `payments` + `transactions` |
| 23 | Payment status on booking updates | `payment_status` reflects `partial` → `paid` |

---

### Inventory

| # | Test | Expected |
|---|---|---|
| 24 | View inventory list | Shows 3 items (bed sheets, pillow covers, toiletries) |
| 25 | Issue items to a room | POST to `inventory_logs`, `used_quantity` increases |
| 26 | Add new stock purchase | POST to `inventory_logs` with `log_type: purchase` |

---

### Settings & Master Data

| # | Test | Expected |
|---|---|---|
| 27 | View hotel settings | Shows hotel name, currency, tax rules |
| 28 | Edit hotel name | PUT to `settings` record updates |
| 29 | View settings options (room types) | Shows 3 room types |

---

## FQL Client Behavior Tests

These tests verify the in-memory `Mock_Api.ts` engine behaves identically to real API expectations.

| # | Test | Expected |
|---|---|---|
| 30 | `fql.guests.findMany()` | Returns array, all records |
| 31 | `fql.guests.findOne(1)` | Returns single guest object |
| 32 | `fql.guests.findMany({ where: { client: 1 } })` | Only returns client-matching records |
| 33 | `fql.bookings.findMany({ filter: 'status:checked_in' })` | Returns 1 result |
| 34 | `fql.guests.createOne({ name: 'Test', phone: 9000000000, client: 1 })` | Returns new record with `id` |
| 35 | `fql.guests.updateOne(1, { name: 'Updated' })` | Returns updated record |
| 36 | `fql.guests.softDeleteOne(1)` | Sets `is_deleted: 1`, excluded from future `findMany` |
| 37 | `fql.users.auth({ body: { email, password } })` | Returns user + mock session token |
| 38 | `fql.guests.findMany({ sort: '-created_at' })` | Returns most recent guest first |
| 39 | `fql.foods.findMany({ page: '1', limit: '3' })` | Returns first 3 of 5 food items |

---

## Switching to Real API

When ready to switch from mock to production:

1. In `fqlClient.ts`, change line 1:
   ```ts
   // FROM
   import Api from "./Mock_Api";
   // TO
   import Api from "./Api";
   ```
2. Populate `tokens.json` with valid API tokens from the FrontQL server.
3. Update `config.ts` with production server URLs.
4. All `fql.*` calls will then route to the real database with zero code changes in any component.
