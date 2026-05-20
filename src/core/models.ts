export interface Booking {
    id?: number;
    details?: any;
    phone?: number;
    status?: string;
    is_btc?: number;
    client?: number;
    invoice?: string;
    user_id?: number;
    guest_id?: number;
    discount?: number;
    createdAt?: number;
    updatedAt?: number;
    booked_to?: string;
    btc_agent?: string;
    room_price?: number;
    btc_member?: string;
    invoice_no?: number;
    guest_name?: string;
    order_price?: number;
    total_price?: number;
    damage_details?: any;
    late_charge?: number;
    booked_from?: string;
    btc_company?: string;
    total_guests?: number;
    booked_rooms?: string;
    invoice_date?: string;
    payment_status?: string;
    payment_advance?: number;
    total_room_taxes?: number;
    complete_booking?: number;
    total_order_taxes?: number;
}

export interface BookingRoom {
    id?: number;
    status?: string;
    client?: number;
    room_id?: number;
    room_no?: string;
    remarks?: string;
    guest_id?: number;
    room_tax?: number;
    extra_guest?: any;
    createdAt?: number;
    updatedAt?: number;
    booking_id?: number;
    room_price?: number;
    damage_price?: number;
    availed_features?: any;
    rent_duration?: number;
    transfer_type?: string;
    is_transferred?: number;
    checked_in_date?: string;
    checked_in_time?: string;
    checked_out_time?: string;
    checked_out_date?: string;
    is_grace_enabled?: number;
    transferred_from?: number;
    availed_features_price?: number;
}

export interface Company {
    id?: number;
    gst?: string;
    name?: string;
    client?: number;
    address?: string;
    key_name?: string;
    createdAt?: number;
    updatedAt?: number;
}

export interface Food {
    id?: number;
    tax?: number;
    name?: string;
    price?: number;
    client?: number;
    category?: string;
    rs_price?: number;
    createdAt?: number;
    updatedAt?: number;
}

export interface GuestOrderedFood {
    id?: number;
    price?: number;
    status?: string;
    client?: number;
    food_id?: number;
    order_id?: number;
    quantity?: number;
    food_tax?: number;
    food_name?: string;
    createdAt?: number;
    updatedAt?: number;
    booking_id?: number;
    total_price?: number;
    total_taxes?: number;
}

export interface GuestOrder {
    id?: number;
    details?: any;
    status?: string;
    client?: number;
    room_no?: string;
    room_id?: number;
    remarks?: string;
    guest_id?: number;
    table_no?: string;
    table_id?: number;
    discount?: number;
    createdAt?: number;
    updatedAt?: number;
    booking_id?: number;
    order_type?: string;
    ordered_on?: string;
    total_price?: number;
    total_taxes?: number;
    payment_mode?: string;
    customer_name?: string;
    customer_phone?: number;
    payment_status?: string;
    packaging_charge?: number;
}

export interface Guest {
    id?: number;
    pin?: number;
    name?: string;
    city?: string;
    phone?: number;
    email?: string;
    state?: string;
    image?: string;
    client?: number;
    country?: string;
    address?: string;
    createdAt?: number;
    updatedAt?: number;
    guest_type?: string;
    nationality?: string;
}

export interface GuestDoc {
    id?: number;
    name?: string;
    phone?: number;
    email?: string;
    client?: number;
    address?: string;
    guest_id?: number;
    doc_type?: string;
    exp_date?: string;
    doc_image?: string;
    createdAt?: number;
    updatedAt?: number;
    doc_number?: string;
    booking_id?: number;
    other_details?: any;
    is_deleted?: number;
    stayed_room_no?: string;
}

export interface Inventory {
    id?: number;
    name?: string;
    type?: string;
    details?: any;
    price?: number;
    client?: number;
    remarks?: string;
    quantity?: number;
    category?: string;
    createdAt?: number;
    updatedAt?: number;
    used_quantity?: number;
}

export interface InventoryLog {
    id?: number;
    type?: string;
    details?: any;
    price?: number;
    client?: number;
    item_id?: number;
    room_id?: number;
    room_no?: string;
    food_id?: number;
    remarks?: string;
    quantity?: number;
    log_type?: string;
    category?: string;
    item_name?: string;
    food_name?: string;
    createdAt?: number;
    updatedAt?: number;
    department?: string;
    issued_person?: string;
    other_used_area?: string;
    before_quantity?: number;
}

export interface InvoiceNoCounter {
    id?: number;
    type?: string;
    value?: number;
    client?: number;
    year_key?: string;
    createdAt?: number;
    updatedAt?: number;
}

export interface Order {
    id?: number;
    details?: any;
    status?: string;
    client?: number;
    room_no?: string;
    room_id?: number;
    remarks?: string;
    invoice?: string;
    user_id?: number;
    guest_id?: number;
    table_no?: string;
    table_id?: number;
    discount?: number;
    createdAt?: number;
    updatedAt?: number;
    booking_id?: number;
    order_type?: string;
    ordered_on?: string;
    invoice_no?: number;
    total_price?: number;
    total_taxes?: number;
    payment_mode?: string;
    customer_name?: string;
    customer_phone?: number;
    payment_status?: string;
    packaging_charge?: number;
}

export interface OrderFood {
    id?: number;
    tax?: string;
    price?: number;
    status?: string;
    client?: number;
    food_id?: number;
    order_id?: number;
    quantity?: number;
    food_tax?: number;
    food_name?: string;
    createdAt?: number;
    updatedAt?: number;
    booking_id?: number;
    total_price?: number;
    total_taxes?: number;
}

export interface Payment {
    id?: number;
    tax?: number;
    gst?: number;
    type?: string;
    mode?: string;
    bank?: string;
    details?: any;
    total?: number;
    amount?: number;
    client?: number;
    room_no?: string;
    guest_id?: number;
    order_id?: number;
    createdAt?: number;
    updatedAt?: number;
    booking_id?: number;
    payment_date?: string;
    is_cancelled?: number;
    customer_type?: string;
}

export interface Setting {
    id?: number;
    details?: any;
    name?: string;
    client?: number;
    key_name?: string;
    createdAt?: number;
    updatedAt?: number;
    is_deleted?: number;
}

export interface SettingOption {
    id?: number;
    name?: string;
    client?: number;
    key_name?: string;
    createdAt?: number;
    updatedAt?: number;
    is_deleted?: number;
}

export interface Transaction {
    id?: number;
    tax?: number;
    gst?: string;
    type?: string;
    mode?: string;
    bank?: string;
    details?: any;
    total?: number;
    amount?: number;
    hsn_no?: string;
    client?: number;
    invoice?: string;
    room_no?: string;
    guest_id?: number;
    order_id?: number;
    createdAt?: number;
    updatedAt?: number;
    booking_id?: number;
    payment_date?: string;
    is_cancelled?: number;
    customer_type?: string;
}

export interface User {
    id?: number;
    users?: any;
    orders?: any;
    name?: string;
    phone?: string;
    email?: string;
    accounts?: any;
    bookings?: any;
    dashboard?: any;
    client?: number;
    password?: string;
    master_data?: any;
    createdAt?: number;
    updatedAt?: number;
    hotel_inventory?: any;
    kitchen_inventory?: any;
}

export interface UserActivity {
    data?: any;
    id?: number;
    client?: number;
    activity?: string;
    createdAt?: number;
    updatedAt?: number;
}
