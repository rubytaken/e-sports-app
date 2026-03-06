import type { QueryParams } from "./types";

const API_BASE = "/api/pandascore";

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

export async function apiGet<T>(
  path: string,
  params?: QueryParams
): Promise<T> {
  const url = `${API_BASE}${path}${buildQueryString(params)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new ApiError(
      res.status,
      `API request failed: ${res.status} ${res.statusText}`
    );
  }

  return res.json() as Promise<T>;
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

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new ApiError(
      res.status,
      `API request failed: ${res.status} ${res.statusText}`
    );
  }

  const data = (await res.json()) as T[];
  const total = parseInt(res.headers.get("X-Total") || "0", 10);
  const page = parseInt(res.headers.get("X-Page") || "1", 10);
  const perPage = parseInt(res.headers.get("X-Per-Page") || "10", 10);

  return { data, total, page, perPage };
}

export { ApiError };
