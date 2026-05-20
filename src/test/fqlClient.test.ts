import { describe, it, expect, beforeEach } from "vitest";
import { fql } from "@/services/frontql/fqlClient";

/**
 * FQL Client Integration Tests
 * All tests run against Mock_Api.ts in-memory database.
 * No network calls, no external dependencies.
 */

// ─── Guests ────────────────────────────────────────────────────────────────

describe("fql.guests", () => {
    it("findMany returns all seeded guests", async () => {
        const res = await fql.guests.findMany();
        expect(res.result).toBeDefined();
        expect(Array.isArray(res.result)).toBe(true);
        expect(res.result!.length).toBeGreaterThanOrEqual(2);
    });

    it("findOne returns a single guest by id", async () => {
        const res = await fql.guests.findOne(1);
        expect(res.result).toBeDefined();
        expect(res.result!.id).toBe(1);
        expect(res.result!.name).toBe("Rohan Sharma");
    });

    it("createOne adds a new guest and returns it with an id", async () => {
        const res = await fql.guests.createOne({
            name: "Test Guest",
            phone: 9000000000,
            email: "test@example.com",
            client: 1,
        });
        expect(res.result).toBeDefined();
        expect(res.result!.id).toBeDefined();
        expect(res.result!.name).toBe("Test Guest");
    });

    it("updateOne modifies the guest record", async () => {
        const res = await fql.guests.updateOne(2, { guest_type: "VIP" });
        expect(res.result).toBeDefined();
        expect(res.result!.guest_type).toBe("VIP");
    });

    it("findMany with sort returns ordered results", async () => {
        const res = await fql.guests.findMany({ sort: "-id" });
        const ids = res.result!.map(g => g.id!);
        expect(ids[0]).toBeGreaterThan(ids[ids.length - 1]);
    });

    it("findMany with page + limit returns a subset", async () => {
        const res = await fql.guests.findMany({ page: 1, limit: 1 });
        expect(res.result!.length).toBe(1);
    });

    it("findManyIds returns records for specified ids", async () => {
        const res = await fql.guests.findManyIds([1, 2]);
        expect(res.result!.length).toBe(2);
    });
});

// ─── Bookings ───────────────────────────────────────────────────────────────

describe("fql.bookings", () => {
    it("findMany returns all seeded bookings", async () => {
        const res = await fql.bookings.findMany();
        expect(res.result!.length).toBeGreaterThanOrEqual(2);
    });

    it("findMany with where filter narrows results", async () => {
        const res = await fql.bookings.findMany({ where: { guest_id: 1 } });
        expect(res.result!.every(b => b.guest_id === 1)).toBe(true);
    });

    it("findOne returns the correct booking", async () => {
        const res = await fql.bookings.findOne(1);
        expect(res.result!.guest_name).toBe("Rohan Sharma");
        expect(res.result!.status).toBe("checked_in");
    });

    it("createOne creates a new booking", async () => {
        const res = await fql.bookings.createOne({
            guest_id: 1,
            guest_name: "Rohan Sharma",
            status: "booked",
            client: 1,
        });
        expect(res.result!.id).toBeDefined();
        expect(res.result!.status).toBe("booked");
    });

    it("updateOne changes booking status to checked_out", async () => {
        const res = await fql.bookings.updateOne(1, {
            status: "checked_out",
            complete_booking: 1,
        });
        expect(res.result!.status).toBe("checked_out");
        expect(res.result!.complete_booking).toBe(1);
    });
});

// ─── Foods ──────────────────────────────────────────────────────────────────

describe("fql.foods", () => {
    it("findMany returns all 5 seeded food items", async () => {
        const res = await fql.foods.findMany();
        expect(res.result!.length).toBeGreaterThanOrEqual(5);
    });

    it("findOne returns correct food item", async () => {
        const res = await fql.foods.findOne(1);
        expect(res.result!.name).toBe("Veg Club Sandwich");
        expect(res.result!.tax).toBe(5);
    });

    it("createOne adds a new food item", async () => {
        const res = await fql.foods.createOne({
            name: "Masala Chai",
            category: "Beverages",
            price: 60,
            rs_price: 70,
            tax: 5,
            client: 1,
        });
        expect(res.result!.name).toBe("Masala Chai");
        expect(res.result!.id).toBeDefined();
    });

    it("updateOne changes food price", async () => {
        const res = await fql.foods.updateOne(1, { price: 200 });
        expect(res.result!.price).toBe(200);
    });
});

// ─── Payments ───────────────────────────────────────────────────────────────

describe("fql.payments", () => {
    it("findMany returns seeded payments", async () => {
        const res = await fql.payments.findMany();
        expect(res.result!.length).toBeGreaterThanOrEqual(1);
    });

    it("createOne records a new payment", async () => {
        const res = await fql.payments.createOne({
            booking_id: 1,
            guest_id: 1,
            type: "final",
            amount: 3420,
            mode: "Cash",
            total: 3420,
            client: 1,
        });
        expect(res.result!.amount).toBe(3420);
        expect(res.result!.mode).toBe("Cash");
    });
});

// ─── Settings ────────────────────────────────────────────────────────────── 

describe("fql.settings", () => {
    it("findMany returns only non-deleted settings", async () => {
        const res = await fql.settings.findMany();
        // hasIsDeleted: true means is_deleted:0 is auto-applied
        expect(res.result!.every(s => s.is_deleted !== 1)).toBe(true);
    });

    it("findOne returns a setting by id", async () => {
        const res = await fql.settings.findOne(1);
        expect(res.result!.key_name).toBe("hotel_name");
    });
});

// ─── Inventory ──────────────────────────────────────────────────────────────

describe("fql.inventory", () => {
    it("findMany returns all inventory items", async () => {
        const res = await fql.inventory.findMany();
        expect(res.result!.length).toBeGreaterThanOrEqual(3);
    });

    it("createOne adds a new inventory item", async () => {
        const res = await fql.inventory.createOne({
            name: "Hand Soap Dispenser",
            category: "Guest Amenities",
            type: "Consumables",
            quantity: 50,
            price: 120,
            client: 1,
        });
        expect(res.result!.name).toBe("Hand Soap Dispenser");
    });
});

// ─── Soft Delete ─────────────────────────────────────────────────────────────

describe("soft delete behaviour", () => {
    it("softDeleteOne sets is_deleted to 1", async () => {
        const createRes = await fql.guests_docs.createOne({
            guest_id: 1,
            doc_type: "Passport",
            doc_number: "A1234567",
            client: 1,
            is_deleted: 0,
        });
        const newId = createRes.result!.id!;
        await fql.guests_docs.softDeleteOne(newId);

        // findMany with hasIsDeleted:true should now exclude the record
        const listRes = await fql.guests_docs.findMany();
        expect(listRes.result!.find(d => d.id === newId)).toBeUndefined();
    });
});

// ─── Auth ────────────────────────────────────────────────────────────────────

describe("fql.users.auth", () => {
    it("returns user + session on valid credentials", async () => {
        const res = await fql.users.auth({
            body: { email: "admin@hotel.com", password: "admin" },
            fields: "id,name,email,client",
        });
        expect(res.result).toBeDefined();
        expect(res.result!.email).toBe("admin@hotel.com");
        expect(res.session).toBeDefined();
    });

    it("returns err on invalid credentials", async () => {
        const res = await fql.users.auth({
            body: { email: "admin@hotel.com", password: "wrongpassword" },
        });
        expect(res.err).toBeTruthy();
        expect(res.result).toBeUndefined();
    });
});

// ─── CRUD lifecycle ──────────────────────────────────────────────────────────

describe("full CRUD lifecycle on guest_orders", () => {
    let createdId: number;

    it("creates a new order", async () => {
        const res = await fql.guest_orders.createOne({
            booking_id: 1,
            guest_id: 1,
            room_no: "101",
            status: "pending",
            order_type: "room-service",
            total_price: 180,
            total_taxes: 9,
            payment_status: "unpaid",
            client: 1,
        });
        expect(res.result!.id).toBeDefined();
        createdId = res.result!.id!;
    });

    it("fetches the created order by id", async () => {
        const res = await fql.guest_orders.findOne(createdId);
        expect(res.result!.status).toBe("pending");
    });

    it("updates order status to delivered", async () => {
        const res = await fql.guest_orders.updateOne(createdId, { status: "delivered" });
        expect(res.result!.status).toBe("delivered");
    });

    it("deletes the order permanently", async () => {
        await fql.guest_orders.deleteOne(createdId);
        const res = await fql.guest_orders.findOne(createdId);
        expect(res.result).toBeFalsy();
    });
});
