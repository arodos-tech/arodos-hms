# Hotel Management System

A multi-role hotel management web application built with **React 19**, **TypeScript**, and **Vite**. It connects to a **FrontQL** backend and supports a full in-memory mock API for offline development.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Language | TypeScript 6 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM v7 |
| State Management | Valtio 2 |
| Backend Client | FrontQL (custom `fqlClient`) |
| Testing | Vitest + Testing Library + jsdom |
| Icons | HugeIcons React |
| Package Manager | pnpm |

---

## Features

- **Guest Management** — Register guests, attach ID documents, track stays
- **Room Booking** — Booking lifecycle: Booked → Checked In → Checked Out
- **Food & Restaurant Orders** — In-room dining and table orders with kitchen workflow
- **Inventory Management** — Track linen, amenities, kitchen raw materials, and assets
- **Payments & Transactions** — Multi-mode payments with GST/tax calculations
- **Invoice Generation** — Automatic invoice numbering with yearly counters
- **Bill-to-Company (BTC)** — Agent and corporate billing support
- **Settings** — Configurable hotel name, currency, tax rules, and room types
- **Role-Based Access Control** — Four staff roles with granular resource permissions

---

## Role-Based Access Control (RBAC)

| Resource | Admin | Receptionist | Kitchen Staff | Housekeeping |
|---|:---:|:---:|:---:|:---:|
| Rooms | ✅ Full | View, Edit | ❌ | View, Edit |
| Guests | ✅ Full | View, Create, Edit | ❌ | ❌ |
| Guest Docs | ✅ Full | View, Create, Edit | ❌ | ❌ |
| Bookings | ✅ Full | View, Create, Edit | ❌ | ❌ |
| Payments | ✅ Full | View, Create, Edit | ❌ | ❌ |
| Transactions | ✅ Full | View, Create | ❌ | ❌ |
| Orders | ✅ Full | View, Create, Edit | View, Edit | ❌ |
| Foods | ✅ Full | View only | View, Create, Edit | ❌ |
| Inventory | ✅ Full | View only | View, Edit | View, Create, Edit |
| Users | ✅ Full | ❌ | ❌ | ❌ |
| Settings | ✅ Full | ❌ | ❌ | ❌ |

---

## Domain Constants

**Booking Statuses:** `booked` · `checked_in` · `checked_out` · `cancelled`

**Room Statuses:** `available` · `booked` · `occupied` · `cleaning` · `maintenance`

**Payment Statuses:** `unpaid` · `partial` · `paid` · `refunded`

**Payment Modes:** `Cash` · `Card` · `UPI` · `Bank Transfer` · `Room Charge`

**Order Statuses:** `pending` · `preparing` · `delivered` · `cancelled`

**Tax Rates (GST):** 5% · 12% · 18%

---

## Project Structure

```
hotel-mgmt-system/
├── docs/
│   ├── code-style-guide.md   # Coding conventions (Pyramid style, RBAC, etc.)
│   ├── data-model.md         # Full database schema reference
│   ├── fqlClient.md          # FrontQL client usage guide
│   └── testing.md            # Testing setup and patterns
├── src/
│   ├── core/
│   │   ├── constants.ts      # Enums: roles, statuses, payment modes, tax rates
│   │   ├── models.ts         # TypeScript interfaces for all domain entities
│   │   └── rbac.ts           # RBAC policy matrix + hasPermission() helper
│   ├── services/
│   │   └── frontql/
│   │       ├── config.ts     # Dev / prod server URLs
│   │       ├── fqlClient.ts  # Typed FQL client (all table operations)
│   │       ├── Api.ts        # HTTP API adapter
│   │       ├── Mock_Api.ts   # In-memory mock with seed data
│   │       └── tokens.json   # Auth tokens (gitignored in prod)
│   ├── store/
│   │   ├── authStore.ts      # Auth state (user, session, login/logout actions)
│   │   └── uiState.ts        # Global UI state (sidebar, modals, loading)
│   ├── utils/
│   │   ├── billGenerator.ts  # Invoice/bill PDF generation
│   │   ├── csvExport.ts      # CSV download utility
│   │   ├── excelExport.ts    # Excel (.xlsx) export utility
│   │   ├── dateFormatter.ts  # Date formatting helpers
│   │   ├── relativeTimeFormatter.ts
│   │   ├── simpleCache.ts    # Lightweight in-memory cache
│   │   ├── hash.ts           # Hashing utilities
│   │   ├── images.ts         # Image URL helpers
│   │   ├── network.ts        # Network status detection
│   │   ├── uploads.ts        # File upload helpers
│   │   ├── random.ts         # Random ID/string generators
│   │   └── cn.ts             # Tailwind class merging utility
│   ├── hooks/                # Feature-level custom hooks
│   └── test/
│       └── fqlClient.test.ts # FQL client integration tests
└── public/
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 9

### Install Dependencies

```bash
pnpm install
```

### Environment

The FrontQL client reads the following env variable (optional — falls back to defaults):

```env
VITE_FQ_TOKEN_PATH=src/services/frontql/tokens.json
```

| Mode | Server URL | App Name |
|---|---|---|
| Development | `http://localhost:4466` | `test` |
| Production | `https://v7.frontql.dev` | `hms` |

### Run in Mock Mode (Offline)

The `Mock_Api.ts` driver provides seeded in-memory data so you can develop without a running backend. Toggle the client in `fqlClient.ts` to use `Mock_Api` instead of `Api`.

### Development Server

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

### Tests

```bash
pnpm vitest
```

---

## Authentication

Session state is managed by **Valtio** in `authStore.ts` and persisted to `localStorage`.

```ts
authActions.login(user, session)   // Persists user + session to localStorage
authActions.logout()               // Clears all auth state
authActions.verifySession()        // Validates session against the FQL backend on app load
```

---

## Documentation

| Document | Description |
|---|---|
| [Data Model](docs/data-model.md) | Entity schemas, field descriptions, and relationships |
| [FQL Client Guide](docs/fqlClient.md) | How to query, mutate, and use the mock client |
| [Code Style Guide](docs/code-style-guide.md) | Coding conventions, Pyramid sort, RBAC usage patterns |
| [Testing Guide](docs/testing.md) | Vitest setup, test patterns, and coverage strategy |
