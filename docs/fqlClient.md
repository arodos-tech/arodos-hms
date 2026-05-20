# FQL Client — Developer Reference

`fqlClient.ts` is the central data-access layer for the Hotel Management System. It wraps all HTTP calls through a typed `GenericFQL<TRecord>` class and exposes pre-configured instances for every database table via the `fql` export object.

Switching between mock (offline) and production data requires changing a **single import line** — no component code changes needed.

---

## Architecture

```
Component / Hook
      │
      ▼
  fql.bookings.findMany(...)     ← typed, table-specific instance
      │
      ▼
  GenericFQL<Booking>            ← shared class with all CRUD methods
      │
      ├── maps camelCase ↔ snake_case field names
      ├── applies client filter & is_deleted filter automatically
      └── calls Api.get / Api.post / Api.put / Api.delete
            │
            ▼
      Mock_Api.ts  (dev)  OR  Api.ts  (prod)
```

---

## Switching Between Mock and Production

```ts
// fqlClient.ts — line 1

// Development (offline, in-memory mock database):
import Api from "./Mock_Api";

// Production (real FrontQL server):
import Api from "./Api";
```

No other code changes are needed anywhere in the application.

---

## `fql` — Pre-configured Table Instances

```ts
import { fql } from "@/services/frontql/fqlClient";
```

| Key | Table | Model Type | `is_deleted` filter |
|---|---|---|---|
| `fql.bookings` | `bookings` | `Booking` | No |
| `fql.bookings_rooms` | `bookings_rooms` | `BookingRoom` | No |
| `fql.guests` | `guests` | `Guest` | No |
| `fql.guests_docs` | `guests_docs` | `GuestDoc` | **Yes** |
| `fql.guest_orders` | `guest_orders` | `GuestOrder` | No |
| `fql.guest_ordered_foods` | `guest_ordered_foods` | `GuestOrderedFood` | No |
| `fql.foods` | `foods` | `Food` | No |
| `fql.orders` | `orders` | `Order` | No |
| `fql.orders_foods` | `orders_foods` | `OrderFood` | No |
| `fql.payments` | `payments` | `Payment` | No |
| `fql.transactions` | `transactions` | `Transaction` | No |
| `fql.inventory` | `inventory` | `Inventory` | No |
| `fql.inventory_logs` | `inventory_logs` | `InventoryLog` | No |
| `fql.invoice_no_counter` | `invoice_no_counter` | `InvoiceNoCounter` | No |
| `fql.companies` | `companies` | `Company` | No |
| `fql.settings` | `settings` | `Setting` | **Yes** |
| `fql.settings_options` | `settings_options` | `SettingOption` | **Yes** |
| `fql.users` | `users` | `User` | No |
| `fql.users_activities` | `users_activities` | `UserActivity` | No |

---

## Methods

All methods are available on every `fql.*` instance.

### `findMany(options?)`
Fetches a list of records. Auto-applies `client` and `is_deleted:0` filters.

```ts
const res = await fql.bookings.findMany({
  filter: "status:checked_in",
  sort: "-created_at",
  page: 1,
  limit: 20,
  fields: "id,guest_name,status,total_price",
});
// res.result → Booking[]
// res.count  → total matching records (for pagination)
```

**Options:**

| Option | Type | Description |
|---|---|---|
| `filter` | `string` | `field:value` pairs, comma-separated |
| `sort` | `string` | Field name. Prefix `-` for descending |
| `page` | `number` | Page number (1-based) |
| `limit` | `number` | Records per page |
| `fields` | `string` | Comma-separated column names to return |
| `search` | `string` | Free-text search string |
| `where` | `Record<string, any>` | Key-value filter built into search string |
| `joins` | `string` | Related table joins (server-side) |
| `useCache` | `boolean` | Cache response in memory |
| `cacheTtlMs` | `number` | Cache TTL in milliseconds (default 5 min) |
| `useSession` | `boolean` | Attach session token to request |

---

### `findOne(id, options?)`
Fetches a single record by ID.

```ts
const res = await fql.guests.findOne(1, {
  fields: "id,name,phone,email,guest_type",
});
// res.result → Guest
```

---

### `findManyIds(ids[], options?)`
Fetches multiple records by a list of IDs in a single call. Handles batching automatically for large lists.

```ts
const res = await fql.bookings_rooms.findManyIds([1, 2, 5], {
  fields: "id,room_no,status,room_price",
});
// res.result → BookingRoom[]
```

---

### `findLast(options?)`
Returns the most recent single record matching the given filters (sorted by `-created_at`).

```ts
const res = await fql.invoice_no_counter.findLast({
  where: { year_key: "2026", type: "booking", client: 1 },
});
// res.result → InvoiceNoCounter
```

---

### `createOne(data, options?)`
Creates a single record.

```ts
const res = await fql.guests.createOne({
  name: "Arjun Mehta",
  phone: 9988776655,
  email: "arjun@example.com",
  nationality: "Indian",
  client: 1,
});
// res.result → Guest (with assigned id)
```

---

### `createMany(data[], options?)`
Creates multiple records in a single request.

```ts
const res = await fql.guest_ordered_foods.createMany([
  { order_id: 3, food_id: 1, food_name: "Sandwich", quantity: 2, price: 180, client: 1 },
  { order_id: 3, food_id: 4, food_name: "Cappuccino", quantity: 1, price: 120, client: 1 },
]);
// res.result → GuestOrderedFood[]
```

---

### `updateOne(id, data, options?)`
Updates a single record by ID.

```ts
const res = await fql.bookings.updateOne(1, {
  status: "checked_out",
  complete_booking: 1,
  payment_status: "paid",
});
// res.result → Booking
```

---

### `updateMany(updates[], options?)`
Batch-updates multiple records in a single request.

```ts
const res = await fql.guest_ordered_foods.updateMany([
  { id: 1, data: { status: "delivered" } },
  { id: 2, data: { status: "delivered" } },
]);
// res.result → GuestOrderedFood[]
```

---

### `softDeleteOne(id)` / `softDeleteMany(ids[])`
Sets `is_deleted: 1` on the record(s). Use for tables that support soft deletes (`guests_docs`, `settings`, `settings_options`).

```ts
await fql.guests_docs.softDeleteOne(3);
await fql.settings_options.softDeleteMany([4, 5]);
```

---

### `deleteOne(id)` / `deleteMany(ids[])`
Permanently removes record(s). Use with caution — no recovery.

```ts
await fql.inventory_logs.deleteOne(12);
```

---

### `auth(options)`
Authenticates a user against the `users` table.

```ts
const res = await fql.users.auth({
  body: { email: "admin@hotel.com", password: "admin" },
  fields: "id,name,email,client,bookings,orders,dashboard",
});
// res.result → User
// res.session → session token string
```

---

### `rawSql(queryName, sql, params?, options?)`
Executes a raw SQL query via a named endpoint. For complex aggregations only.

```ts
const res = await fql.payments.rawSql(
  "booking-revenue-summary",
  "SELECT booking_id, SUM(amount) as total FROM payments WHERE client = ? GROUP BY booking_id",
  [1]
);
// res.result → any[]
```

---

## Field Mapping

`GenericFQL` automatically maps between camelCase (TypeScript model) and snake_case (database columns) via the `fieldMap` passed to `createFQL`.

All hotel instances use `HOTEL_COMMON_FIELDS`:
```ts
const HOTEL_COMMON_FIELDS = {
  createdAt: "created_at",
  updatedAt: "updated_at",
};
```

Tables with soft-delete support additionally include:
```ts
const HOTEL_COMMON_FIELDS_WITH_DELETED = {
  createdAt: "created_at",
  updatedAt: "updated_at",
  isDeleted: "is_deleted",
};
```

---

## Automatic Behaviors

| Behavior | Detail |
|---|---|
| **Client filter** | Every `findMany` / `findOne` automatically appends `client:{client}` to the filter unless `isPublic: true` |
| **`is_deleted` filter** | Tables with `hasIsDeleted: true` automatically append `is_deleted:0` to hide soft-deleted records |
| **Pagination auto-fetch** | If total `count` exceeds the current page results, `findMany` fetches remaining pages automatically up to the requested `limit` |
| **Session auto-attach** | Reads `session` from `localStorage` and injects it into every request when `useSession: true` |
| **Session expiry** | If the API returns `"Invalid session!"`, `authActions.logout()` is called automatically |
| **`fromDb` mapping** | All API responses are mapped back from snake_case DB columns to camelCase model properties |

---

## Creating a Custom FQL Instance

Use `createFQL` when you need a one-off typed client not covered by the standard `fql` object:

```ts
import { createFQL } from "@/services/frontql/fqlClient";

const roomCatalogFql = createFQL<Room>(
  "rooms",           // resource/table name
  { createdAt: "created_at", updatedAt: "updated_at" }, // field map
  undefined,         // allowed fields (undefined = all)
  false,             // isPublic
  false              // hasIsDeleted
);

const res = await roomCatalogFql.findMany({ filter: "status:available" });
```
