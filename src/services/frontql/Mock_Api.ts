import type {
  Booking,
  BookingRoom,
  Company,
  Food,
  GuestOrderedFood,
  GuestOrder,
  Guest,
  GuestDoc,
  Inventory,
  InventoryLog,
  InvoiceNoCounter,
  Order,
  OrderFood,
  Payment,
  Setting,
  SettingOption,
  Transaction,
  User,
  UserActivity,
} from "@/core/models";

type HttpMethod = "get" | "post" | "put" | "delete" | "sql";

type RequestOptions = {
  loading?: boolean;
  body?: any;
  key?: string;
  page?: string;
  sort?: string;
  joins?: string;
  filter?: string;
  search?: string;
  nearby?: string;
  hidden?: string;
  fields?: string;
  expiry?: number;
  session?: string;
  validation?: string;
  permissions?: string;
};

const MOCK_DB: Record<string, any[]> = {
  users: [
    {
      id: 1,
      name: "Grand Palace Admin",
      phone: "9876543210",
      email: "admin@hotel.com",
      password: "admin",
      client: 1,
      bookings: { view: true, create: true, edit: true },
      orders: { view: true, create: true, edit: true },
      dashboard: { view: true },
      accounts: { view: true },
      hotel_inventory: { view: true, edit: true },
      kitchen_inventory: { view: true, edit: true },
      master_data: { view: true, edit: true },
      users: { view: true, edit: true },
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    }
  ],
  settings: [
    { id: 1, key_name: "hotel_name", name: "Hotel Grand Palace", details: { value: "Hotel Grand Palace" }, client: 1, is_deleted: 0, createdAt: Date.now(), updatedAt: Date.now() },
    { id: 2, key_name: "currency", name: "Currency", details: { symbol: "₹", code: "INR" }, client: 1, is_deleted: 0, createdAt: Date.now(), updatedAt: Date.now() },
    { id: 3, key_name: "tax_rules", name: "Tax Rules", details: { cgst: 6, sgst: 6, luxury_tax: 0 }, client: 1, is_deleted: 0, createdAt: Date.now(), updatedAt: Date.now() }
  ],
  settings_options: [
    { id: 1, key_name: "room_types", name: "Deluxe Suite", client: 1, is_deleted: 0, createdAt: Date.now(), updatedAt: Date.now() },
    { id: 2, key_name: "room_types", name: "Super Deluxe Room", client: 1, is_deleted: 0, createdAt: Date.now(), updatedAt: Date.now() },
    { id: 3, key_name: "room_types", name: "Executive Suite", client: 1, is_deleted: 0, createdAt: Date.now(), updatedAt: Date.now() }
  ],
  guests: [
    {
      id: 1,
      name: "Rohan Sharma",
      phone: 9876543210,
      email: "rohan.sharma@example.com",
      nationality: "Indian",
      country: "India",
      state: "Maharashtra",
      city: "Mumbai",
      pin: 400001,
      address: "Flat 4A, Nariman Point",
      image: "",
      guest_type: "VIP",
      client: 1,
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      id: 2,
      name: "Emily Watson",
      phone: 9123456789,
      email: "emily.watson@example.com",
      nationality: "British",
      country: "United Kingdom",
      state: "London",
      city: "London",
      pin: 12345,
      address: "221B Baker St",
      image: "",
      guest_type: "Corporate",
      client: 1,
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    }
  ],
  guests_docs: [
    {
      id: 1,
      guest_id: 1,
      name: "Rohan Sharma Aadhaar",
      doc_type: "Aadhaar Card",
      doc_number: "1234-5678-9012",
      exp_date: "",
      doc_image: "",
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      booking_id: 1,
      other_details: {},
      stayed_room_no: "101",
      phone: 9876543210,
      email: "rohan.sharma@example.com",
      address: "Flat 4A, Nariman Point",
      is_deleted: 0,
      client: 1
    }
  ],
  bookings: [
    {
      id: 1,
      guest_id: 1,
      guest_name: "Rohan Sharma",
      phone: 9876543210,
      total_guests: 2,
      status: "checked_in",
      room_price: 4500,
      order_price: 380,
      total_room_taxes: 540,
      total_price: 5420,
      payment_advance: 2000,
      payment_status: "partial",
      booked_rooms: "101",
      complete_booking: 0,
      booked_from: "2026-05-20 12:00:00",
      booked_to: "2026-05-22 11:00:00",
      is_btc: 0,
      discount: 0,
      btc_company: "",
      btc_agent: "",
      btc_member: "",
      invoice_no: 26052001,
      invoice: "INV-26052001",
      user_id: 1,
      invoice_date: "2026-05-20 12:00:00",
      damage_details: {},
      late_charge: 0,
      client: 1,
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now()
    },
    {
      id: 2,
      guest_id: 2,
      guest_name: "Emily Watson",
      phone: 9123456789,
      total_guests: 1,
      status: "booked",
      room_price: 5500,
      order_price: 0,
      total_room_taxes: 660,
      total_price: 6160,
      payment_advance: 6160,
      payment_status: "paid",
      booked_rooms: "202",
      complete_booking: 0,
      booked_from: "2026-05-21 14:00:00",
      booked_to: "2026-05-25 11:00:00",
      is_btc: 0,
      discount: 0,
      btc_company: "",
      btc_agent: "",
      btc_member: "",
      invoice_no: 26052002,
      invoice: "INV-26052002",
      user_id: 1,
      invoice_date: "2026-05-21 14:00:00",
      damage_details: {},
      late_charge: 0,
      client: 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ],
  bookings_rooms: [
    {
      id: 1,
      booking_id: 1,
      checked_out_time: "",
      guest_id: 1,
      room_id: 101,
      checked_in_date: "2026-05-20",
      checked_in_time: "12:00:00",
      checked_out_date: "2026-05-22",
      status: "checked_in",
      availed_features: [],
      availed_features_price: 0,
      damage_price: 0,
      room_price: 4500,
      room_tax: 540,
      extra_guest: {},
      is_grace_enabled: 0,
      rent_duration: 2,
      is_transferred: 0,
      transferred_from: 0,
      remarks: "Welcome soft drinks served",
      transfer_type: "",
      client: 1,
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now()
    },
    {
      id: 2,
      booking_id: 2,
      checked_out_time: "",
      guest_id: 2,
      room_id: 202,
      checked_in_date: "2026-05-21",
      checked_in_time: "",
      checked_out_date: "2026-05-25",
      status: "booked",
      availed_features: [],
      availed_features_price: 0,
      damage_price: 0,
      room_price: 5500,
      room_tax: 660,
      extra_guest: {},
      is_grace_enabled: 0,
      rent_duration: 4,
      is_transferred: 0,
      transferred_from: 0,
      remarks: "High floor requested",
      transfer_type: "",
      client: 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ],
  foods: [
    { id: 1, name: "Veg Club Sandwich", category: "Snacks", price: 180, rs_price: 200, tax: 5, client: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: 2, name: "Butter Chicken with Naan", category: "Main Course", price: 350, rs_price: 380, tax: 18, client: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: 3, name: "Paneer Tikka Masala", category: "Main Course", price: 290, rs_price: 320, tax: 18, client: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: 4, name: "Cappuccino Coffee", category: "Beverages", price: 120, rs_price: 130, tax: 5, client: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: 5, name: "Fresh Lime Soda", category: "Beverages", price: 80, rs_price: 90, tax: 5, client: 1, createdAt: Date.now(), updatedAt: Date.now() }
  ],
  guest_orders: [
    {
      id: 1,
      booking_id: 1,
      guest_id: 1,
      room_no: "101",
      table_no: "",
      customer_name: "Rohan Sharma",
      customer_phone: 9876543210,
      status: "delivered",
      total_price: 380,
      total_taxes: 68.4,
      payment_status: "unpaid",
      payment_mode: "room",
      order_type: "room-service",
      room_id: 101,
      table_id: 0,
      discount: 0,
      packaging_charge: 0,
      ordered_on: "2026-05-20 15:30:00",
      remarks: "Extra spicy butter chicken",
      details: {},
      client: 1,
      createdAt: Date.now() - 12 * 60 * 60 * 1000,
      updatedAt: Date.now() - 11 * 60 * 60 * 1000
    }
  ],
  guest_ordered_foods: [
    {
      id: 1,
      order_id: 1,
      food_id: 2,
      food_name: "Butter Chicken with Naan",
      quantity: 1,
      status: "delivered",
      price: 380,
      total_price: 380,
      total_taxes: 68.4,
      food_tax: 18,
      booking_id: 1,
      client: 1,
      createdAt: Date.now() - 12 * 60 * 60 * 1000,
      updatedAt: Date.now() - 11 * 60 * 60 * 1000
    }
  ],
  inventory: [
    { id: 1, name: "Luxury King Bed Sheets", type: "Linen", quantity: 60, used_quantity: 24, price: 850, category: "Housekeeping", remarks: "100% Egyptian Cotton", client: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: 2, name: "White Cotton Pillow Covers", type: "Linen", quantity: 120, used_quantity: 48, price: 180, category: "Housekeeping", remarks: "Plush quality", client: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: 3, name: "Premium Toiletries Kit", type: "Consumables", quantity: 300, used_quantity: 75, price: 45, category: "Guest Amenities", remarks: "Includes branded soap, shampoo, comb", client: 1, createdAt: Date.now(), updatedAt: Date.now() }
  ],
  inventory_logs: [
    {
      id: 1,
      item_id: 3,
      item_name: "Premium Toiletries Kit",
      room_id: 101,
      room_no: "101",
      food_id: 0,
      food_name: "",
      other_used_area: "",
      quantity: 2,
      before_quantity: 300,
      type: "issue",
      log_type: "room",
      remarks: "Replenished during check-in",
      details: {},
      price: 45,
      department: "Housekeeping",
      issued_person: "Staff Sunil",
      category: "Guest Amenities",
      client: 1,
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000
    }
  ],
  invoice_no_counter: [
    { id: 1, year_key: "2026", type: "booking", value: 2, client: 1, createdAt: Date.now(), updatedAt: Date.now() }
  ],
  orders: [],
  orders_foods: [],
  payments: [
    {
      id: 1,
      guest_id: 1,
      booking_id: 1,
      order_id: 0,
      room_no: "101",
      type: "advance",
      amount: 2000,
      tax: 0,
      mode: "UPI",
      bank: "State Bank of India",
      details: { transaction_id: "UPI98372648102" },
      payment_date: "2026-05-20 12:05:00",
      customer_type: "individual",
      gst: 0,
      is_cancelled: 0,
      total: 2000,
      client: 1,
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000
    }
  ],
  transactions: [
    {
      id: 1,
      invoice: "INV-26052001",
      guest_id: 1,
      booking_id: 1,
      order_id: 0,
      room_no: "101",
      type: "income",
      amount: 2000,
      tax: 0,
      mode: "UPI",
      bank: "State Bank of India",
      details: { transaction_id: "UPI98372648102" },
      payment_date: "2026-05-20 12:05:00",
      customer_type: "individual",
      gst: "0",
      is_cancelled: 0,
      total: 2000,
      hsn_no: "",
      client: 1,
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000
    }
  ],
  companies: [
    { id: 1, name: "Infosys Technologies Ltd", address: "Electronic City, Bangalore", gst: "29AAAAA1111A1Z1", key_name: "infosys", client: 1, createdAt: Date.now(), updatedAt: Date.now() }
  ],
  users_activities: [
    { id: 1, activity: "admin_login", data: { ip: "127.0.0.1" }, client: 1, createdAt: Date.now(), updatedAt: Date.now() }
  ]
};

let idCounter = 100;
function getNextId() {
  return idCounter++;
}

const makeRequest = async (method: HttpMethod, endpoint: string, options: RequestOptions = {}): Promise<any> => {
  const cleanPath = endpoint.startsWith("/") ? endpoint.substring(1) : endpoint;

  await new Promise(resolve => setTimeout(resolve, 150));

  if (cleanPath.startsWith("auth-")) {
    const resource = cleanPath.split("-")[1];
    const table = MOCK_DB[resource] || [];
    const { body } = options;

    if (method === "post" && body) {
      const { email, password } = body;
      const user = table.find(u => u.email === email && u.password === password);
      if (user) {
        return {
          result: { ...user },
          session: "mock-session-token-98765"
        };
      }
      return { err: "Invalid credentials! User not found or incorrect password." };
    }
  }

  if (cleanPath.startsWith("sql-")) {
    return { result: [], count: 0 };
  }

  const pathParts = cleanPath.split("/");
  const resource = pathParts[0];
  const table = MOCK_DB[resource];

  if (!table) {
    return { err: `Resource '${resource}' not found in Mock DB!` };
  }

  if (method === "post") {
    const { body } = options;
    if (Array.isArray(body)) {
      const newItems = body.map(item => {
        const newItem = {
          ...item,
          id: item.id || getNextId(),
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        table.push(newItem);
        return newItem;
      });
      return { result: newItems };
    } else {
      const newItem = {
        ...body,
        id: body.id || getNextId(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      table.push(newItem);
      return { result: newItem };
    }
  }

  if (method === "put") {
    const idParam = pathParts[1];
    const { body } = options;

    if (idParam) {
      const id = isNaN(Number(idParam)) ? idParam : Number(idParam);
      const index = table.findIndex(item => item.id === id);
      if (index !== -1) {
        table[index] = { ...table[index], ...body, updatedAt: Date.now() };
        return { result: table[index] };
      }
      return { err: `Item with id ${id} not found in ${resource}!` };
    } else if (Array.isArray(body)) {
      const updatedItems = body.map(update => {
        const id = isNaN(Number(update.id)) ? update.id : Number(update.id);
        const index = table.findIndex(item => item.id === id);
        if (index !== -1) {
          table[index] = { ...table[index], ...update, updatedAt: Date.now() };
          return table[index];
        }
        return null;
      }).filter(Boolean);
      return { result: updatedItems };
    }
  }

  if (method === "delete") {
    const idParam = pathParts[1];
    if (idParam) {
      const ids = idParam.split(",").map(id => isNaN(Number(id)) ? id : Number(id));
      MOCK_DB[resource] = table.filter(item => !ids.includes(item.id));
      return { result: true };
    }
    return { err: "Missing ID parameter for DELETE request!" };
  }

  if (method === "get") {
    const idParam = pathParts[1];

    if (idParam) {
      const ids = idParam.split(",").map(id => isNaN(Number(id)) ? id : Number(id));
      if (ids.length > 1) {
        const results = table.filter(item => ids.includes(item.id));
        return { result: results, count: results.length };
      } else {
        const result = table.find(item => item.id === ids[0]);
        return { result: result || null };
      }
    }

    let filteredList = [...table];

    const optionsFilter = options.filter || "";
    if (optionsFilter.includes("is_deleted:0") || !optionsFilter.includes("is_deleted")) {
      filteredList = filteredList.filter(item => item.is_deleted !== 1 && item.isDeleted !== 1);
    }

    if (optionsFilter.includes("client:")) {
      const clientMatch = optionsFilter.match(/client:(\d+)/);
      if (clientMatch) {
        const clientId = Number(clientMatch[1]);
        filteredList = filteredList.filter(item => item.client === clientId);
      }
    }

    const optionsSearch = options.search || "";
    if (optionsSearch) {
      const searchParts = optionsSearch.split(",");
      searchParts.forEach(part => {
        const [key, val] = part.split(":");
        if (key && val !== undefined) {
          const expectedVal = val.toLowerCase().trim();
          filteredList = filteredList.filter(item => {
            const itemVal = item[key];
            if (itemVal === undefined || itemVal === null) return false;
            return String(itemVal).toLowerCase().includes(expectedVal);
          });
        }
      });
    }

    const optionsSort = options.sort || "";
    if (optionsSort) {
      const isDescending = optionsSort.startsWith("-");
      const field = isDescending ? optionsSort.substring(1) : optionsSort;

      filteredList.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];

        if (valA === undefined || valB === undefined) return 0;
        if (typeof valA === "number" && typeof valB === "number") {
          return isDescending ? valB - valA : valA - valB;
        }
        return isDescending
          ? String(valB).localeCompare(String(valA))
          : String(valA).localeCompare(String(valB));
      });
    }

    const totalCount = filteredList.length;

    const optionsPage = options.page || "";
    if (optionsPage) {
      const [pageNum, pageSize] = optionsPage.split(",").map(Number);
      if (pageNum && pageSize) {
        const start = (pageNum - 1) * pageSize;
        filteredList = filteredList.slice(start, start + pageSize);
      }
    }

    return {
      result: filteredList,
      count: totalCount
    };
  }

  return { err: `Unsupported HTTP method '${method.toUpperCase()}'!` };
};

const Api = {
  get: async (endpoint: string, options?: RequestOptions): Promise<any> => makeRequest("get", endpoint, options),
  put: async (endpoint: string, options?: RequestOptions): Promise<any> => makeRequest("put", endpoint, options),
  post: async (endpoint: string, options?: RequestOptions): Promise<any> => makeRequest("post", endpoint, options),
  delete: async (endpoint: string, options?: RequestOptions): Promise<any> => makeRequest("delete", endpoint, options),
  sql: async (endpoint: string, options?: RequestOptions): Promise<any> =>
    makeRequest("post", `/sql-${endpoint.replace("/", "")}`, options),
};

export default Api;
