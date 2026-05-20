# Code Style Guide

This guide outlines the development standards and architectural patterns for the Hotel Mgmt System project. It is designed to be AI-friendly and ensures consistency across the codebase.

---

## 1. Technological Stack

- **Framework**: React (Vite-based)
- **Styling**: Tailwind CSS with `cn` utility
- **State Management**: Valtio (using `proxy` and `useSnapshot`)
- **Icons**: Lucide React or Hugeicons
- **Validation**: Custom validators in `src/core/validators.ts`
- **Data Models**: Centralized interfaces in `src/core/models.ts`

---

## 2. Architectural Principles (SoC)

We strictly follow the **Separation of Concerns (SoC)** principle to keep components clean and maintainable.

### Custom Hooks for Logic

- All business logic, data fetching, and state transformations must reside in custom hooks (e.g., `useGuestList.ts`, `useRoomList.ts`).
- Hooks should return a simple object containing the state and handlers needed by the component.

### Focused UI Components

- Components should only handle layout and event delegation to hooks.
- Large components should be broken down into smaller, reusable components within their respective feature folders (e.g., `src/components/bookings/RoomGrid.tsx`, `src/components/bookings/RoomCard.tsx`).

---

## 3. Pyramid Code Style (AI-Friendly)

To maintain visual cleanliness and simplify AI parsing/editing, follow the "Pyramid" sorting rule.

### Line Length Sorting (Ascending)

- **Imports**: Group imports by source (External, Core, Components, Hooks) and sort lines within each group by ascending character length.
- **Interfaces/Props**: Sort property declarations by ascending line length within their blocks.
- **Hook Returns**: Sort returned object properties by ascending line length.
- **Object Initialization**: Sort key-value pairs by ascending line length.
- **Component Props**: When passing props to a child component, sort the attributes by ascending line length.

#### Example (Prop Sorting):

```tsx
<RoomCard
    room={room}
    viewMode={viewMode}
    bookingId={bookingId}
    isGuestCheckIn={isGuestCheckIn}
    onBookingToggle={onBookingToggle}
    onGuestSelection={onGuestSelection}
/>
```

---

## 4. State Management Patterns

- Use Valtio `proxy` for global or complex feature state.
- Use `useSnapshot` within components for reactive rendering.
- Avoid local `useState` for complex objects; prefer Valtio or state-derived values.
- Actions that mutate state should be centralized in `src/store/actions.ts`.

---

## 5. Styling Standards

- Use `cn()` from `@/utils/cn` for all class merging.
- Prefer Tailwind utility classes over custom CSS.
- Group layout classes (flex, grid, spacing) first, then decorative classes (colors, borders, effects).
- **Design Aesthetics**: Focus on premium, high-fidelity UI:
  - Use curated color palettes (Slate/Gray with vibrant accents like Blue-400, Emerald-400).
  - Implement glassmorphism and subtle gradients for depth.
  - Add micro-animations (hover transitions, active states) for feedback.
  - Ensure consistent spacing using Tailwind's 4-scale.

---

## 6. Function Standards

Functions are the primary unit of logic in this codebase. Keep them disciplined and predictable.

### Size & Responsibility

- **One function, one job.** If a function needs a multi-clause description, it should be split.
- Functions should fit on one screen (~30–40 lines). Extract helper functions if they exceed this.
- Prefer many small, named functions over one large anonymous block.

### Naming

- Use **verb-noun** naming that describes what the function does: `formatRoomPrice`, `validateCheckInDate`, `fetchGuestById`.
- Boolean-returning functions should start with `is`, `has`, or `can`: `isRoomAvailable`, `hasActiveBooking`.
- Event handlers should be prefixed with `handle`: `handleRoomSelect`, `handleFormSubmit`.
- Avoid vague names like `process`, `handle`, `doStuff`, or `update` without a subject noun.

### Purity & Idempotency

- Prefer **pure functions** for all transformations and calculations. A pure function returns the same output for the same input and has no side effects.
- Side-effecting functions (API calls, state mutations) should be clearly isolated in hooks or `actions.ts` — never mixed into pure utility logic.
- Avoid mutating function arguments. Return new objects/arrays instead.

```ts
// Bad - Mutates input
function applyDiscount(booking: Booking, rate: number) {
  booking.price = booking.price * rate; // BAD
}

// Good - Returns new value
function applyDiscount(booking: Booking, rate: number): Booking {
  return { ...booking, price: booking.price * rate };
}
```

### Parameters

- Limit functions to **3 positional parameters** maximum. Beyond that, destructure a config object.
- Always type all parameters explicitly. Never use `any`.

```ts
// Bad - Too many positional args
function createBooking(id: string, guestId: string, roomId: string, nights: number, discount: number) {}

// Good - Config object pattern
interface CreateBookingParams {
  id: string;
  nights: number;
  roomId: string;
  guestId: string;
  discount: number;
}
function createBooking({ id, nights, roomId, guestId, discount }: CreateBookingParams) {}
```

### Return Values

- Always define explicit return types for non-trivial functions.
- Return early to reduce nesting ("guard clauses"). Avoid deeply nested if/else trees.

```ts
// Bad - Deeply nested
function getDiscountedPrice(booking: Booking) {
  if (booking) {
    if (booking.isEligible) {
      if (booking.discount > 0) {
        return booking.price * (1 - booking.discount);
      }
    }
  }
  return null;
}

// Good - Early returns
function getDiscountedPrice(booking: Booking): number | null {
  if (!booking) return null;
  if (!booking.isEligible) return null;
  if (booking.discount <= 0) return null;
  return booking.price * (1 - booking.discount);
}
```

---

## 7. Comment Standards

Comments should explain **why**, not **what**. Code should be readable enough that *what* it does is self-evident.

### When to Comment

- **Do comment**: non-obvious business logic, performance trade-offs, workarounds for external limitations (APIs, browser quirks), and complex algorithms.
- **Don't comment**: self-explanatory code, restating what the code does, or commented-out dead code (delete it; use git instead).

```ts
// Bad - Redundant comment
// Multiply price by discount rate
const finalPrice = price * discountRate;

// Good - Explains the "why"
// Backend returns prices in minor units (paise); convert to rupees for display
const displayPrice = rawPrice / 100;
```

### JSDoc for Public Interfaces

Use JSDoc on all **exported functions, hooks, and complex types** — especially those used across feature boundaries. Keep it concise.

```ts
/**
 * Calculates the total cost for a booking including taxes and applicable discounts.
 * Does NOT account for loyalty rewards — apply those separately via `applyLoyaltyCredit`.
 */
export function calculateBookingTotal(booking: Booking, taxRate: number): number { ... }
```

### TODO / FIXME Convention

Use structured tags so they're searchable and actionable:

```ts
// TODO(username): Replace with real pagination once API v2 is live
// FIXME: Race condition if user submits twice quickly — debounce or lock needed
// HACK: Valtio snapshot not updating on nested array push; using spread as workaround
```

- `TODO` — planned improvement, not urgent.
- `FIXME` — known bug or fragile code that needs attention.
- `HACK` — intentional workaround; must include *why* the hack exists.

### Section Dividers (Large Files Only)

For files exceeding ~200 lines, use consistent section dividers to aid navigation:

```ts
// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── Selectors ────────────────────────────────────────────────────────────────

// ─── Actions ──────────────────────────────────────────────────────────────────
```

---

## 8. TypeScript Standards

- All types and interfaces live in `src/core/models.ts` unless they are strictly local to a single file.
- Prefer `interface` over `type` for object shapes; use `type` for unions, intersections, and aliases.
- Never use `any`. Use `unknown` when the type is genuinely indeterminate, and narrow it explicitly.
- Use `readonly` for properties that should not be mutated after initialization.
- Avoid non-null assertions (`!`). Use optional chaining (`?.`) and nullish coalescing (`??`) instead.

```ts
// Bad - Suppresses type safety
const name = guest!.profile!.name;

// Good - Explicit and safe
const name = guest?.profile?.name ?? 'Guest';
```

---

## 9. Error Handling

- Never swallow errors silently with empty `catch` blocks.
- Async functions in hooks should catch errors and expose them via a typed `error` state, not `console.error` alone.
- Use `Result`-style patterns or typed error states for user-facing operations (form submissions, API calls).

```ts
// Bad - Silent failure
try {
  await submitBooking(data);
} catch (_) {}

// Good - Surfaced and handled
try {
  await submitBooking(data);
} catch (err) {
  const message = err instanceof Error ? err.message : 'Booking failed. Please try again.';
  setError(message);
}
```

---

## 10. File & Folder Conventions

- **Feature folders** contain the component, its hook(s), and any sub-components — nothing else.
- File names use `PascalCase` for components (`RoomCard.tsx`) and `camelCase` for hooks and utilities (`useRoomList.ts`, `formatDate.ts`).
- Index files (`index.ts`) are allowed for clean re-exports from feature folders but should not contain logic.
- Keep files focused: if a file exceeds ~250 lines, consider splitting by concern.

```
src/
  components/
    features/
      booking/
        BookingRow.tsx        ← component
        BookingRowCells.tsx   ← sub-component
        useBookingRow.ts      ← hook
        index.ts              ← re-exports only
  core/
    models.ts
    validators.ts
  store/
    actions.ts
```

---

## 11. Development Guidelines

- Always provide full context (models, types) when working on new features.
- Keep functions small and idempotent.
- Ensure all types are explicitly defined in `models.ts` instead of using `any`.
- Document complex aggregation logic in `selectors.ts`.
- When refactoring, maintain the Pyramid Style for all modified blocks.
- Remove dead code instead of commenting it out — git history is the backup.
- Run the linter and type-checker before submitting any PR. No `@ts-ignore` without a comment explaining why.