import Api from "./Mock_Api";
import { snapshot } from "valtio";
import { uiStore } from "@/store/uiState";
import { getCached, setCached, makeKey } from "@/utils/simpleCache";
import type {
  Food,
  User,
  Guest,
  Order,
  Booking,
  Company,
  Payment,
  Setting,
  GuestDoc,
  Inventory,
  OrderFood,
  GuestOrder,
  BookingRoom,
  Transaction,
  InventoryLog,
  UserActivity,
  SettingOption,
  GuestOrderedFood,
  InvoiceNoCounter,
} from "@/core/models";

export interface BaseRecord {
  id: string | number;
  created_at?: string;
  updated_at?: string;
  createdAt?: number;
  updatedAt?: number;
  [key: string]: any;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000;

export interface FQLResponse<T = any> {
  result?: T;
  count?: number;
  extraData?: any;
  message?: string;
  session?: string;
  responses?: any[];
  err?: boolean | string;
}

export interface FQLFindManyOptions {
  sort?: string;
  joins?: string;
  search?: string;
  fields?: string;
  filter?: string;
  hidden?: string;
  nearby?: string;
  useCache?: boolean;
  isPublic?: boolean;
  cacheTtlMs?: number;
  useSession?: boolean;
  page?: number | string;
  limit?: number | string;
  where?: Record<string, any>;
}

export interface FQLFindByIdOptions {
  joins?: string;
  filter?: string;
  fields?: string;
  hidden?: string;
  useCache?: boolean;
  isPublic?: boolean;
  cacheTtlMs?: number;
  useSession?: boolean;
}

export interface FQLCreateOptions {
  fields?: string;
  useSession?: boolean;
}

export interface FQLUpdateOptions extends FQLCreateOptions { }
export interface FQLDeleteOptions {
  useSession?: boolean;
}
export interface FQLCountOptions {
  filter?: string;
  useCache?: boolean;
  cacheTtlMs?: number;
  useSession?: boolean;
}
export interface FQLQueryOptions {
  useCache?: boolean;
  cacheTtlMs?: number;
  useSession?: boolean;
}

export interface FQLAuthOptions {
  body?: any;
  fields?: string;
  expiry?: number;
  extraData?: {
    resource: string;
    keys: string;
    valueKeys?: string;
    fields?: string;
  };
}

export interface FQLBulkResponse<T = any> extends FQLResponse<T[]> {
  responses: FQLResponse<T>[];
}

/**
 * Generic FQL Client
 */
export class GenericFQL<TRecord extends BaseRecord = BaseRecord> {
  readonly resource: string;
  private mapper?: { toDb: Record<string, string>; fromDb: Record<string, string> };
  private allowedFields?: string[];
  public isPublic: boolean = false;
  public hasIsDeleted: boolean = true;

  private static readonly NUMERIC_VALUE_COLS = [
    'quantity', 'amount', 'tax'
  ];

  private static readonly RELATION_ID_COLS = [
    'client', 'guest_id', 'room_id', 'booking_id', 'order_id', 'food_id', 'item_id', 'user_id', 'table_id'
  ];

  constructor(resource: string, fieldMap?: Record<string, string>, allowedFields?: string[]) {
    this.resource = resource;
    this.allowedFields = allowedFields;
    if (fieldMap) {
      this.mapper = {
        toDb: fieldMap,
        fromDb: Object.fromEntries(Object.entries(fieldMap).map(([k, v]) => [v, k])),
      };
    }
  }

  private mapDataToDb(data: any) {
    if (!this.mapper || !data) return data;
    const mapped: any = {};
    const mapper = this.mapper;
    const allowed = this.allowedFields || [];

    for (const [key, value] of Object.entries(data)) {
      const dbKey = mapper.toDb[key] || key;

      if (dbKey === 'id' && mapper.toDb['id'] !== 'id') {
        continue;
      }

      if (allowed.length > 0 && !allowed.includes(dbKey) && !['id', 'uuid'].includes(dbKey)) {
        continue;
      }

      if (GenericFQL.NUMERIC_VALUE_COLS.includes(dbKey)) {
        if (value === null || value === undefined) {
          mapped[dbKey] = 0;
        } else {
          const numValue = Number(value);
          mapped[dbKey] = Number.isFinite(numValue) ? numValue : 0;
        }
      } else if (GenericFQL.RELATION_ID_COLS.includes(dbKey)) {
        if (value === null || value === undefined || value === 0) {
          mapped[dbKey] = null;
        } else {
          mapped[dbKey] = Number(value);
        }
      } else if (dbKey === 'is_locked' || dbKey === 'expire_on_submit' || dbKey === 'is_disabled') {
        mapped[dbKey] = value ? 1 : 0;
      } else if ((dbKey === 'created_at' || dbKey === 'updated_at') && typeof value === 'number') {
        mapped[dbKey] = new Date(value).toISOString().slice(0, 19).replace('T', ' ');
      } else {
        mapped[dbKey] = (value === undefined) ? null : value;
      }
    }
    return mapped;
  }

  private mapDataFromDb(data: any): any {
    if (data === "Invalid session!") {
      import("@/store/authStore").then(m => m.authActions.logout());
      return data;
    }
    if (!this.mapper || !data) return data;
    const mapper = this.mapper;
    if (Array.isArray(data)) return data.map((item) => this.mapDataFromDb(item));

    const mapped: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (key === 'id' && typeof value === 'number') {
        mapped['dbId'] = value;
      }

      const modelKey = mapper.fromDb[key] || key;

      if (key === 'id' && modelKey === 'id' && Object.entries(mapper.fromDb).some(([k, v]) => v === 'id' && k !== 'id')) {
        continue;
      }

      if ((key === 'created_at' || key === 'updated_at') && value && typeof value === 'string') {
        mapped[modelKey] = new Date(value + ' UTC').getTime();
      } else if (GenericFQL.NUMERIC_VALUE_COLS.includes(key) || GenericFQL.RELATION_ID_COLS.includes(key)) {
        if (value !== null && typeof value === 'object') {
          mapped[modelKey] = value;
        } else {
          mapped[modelKey] = value === null ? 0 : Number(value || 0);
        }
      } else {
        mapped[modelKey] = value;
      }
    }

    if (!mapped.syncStatus) mapped.syncStatus = 'synced';

    return mapped;
  }

  private buildSearch(where: Record<string, any>, existingSearch?: string): string {
    const parts: string[] = existingSearch ? [existingSearch] : [];

    for (const [key, value] of Object.entries(where)) {
      const dbKey = this.mapper?.toDb[key] || key;
      if (value !== undefined && value !== null) {
        parts.push(`${dbKey}:${value}`);
      }
    }

    return parts.join(',');
  }

  async findLast(options: Partial<FQLFindManyOptions> = {}): Promise<FQLResponse<TRecord>> {
    const {
      sort = "-created_at",
      search = "",
      where = {},
      fields = "*",
      filter = "",
      useCache = false,
      useSession = false,
      cacheTtlMs = DEFAULT_TTL_MS,
    } = options;

    const params: Record<string, any> = {
      page: `1,1`,
      sort,
      search: this.buildSearch(where, search),
      fields,
      filter: this.getClientFilter(filter),
      ...this.getSessionParam(useSession),
    };

    const cacheKey = makeKey(`${this.resource}:last`, { sort, search: params.search, fields, filter, useSession });
    if (useCache) {
      const cached = getCached(cacheKey);
      if (cached) return cached;
    }

    const response = await Api.get(`/${this.resource}`, params);
    const first = Array.isArray((response as any)?.result) ? (response as any).result[0] : (response as any)?.result;
    const normalized: FQLResponse<TRecord> = {
      ...response,
      result: this.mapDataFromDb(first)
    } as any;

    if (useCache && !response?.err) setCached(cacheKey, normalized, cacheTtlMs);
    return normalized;
  }

  private getSessionParam(useSession?: boolean) {
    const { isDelegated, delegationCode } = snapshot(uiStore);
    if (isDelegated && delegationCode) {
      return { session: delegationCode };
    }
    const session = typeof window !== 'undefined' ? localStorage.getItem('session') : null;
    return (useSession || session) ? { session: session ?? undefined } : {};
  }

  private getClientFilter(existingFilter: string, isPublicOverride?: boolean): string {
    const isPublic = isPublicOverride ?? this.isPublic;
    if (isPublic) return existingFilter;
    const clientFilter = `client:{client}`;
    if (!existingFilter) return clientFilter;
    if (existingFilter.includes('client:')) return existingFilter;
    return `${existingFilter},${clientFilter}`;
  }

  private ensureValidIds(ids: (string | number)[], method: string) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error(`${method}: ids[] must not be empty`);
    }
  }

  async auth(options: FQLAuthOptions = {}): Promise<FQLResponse<TRecord>> {
    const { body, fields = "id,role,client,name", expiry, extraData } = options;

    const authResponse: FQLResponse<TRecord> = await Api.post(`/auth-${this.resource}`, {
      body,
      fields,
      expiry,
    });

    if (authResponse.err || !authResponse.result) {
      return authResponse;
    }

    authResponse.result = this.mapDataFromDb(authResponse.result);

    if (extraData) {
      const { resource, keys, valueKeys, fields: extraFields = "*" } = extraData;
      const targetFql = (fql as any)[resource];

      if (targetFql) {
        const kList = keys.split(",");
        const vList = (valueKeys || keys).split(",");
        const where: Record<string, any> = {};
        kList.forEach((k, i) => {
          const val = (authResponse.result as any)[vList[i]?.trim()];
          if (val) where[k.trim()] = val;
        });

        if (Object.keys(where).length > 0) {
          const extraResponse = await targetFql.findLast({
            where,
            fields: extraFields,
          });

          authResponse.extraData = {
            ...authResponse.extraData,
            ...(extraResponse.result || {}),
          };
        }
      }
    }

    return authResponse;
  }

  async findAll(options: FQLFindManyOptions = {}): Promise<FQLResponse<TRecord[]>> {
    return this.findMany(options);
  }

  async findMany(options: FQLFindManyOptions = {}): Promise<FQLResponse<TRecord[]>> {
    const {
      page = "",
      sort = "created_at",
      limit = "",
      joins = "",
      search = "",
      where = {},
      fields = "*",
      filter = "",
      nearby = "",
      hidden = "",
      useCache = false,
      useSession = false,
      isPublic = false,
      cacheTtlMs = DEFAULT_TTL_MS,
    } = options;

    const effectiveFilter = !this.hasIsDeleted
      ? filter
      : (filter
        ? (filter.includes('is_deleted') ? filter : `${filter},is_deleted:0`)
        : 'is_deleted:0');

    const params: Record<string, any> = {
      ...(page || limit ? { page: `${page},${limit}` } : {}),
      sort,
      search: this.buildSearch(where, search),
      fields,
      filter: this.getClientFilter(effectiveFilter, isPublic),
      ...(joins ? { joins } : {}),
      ...(nearby ? { nearby } : {}),
      ...(hidden ? { hidden } : {}),
      ...this.getSessionParam(useSession),
    };

    const cacheKey = makeKey(`${this.resource}:list`, { page, limit, sort, fields, filter: params.filter, search: params.search, useSession });
    if (useCache) {
      const cached = getCached(cacheKey);
      if (cached) return cached;
    }

    const response = await Api.get(`/${this.resource}`, params);

    if (response.result && !response.err) {
      let allResults = Array.isArray(response.result) ? response.result : [response.result];
      const totalCount = response.count || 0;
      const requestedLimit = limit ? Number(limit) : Infinity;
      const targetToFetch = Math.min(requestedLimit, totalCount);

      if (!options.page && allResults.length < targetToFetch && allResults.length > 0) {
        const pageSize = 1000;
        let currentPage = (Number(page) || 1) + 1;

        while (allResults.length < targetToFetch) {
          const remaining = targetToFetch - allResults.length;
          const currentBatchSize = Math.min(pageSize, remaining);
          const nextParams = { ...params, page: `${currentPage},${currentBatchSize}` };
          const nextResponse = await Api.get(`/${this.resource}`, nextParams);

          if (nextResponse.err || !nextResponse.result || !Array.isArray(nextResponse.result) || nextResponse.result.length === 0) {
            break;
          }

          allResults = [...allResults, ...nextResponse.result];
          currentPage++;
          if (allResults.length >= totalCount) break;
        }
        response.result = allResults;
      }
      response.result = this.mapDataFromDb(response.result);
    }

    if (useCache && !response?.err) setCached(cacheKey, response, cacheTtlMs);
    return response;
  }

  async findOne(id: string | number, options: FQLFindByIdOptions = {}): Promise<FQLResponse<TRecord>> {
    const { fields = "*", useSession = false, useCache = false, cacheTtlMs = DEFAULT_TTL_MS, joins = "", filter = "", hidden = "" } = options;
    const params = { fields, filter: this.getClientFilter(filter), ...(joins ? { joins } : {}), ...(hidden ? { hidden } : {}), ...this.getSessionParam(useSession) };

    const cacheKey = makeKey(`${this.resource}:byId`, { id, fields, useSession });
    if (useCache) {
      const cached = getCached(cacheKey);
      if (cached) return cached;
    }

    const response = await Api.get(`/${this.resource}/${id}`, params);
    if (Array.isArray((response as any)?.result)) {
      (response as any).result = (response as any).result[0];
    }

    if (response.result) {
      response.result = this.mapDataFromDb(response.result);
    }

    if (useCache && !response?.err) setCached(cacheKey, response, cacheTtlMs);
    return response;
  }

  async findManyIds(
    ids: (string | number)[],
    options: FQLFindByIdOptions = {}
  ): Promise<FQLResponse<TRecord[]>> {
    const { fields = "*", useSession = false, useCache = false, cacheTtlMs = DEFAULT_TTL_MS, joins = "", filter = "" } = options;
    const params = { fields, filter: this.getClientFilter(filter), ...(joins ? { joins } : {}), ...this.getSessionParam(useSession) };

    const cacheKey = makeKey(`${this.resource}:byIds`, { ids, fields, useSession });
    if (useCache) {
      const cached = getCached(cacheKey);
      if (cached) return cached;
    }

    const BATCH_SIZE = 1000;
    let allResults: any[] = [];
    let finalResponse: any = null;

    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const batch = ids.slice(i, i + BATCH_SIZE);
      const response = await Api.get(`/${this.resource}/${batch.join(",")}`, params);

      if (response.err) {
        if (!finalResponse) return response;
        break;
      }

      if (response.result) {
        const newItems = Array.isArray(response.result) ? response.result : [response.result];
        allResults = [...allResults, ...newItems];
      }

      if (!finalResponse) finalResponse = response;
    }

    if (!finalResponse) {
      finalResponse = { result: [], count: 0 };
    } else {
      finalResponse.result = this.mapDataFromDb(allResults);
      finalResponse.count = allResults.length;
    }

    if (useCache && !finalResponse?.err) setCached(cacheKey, finalResponse, cacheTtlMs);
    return finalResponse;
  }

  async createOne(data: Partial<TRecord>, options: FQLCreateOptions = {}): Promise<FQLResponse<TRecord>> {
    const { useSession = false, fields = "*" } = options;
    const body: any = this.mapDataToDb(data);

    if (useSession && !body.client) {
      body.client = "{client}";
    }
    const response = await Api.post(`/${this.resource}`, {
      body,
      ...this.getSessionParam(useSession),
      ...(useSession ? { filter: this.getClientFilter("") } : {}),
      fields,
    });

    if (response.result) {
      response.result = this.mapDataFromDb(response.result);
    }
    return response;
  }

  async createMany(data: Partial<TRecord>[], options: FQLCreateOptions = {}): Promise<FQLResponse<TRecord[]>> {
    const { useSession = false, fields = "*" } = options;
    let body: any[] = data.map(item => this.mapDataToDb(item));

    if (useSession) {
      body = body.map(item => ({ ...item, client: item.client || "{client}" }));
    }
    const response = await Api.post(`/${this.resource}`, {
      body,
      ...this.getSessionParam(useSession),
      ...(useSession ? { filter: this.getClientFilter("") } : {}),
      fields,
    });

    if (response.result) {
      response.result = this.mapDataFromDb(response.result);
    }
    return response;
  }

  async updateOne(id: string | number, data: Partial<TRecord>, options: FQLUpdateOptions = {}): Promise<FQLResponse<TRecord>> {
    const { useSession = false, fields = "*" } = options;
    const mapped = this.mapDataToDb(data);

    const numericId = (data as any).dbId || (typeof id === 'number' ? id : (!isNaN(Number(id)) ? Number(id) : null));
    if (numericId !== null) {
      mapped.id = numericId;
    }

    const response = await Api.put(`/${this.resource}/${id}`, {
      body: mapped,
      ...this.getSessionParam(useSession),
      ...(useSession ? { filter: this.getClientFilter("") } : {}),
      fields,
    });

    if (response.result) {
      response.result = this.mapDataFromDb(response.result);
    }
    return response;
  }

  async updateMany(updates: Array<{ id: string | number; data: Partial<TRecord> }>, options: FQLUpdateOptions = {}): Promise<FQLResponse<TRecord[]>> {
    const { useSession = false, fields = "*" } = options;

    const body = updates.map(({ id, data }) => {
      const entry = { ...data };
      const mapped = this.mapDataToDb(entry);

      const numericId = (entry as any).dbId || (typeof id === 'number' ? id : (!isNaN(Number(id)) ? Number(id) : null));
      if (numericId !== null) {
        mapped.id = numericId;
      }

      return mapped;
    });

    const response = await Api.put(`/${this.resource}`, {
      body,
      ...this.getSessionParam(useSession),
      ...(useSession ? { filter: this.getClientFilter("") } : {}),
      fields,
    });

    if (response.result) {
      response.result = this.mapDataFromDb(response.result);
    }
    return response;
  }

  async deleteOne(id: string | number, options: FQLDeleteOptions = {}): Promise<FQLResponse<void>> {
    const { useSession = false } = options;
    const response = await Api.delete(`/${this.resource}/${id}`, {
      ...this.getSessionParam(useSession),
      ...(useSession ? { filter: this.getClientFilter("") } : {}),
    });
    return response;
  }

  /** Hard delete many IDs */
  async deleteMany(ids: (string | number)[], options: FQLDeleteOptions = {}): Promise<FQLResponse<void>> {
    this.ensureValidIds(ids, "deleteMany");
    const { useSession = false } = options;

    const response = await Api.delete(
      `/${this.resource}/${ids.join(",")}`,
      {
        ...this.getSessionParam(useSession),
        ...(useSession ? { filter: this.getClientFilter("") } : {}),
      }
    );

    return response;
  }

  async softDeleteOne(id: string | number, options: FQLUpdateOptions = {}) {
    return this.updateOne(id, { isDeleted: 1 } as any, options);
  }

  /** Soft delete many IDs */
  async softDeleteMany(ids: (string | number)[], options: FQLUpdateOptions = {}): Promise<FQLResponse<TRecord[]>> {
    this.ensureValidIds(ids, "softDeleteMany");
    const updates = ids.map(id => ({ id, data: { isDeleted: 1 } as any }));
    return this.updateMany(updates, options);
  }

  async restoreOne(id: string | number, options: FQLUpdateOptions = {}) {
    return this.updateOne(id, { isDeleted: 0 } as any, options);
  }

  /** Restore many IDs */
  async restoreMany(ids: (string | number)[], options: FQLUpdateOptions = {}): Promise<FQLResponse<TRecord[]>> {
    this.ensureValidIds(ids, "restoreMany");
    const updates = ids.map(id => ({ id, data: { isDeleted: 0 } as any }));
    return this.updateMany(updates, options);
  }

  async rawSql(
    queryName: string,
    sql: string,
    params: any[] = [],
    options: FQLQueryOptions = {}
  ): Promise<FQLResponse<any>> {
    const { useSession = false, useCache = false, cacheTtlMs = DEFAULT_TTL_MS } = options;

    const endpoint = queryName
      ? queryName.trim().replace(/\s+/g, "-").toLowerCase()
      : "rawSql";

    const cacheKey = makeKey(endpoint, {
      sql,
      params: JSON.stringify(params),
      useSession,
    });

    if (useCache) {
      const cached = getCached(cacheKey);
      if (cached) return cached;
    }

    let response = await Api.sql(`/${endpoint}`, {
      body: { sql, params },
      ...this.getSessionParam(useSession),
    });

    if (response.result && !response.err) {
      let allResults = Array.isArray(response.result) ? response.result : [response.result];
      const totalCount = response.count || 0;

      if (allResults.length < totalCount && allResults.length > 0) {
        const pageSize = 1000;
        let currentPage = 2;

        while (allResults.length < totalCount) {
          const nextResponse = await Api.sql(`/${endpoint}`, {
            body: { sql, params },
            page: `${currentPage},${pageSize}`,
            ...this.getSessionParam(useSession),
          });

          if (nextResponse.err || !nextResponse.result || !Array.isArray(nextResponse.result) || nextResponse.result.length === 0) {
            break;
          }

          allResults = [...allResults, ...nextResponse.result];
          currentPage++;
          if (allResults.length >= totalCount) break;
        }
        response.result = allResults;
      }
      response.result = this.mapDataFromDb(response.result);
    }

    if (useCache && !response?.err) setCached(cacheKey, response, cacheTtlMs);

    return response;
  }
}

/** Factory */
export function createFQL<TRecord extends BaseRecord = BaseRecord>(
  resource: string,
  fieldMap?: Record<string, string>,
  allowedFields?: string[],
  isPublic: boolean = false,
  hasIsDeleted: boolean = true
): GenericFQL<TRecord> {
  const fql = new GenericFQL<TRecord>(resource, fieldMap, allowedFields);
  fql.isPublic = isPublic;
  fql.hasIsDeleted = hasIsDeleted;
  return fql;
}

const HOTEL_COMMON_FIELDS = {
  createdAt: "created_at",
  updatedAt: "updated_at",
};

const HOTEL_COMMON_FIELDS_WITH_DELETED = {
  createdAt: "created_at",
  updatedAt: "updated_at",
  isDeleted: "is_deleted",
};

/** Pre-configured FQL instances */
export const fql = {
  foods: createFQL<Food>("foods", HOTEL_COMMON_FIELDS, undefined, false, false),
  users: createFQL<User>("users", HOTEL_COMMON_FIELDS, undefined, false, false),
  guests: createFQL<Guest>("guests", HOTEL_COMMON_FIELDS, undefined, false, false),
  orders: createFQL<Order>("orders", HOTEL_COMMON_FIELDS, undefined, false, false),
  bookings: createFQL<Booking>("bookings", HOTEL_COMMON_FIELDS, undefined, false, false),
  payments: createFQL<Payment>("payments", HOTEL_COMMON_FIELDS, undefined, false, false),
  companies: createFQL<Company>("companies", HOTEL_COMMON_FIELDS, undefined, false, false),
  inventory: createFQL<Inventory>("inventory", HOTEL_COMMON_FIELDS, undefined, false, false),
  orders_foods: createFQL<OrderFood>("orders_foods", HOTEL_COMMON_FIELDS, undefined, false, false),
  guest_orders: createFQL<GuestOrder>("guest_orders", HOTEL_COMMON_FIELDS, undefined, false, false),
  settings: createFQL<Setting>("settings", HOTEL_COMMON_FIELDS_WITH_DELETED, undefined, false, true),
  transactions: createFQL<Transaction>("transactions", HOTEL_COMMON_FIELDS, undefined, false, false),
  bookings_rooms: createFQL<BookingRoom>("bookings_rooms", HOTEL_COMMON_FIELDS, undefined, false, false),
  inventory_logs: createFQL<InventoryLog>("inventory_logs", HOTEL_COMMON_FIELDS, undefined, false, false),
  guests_docs: createFQL<GuestDoc>("guests_docs", HOTEL_COMMON_FIELDS_WITH_DELETED, undefined, false, true),
  users_activities: createFQL<UserActivity>("users_activities", HOTEL_COMMON_FIELDS, undefined, false, false),
  invoice_no_counter: createFQL<InvoiceNoCounter>("invoice_no_counter", HOTEL_COMMON_FIELDS, undefined, false, false),
  guest_ordered_foods: createFQL<GuestOrderedFood>("guest_ordered_foods", HOTEL_COMMON_FIELDS, undefined, false, false),
  settings_options: createFQL<SettingOption>("settings_options", HOTEL_COMMON_FIELDS_WITH_DELETED, undefined, false, true),
};
