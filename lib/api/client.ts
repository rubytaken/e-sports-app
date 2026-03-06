import type { QueryParams } from "./types";

const API_BASE = "/api/pandascore";
const CLIENT_TIMEOUT_MS = 15_000; // 15 seconds

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function buildQueryString(params?: QueryParams): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body?.error || `API request failed: ${res.status} ${res.statusText}`;
  } catch {
    return `API request failed: ${res.status} ${res.statusText}`;
  }
}

export async function apiGet<T>(
  path: string,
  params?: QueryParams
): Promise<T> {
  const url = `${API_BASE}${path}${buildQueryString(params)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const message = await parseErrorMessage(res);
      throw new ApiError(res.status, message);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(504, "Request timed out. Please try again.");
    }
    throw new ApiError(0, "Network error. Please check your connection.");
  }
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export async function apiGetPaginated<T>(
  path: string,
  params?: QueryParams
): Promise<PaginatedResponse<T>> {
  const url = `${API_BASE}${path}${buildQueryString(params)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const message = await parseErrorMessage(res);
      throw new ApiError(res.status, message);
    }

    const data = (await res.json()) as T[];
    const total = parseInt(res.headers.get("X-Total") || "0", 10);
    const page = parseInt(res.headers.get("X-Page") || "1", 10);
    const perPage = parseInt(res.headers.get("X-Per-Page") || "10", 10);

    return { data, total, page, perPage };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(504, "Request timed out. Please try again.");
    }
    throw new ApiError(0, "Network error. Please check your connection.");
  }
}

export { ApiError };
