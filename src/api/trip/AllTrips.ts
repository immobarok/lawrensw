/**
 * trips.optimized.ts
 *
 * Faster-loading, cache-friendly wrapper around the original trips API helpers.
 * - In-memory TTL cache with stale-while-revalidate behavior
 * - Lightweight LRU size limit to avoid unbounded memory growth
 * - Single-flight refresh (avoid duplicate upstream requests)
 * - Prefetch helpers
 *
 * NOTE:
 * - This is intended for Node/edge or browser runtime where in-memory cache is acceptable.
 * - For server-side frameworks (Next.js, Vercel Edge), adapt caching to the platform (e.g., global / redis / platform cache).
 */

/* ----------------------------- Types / Interfaces ---------------------------- */

export interface Trip {
  id: number;
  region: string;
  url: string;
  external_id: number;
  code: string;
  departure_date: string;
  return_date: string;
  name: string;
  summary: string;
  embark: string;
  disembark: string;
  days: number;
  nights: number;
  ship_id: number;
  ship_name: string;
  map: string;
  trip_type: string;
  photos: {
    id: number;
    trips_two_id: number;
    url: string;
  }[];
  destinations_twos: {
    id: number;
    trips_two_id: number;
    name: string;
  }[];
}

export interface TripsResponse {
  status: boolean;
  message: string;
  data: {
    trips: {
      current_page: number;
      data: Trip[];
      last_page: number;
      total: number;
      per_page: number;
      from: number;
      to: number;
    };
  };
}

export interface TripsFilters {
  page?: number;
  limit?: number;
  region?: string;
  ship_name?: string;
  departure_date?: string;
  trip_type?: string;
  destinations?: string;
  min_price?: number;
  max_price?: number;
  min_duration?: number;
  max_duration?: number;
  ship?: string;
  shipSize?: string;
}

export interface PaginatedTrips {
  trips: Trip[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  from: number;
  to: number;
}

/* ----------------------------- Configuration ----------------------------- */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
if (!API_BASE_URL) {
  // Do not throw here; functions will check, but warn early in dev.
  // eslint-disable-next-line no-console
  console.warn(
    "NEXT_PUBLIC_API_URL is not defined. API calls will fail until configured."
  );
}

/* ----------------------------- Small LRU Cache ----------------------------- */

/**
 * Simple LRU cache with TTL per entry.
 * Not cryptographically secure or persistent; meant for short-lived in-memory caching.
 */
type CacheEntry<T> = {
  value: T;
  expiresAt: number; // epoch ms
  etag?: string;
};

class LRUCache<T> {
  private map = new Map<string, CacheEntry<T>>();
  constructor(private maxSize = 200) {}

  get(key: string): CacheEntry<T> | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    // Touch (move to most-recent)
    this.map.delete(key);
    this.map.set(key, entry);
    return entry;
  }

  set(key: string, entry: CacheEntry<T>) {
    if (this.map.has(key)) {
      this.map.delete(key);
    }
    this.map.set(key, entry);
    while (this.map.size > this.maxSize) {
      // delete least-recent (first)
      const firstKey = this.map.keys().next().value;
      this.map.delete(firstKey!);
    }
  }

  delete(key: string) {
    this.map.delete(key);
  }

  clear() {
    this.map.clear();
  }
}

/* ----------------------------- Fetch wrapper ----------------------------- */

/**
 * Options for fetchWithCache:
 * - ttl: time-to-live in ms for cached success response (defaults to 30s)
 * - staleWhileRevalidate: when true, a stale cached response will be returned immediately while a background
 *   refresh is triggered (default true)
 * - allowStaleIfError: when a network error occurs, allow returning stale response if present (default true)
 */
type FetchWithCacheOptions = {
  ttl?: number;
  staleWhileRevalidate?: boolean;
  allowStaleIfError?: boolean;
  signal?: AbortSignal;
  // force skip cache
  forceRefresh?: boolean;
  // allow providing custom cache key
  cacheKey?: string;
};

const defaultTTL = 30_000; // 30 seconds

// In-memory LRU cache for GET responses (key -> JSON)
const jsonCache = new LRUCache<any>(300);

// Single-flight map to avoid duplicate upstream requests for same URL
const inflightRequests = new Map<string, Promise<any>>();

/**
 * Lightweight JSON fetch with in-memory caching and stale-while-revalidate.
 */
async function fetchWithCache<T = any>(
  url: string,
  opts: FetchWithCacheOptions = {}
): Promise<T | null> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const {
    ttl = defaultTTL,
    staleWhileRevalidate = true,
    allowStaleIfError = true,
    signal,
    forceRefresh = false,
    cacheKey,
  } = opts;

  const key = cacheKey || url;

  const now = Date.now();
  const cached = jsonCache.get(key);

  // If non-forced and cached & fresh => return it
  if (!forceRefresh && cached && cached.expiresAt > now) {
    return cached.value as T;
  }

  // If cached but stale and staleWhileRevalidate => return stale immediately and revalidate in background
  if (
    !forceRefresh &&
    cached &&
    cached.expiresAt <= now &&
    staleWhileRevalidate
  ) {
    // Kick off background refresh but don't await
    revalidateInBackground<T>(url, { ttl, signal, cacheKey: key }).catch(
      (err) =>
        // eslint-disable-next-line no-console
        console.debug("Background revalidate error:", err)
    );
    return cached.value as T;
  }

  // Otherwise we need a fresh fetch. Use single-flight to dedupe concurrent requests.
  if (inflightRequests.has(key)) {
    try {
      return await inflightRequests.get(key)!;
    } catch (e) {
      // If the inflight request failed, fallthrough to attempt direct fetch below
    }
  }

  const p = (async (): Promise<T | null> => {
    try {
      const controller = new AbortController();
      const combinedSignal = mergeAbortSignals(signal, controller.signal);
      const response = await fetch(url, {
        cache: "no-store",
        signal: combinedSignal,
      });

      if (response.status === 404) {
        // cache short-lived null to avoid repeated 404 thrash
        jsonCache.set(key, { value: null, expiresAt: Date.now() + 5_000 });
        return null;
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `HTTP error ${response.status} ${response.statusText} ${errorText}`
        );
      }

      const json = (await response.json()) as T;
      const etag = response.headers.get("ETag") ?? undefined;

      jsonCache.set(key, { value: json, expiresAt: Date.now() + ttl, etag });
      return json;
    } catch (err) {
      // On network error, allow returning stale if present and allowed
      if (allowStaleIfError && cached) {
        return cached.value as T;
      }
      throw err;
    } finally {
      inflightRequests.delete(key);
    }
  })();

  inflightRequests.set(key, p);
  return p;
}

/**
 * Trigger background revalidation (single-flight aware).
 */
async function revalidateInBackground<T>(
  url: string,
  opts: { ttl?: number; signal?: AbortSignal; cacheKey?: string } = {}
) {
  const key = opts.cacheKey || url;
  if (inflightRequests.has(key)) return inflightRequests.get(key);

  const p = (async (): Promise<T | null> => {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        signal: opts.signal,
      });
      if (!response.ok) {
        // keep stale
        return null;
      }
      const json = (await response.json()) as T;
      const etag = response.headers.get("ETag") ?? undefined;
      jsonCache.set(key, {
        value: json,
        expiresAt: Date.now() + (opts.ttl ?? defaultTTL),
        etag,
      });
      return json;
    } finally {
      inflightRequests.delete(key);
    }
  })();

  inflightRequests.set(key, p);
  return p;
}

/**
 * Merge two AbortSignals into one: if any aborts, the returned signal aborts.
 */
function mergeAbortSignals(a?: AbortSignal, b?: AbortSignal) {
  if (!a) return b ?? undefined;
  if (!b) return a;

  // Prefer the native helper when available.
  const anySignal = (
    AbortSignal as unknown as { any?: (signals: AbortSignal[]) => AbortSignal }
  ).any;
  if (typeof anySignal === "function") {
    try {
      return anySignal([a, b]);
    } catch (error) {
      // fall through to manual merge if AbortSignal.any throws (older polyfills, etc.)
    }
  }

  if (a === b) {
    return a;
  }

  const controller = new AbortController();
  const signalA = a;
  const signalB = b;

  const abortSafely = () => {
    if (!controller.signal.aborted) {
      controller.abort();
    }
  };

  function handleAbort() {
    abortSafely();
    signalA.removeEventListener("abort", handleAbort);
    signalB.removeEventListener("abort", handleAbort);
  }

  if (signalA.aborted || signalB.aborted) {
    abortSafely();
  } else {
    signalA.addEventListener("abort", handleAbort, { once: true });
    signalB.addEventListener("abort", handleAbort, { once: true });
  }

  return controller.signal;
}

/* ----------------------------- Public API (optimized) ----------------------------- */

/**
 * Get all trips with pagination.
 * - Uses in-memory caching per query string (30s by default)
 * - Supports AbortSignal in init
 */
export const getAllTripsWithPagination = async (
  filters: TripsFilters = {},
  init?: { signal?: AbortSignal; forceRefresh?: boolean; ttlMs?: number }
): Promise<PaginatedTrips> => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const queryParams = new URLSearchParams();

  // sensible defaults for faster UX: default limit smaller for faster responses
  const defaults = { page: 1, limit: 12 };
  const merged = { ...defaults, ...filters };

  Object.entries(merged).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/all/trips/lists${
    queryString ? `?${queryString}` : ""
  }`;

  try {
    const json = await fetchWithCache<TripsResponse>(url, {
      ttl: init?.ttlMs ?? 30_000,
      staleWhileRevalidate: true,
      allowStaleIfError: true,
      signal: init?.signal,
      forceRefresh: !!init?.forceRefresh,
      cacheKey: url,
    });

    if (!json || !json.status || !json.data?.trips) {
      return {
        trips: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: merged.limit ?? 12,
        from: 0,
        to: 0,
      };
    }

    const tripsData = json.data.trips;
    return {
      trips: tripsData.data || [],
      currentPage: tripsData.current_page || 1,
      totalPages: tripsData.last_page || 1,
      totalItems: tripsData.total || 0,
      perPage: tripsData.per_page || merged.limit || 12,
      from: tripsData.from || 0,
      to: tripsData.to || 0,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to fetch trips:", error);
    return {
      trips: [],
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: merged.limit ?? 12,
      from: 0,
      to: 0,
    };
  }
};

/**
 * Get trip by ID and type.
 * - Tries type-specific endpoint first, falls back to base endpoint if not found.
 * - Caches responses per concrete fetch URL.
 */
export const getTripDetails = async (
  id: number,
  tripType: string,
  init?: { signal?: AbortSignal; ttlMs?: number; forceRefresh?: boolean }
): Promise<any | null> => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const sanitizedType = tripType?.trim();
  const rawSegment = sanitizedType?.startsWith("trip_")
    ? sanitizedType.replace(/^trip_/, "")
    : sanitizedType;

  const routeSegment = rawSegment && rawSegment !== "trip" ? rawSegment : "";

  const buildEndpoint = (segment?: string) =>
    segment ? `/api/trips/${segment}/${id}` : `/api/trips/${id}`;

  const endpoint = buildEndpoint(routeSegment);
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    // Try type-specific endpoint first
    const json = await fetchWithCache<any>(url, {
      ttl: init?.ttlMs ?? 60_000,
      staleWhileRevalidate: true,
      allowStaleIfError: true,
      signal: init?.signal,
      forceRefresh: !!init?.forceRefresh,
      cacheKey: url,
    });

    if (json !== null) return json;

    // If it was a 404 on type-specific, try fallback only if routeSegment was used
    if (routeSegment) {
      const fallbackUrl = `${API_BASE_URL}${buildEndpoint()}`;
      const fallbackJson = await fetchWithCache<any>(fallbackUrl, {
        ttl: init?.ttlMs ?? 60_000,
        staleWhileRevalidate: true,
        allowStaleIfError: true,
        signal: init?.signal,
        forceRefresh: !!init?.forceRefresh,
        cacheKey: fallbackUrl,
      });
      return fallbackJson;
    }

    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to fetch trip details:", error);
    return null;
  }
};

/**
 * Get details page URL based on trip type
 */
export const getTripDetailsUrl = (trip: Trip, source?: string): string => {
  const basePath = "/trips";
  const tripTypeSegment = trip.trip_type
    ? encodeURIComponent(trip.trip_type)
    : "trip";
  const baseUrl = `${basePath}/${tripTypeSegment}/${trip.id}`;
  if (source) {
    return `${baseUrl}?source=${encodeURIComponent(source)}`;
  }
  return baseUrl;
};

export const prefetchTrips = async (
  filters: TripsFilters = {},
  ttlMs?: number
) => {
  const queryParams = new URLSearchParams();
  const defaults = { page: 1, limit: 12 };
  const merged = { ...defaults, ...filters };
  Object.entries(merged).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "")
      queryParams.append(k, String(v));
  });
  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/all/trips/lists${
    queryString ? `?${queryString}` : ""
  }`;
  return fetchWithCache(url, {
    ttl: ttlMs ?? 30_000,
    staleWhileRevalidate: true,
  });
};

/**
 * Prefetch a trip detail into the cache.
 */
export const prefetchTripDetails = async (
  id: number,
  tripType: string,
  ttlMs?: number
) => {
  const sanitizedType = tripType?.trim();
  const rawSegment = sanitizedType?.startsWith("trip_")
    ? sanitizedType.replace(/^trip_/, "")
    : sanitizedType;
  const routeSegment = rawSegment && rawSegment !== "trip" ? rawSegment : "";

  const buildEndpoint = (segment?: string) =>
    segment ? `/api/trips/${segment}/${id}` : `/api/trips/${id}`;

  const urls = routeSegment
    ? [
        `${API_BASE_URL}${buildEndpoint(routeSegment)}`,
        `${API_BASE_URL}${buildEndpoint()}`,
      ]
    : [`${API_BASE_URL}${buildEndpoint()}`];

  // Fire-and-forget background prefetches
  await Promise.all(
    urls.map((u) =>
      fetchWithCache(u, {
        ttl: ttlMs ?? 60_000,
        staleWhileRevalidate: true,
      }).catch(() => null)
    )
  );
};

/* ----------------------------- Utility: Clear/Inspect Cache ----------------------------- */

export const __cache = {
  clear: () => jsonCache.clear(),
  size: () => {
    return (jsonCache as any).map?.size ?? "unknown";
  },
};

/* ----------------------------- End of file ----------------------------- */
