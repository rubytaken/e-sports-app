import { NextRequest, NextResponse } from "next/server";

const NEWS_API_BASE = "https://newsapi.org/v2";

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    return NextResponse.json(
      {
        error:
          "News API key not configured. Get a free key at https://newsapi.org/register and set NEWS_API_KEY in .env.local",
      },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "esports";
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "12";
  const language = searchParams.get("language") || "en";
  const sortBy = searchParams.get("sortBy") || "publishedAt";

  // Build the search query to focus on esports/gaming news
  const esportsQuery = query === "esports"
    ? "(esports OR esport OR \"e-sports\" OR \"competitive gaming\" OR \"pro gaming\")"
    : `(${query}) AND (esports OR gaming)`;

  const url = new URL(`${NEWS_API_BASE}/everything`);
  url.searchParams.set("q", esportsQuery);
  url.searchParams.set("page", page);
  url.searchParams.set("pageSize", pageSize);
  url.searchParams.set("language", language);
  url.searchParams.set("sortBy", sortBy);
  url.searchParams.set("apiKey", apiKey);

  try {
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: `News API error: ${response.status}`,
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=1200"
    );

    return new NextResponse(JSON.stringify(data), { status: 200, headers });
  } catch (error) {
    console.error("News API proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news from News API" },
      { status: 502 }
    );
  }
}
