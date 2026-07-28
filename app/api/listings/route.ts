import { NextRequest, NextResponse } from "next/server";
import { getListings } from "@/lib/services/listings";

const VALID_SORTS = ["trust_score", "experience", "projects"] as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const city = searchParams.get("city") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const rawSort = searchParams.get("sort");
    const sort = rawSort && VALID_SORTS.includes(rawSort as never)
      ? (rawSort as string)
      : undefined;

    const rawLimit = searchParams.get("limit");
    const limit = rawLimit ? Math.max(1, Math.min(parseInt(rawLimit, 10) || 20, 100)) : 20;

    const rawOffset = searchParams.get("offset");
    const offset = rawOffset ? Math.max(0, parseInt(rawOffset, 10) || 0) : 0;

    const { listings, total } = await getListings({
      category,
      city,
      search,
      sort,
      limit,
      offset,
    });

    return NextResponse.json({ listings, total });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
