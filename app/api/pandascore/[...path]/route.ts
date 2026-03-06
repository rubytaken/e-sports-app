import { NextRequest, NextResponse } from "next/server";

const PANDASCORE_BASE = "https://api.pandascore.co";
const FETCH_TIMEOUT_MS = 10_000; // 10 seconds

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const token = process.env.PANDASCORE_API_TOKEN;

  if (!token || token === "YOUR_TOKEN_HERE") {
    return NextResponse.json(
      { error: "PandaScore API token not configured. Set PANDASCORE_API_TOKEN in .env.local" },
      { status: 500 }
    );
  }

  const { path } = await params;
  const apiPath = `/${path.join("/")}`;
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${PANDASCORE_BASE}${apiPath}${searchParams ? `?${searchParams}` : ""}`;

  // Abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal: controller.signal,
      next: {
        revalidate: getCacheTime(apiPath),
      },
    });

    clearTimeout(timeoutId);

    // Handle rate limiting (429)
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const retrySeconds = retryAfter ? parseInt(retryAfter, 10) : 5;
      const headers = new Headers();
      headers.set("Retry-After", String(retrySeconds));
      headers.set("Cache-Control", "no-store");
      return NextResponse.json(
        { error: "Rate limited by PandaScore API. Please try again shortly.", retryAfter: retrySeconds },
        { status: 429, headers }
      );
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error(`PandaScore API error [${response.status}] for ${apiPath}:`, errorText);
      return NextResponse.json(
        { error: `PandaScore API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    // Forward pagination headers
    const xPage = response.headers.get("X-Page");
    const xPerPage = response.headers.get("X-Per-Page");
    const xTotal = response.headers.get("X-Total");
    if (xPage) headers.set("X-Page", xPage);
    if (xPerPage) headers.set("X-Per-Page", xPerPage);
    if (xTotal) headers.set("X-Total", xTotal);

    // Set cache control
    const cacheTime = getCacheTime(apiPath);
    headers.set("Cache-Control", `public, s-maxage=${cacheTime}, stale-while-revalidate=${cacheTime * 2}`);

    return new NextResponse(JSON.stringify(data), { status: 200, headers });
  } catch (error) {
    clearTimeout(timeoutId);

    // Distinguish timeout from other network errors
    if (error instanceof DOMException && error.name === "AbortError") {
      console.error(`PandaScore proxy timeout for ${apiPath} (>${FETCH_TIMEOUT_MS}ms)`);
      return NextResponse.json(
        { error: "Request to PandaScore API timed out. Please try again." },
        { status: 504 }
      );
    }

    console.error("PandaScore proxy error:", error);
    return NextResponse.json(
      { error: "Failed to connect to PandaScore API. Please check your connection." },
      { status: 502 }
    );
  }
}

function getCacheTime(path: string): number {
  if (path.includes("/running") || path.includes("/lives")) return 15;
  if (path.includes("/upcoming")) return 60;
  if (path.includes("/past")) return 300;
  if (path.includes("/videogames")) return 3600;
  return 120; // default 2 minutes
}
