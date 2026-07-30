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

    const expMin = searchParams.get("exp_min") ? parseInt(searchParams.get("exp_min")!, 10) : undefined;
    const expMax = searchParams.get("exp_max") ? parseInt(searchParams.get("exp_max")!, 10) : undefined;
    const projectsMin = searchParams.get("projects_min") ? parseInt(searchParams.get("projects_min")!, 10) : undefined;
    const projectsMax = searchParams.get("projects_max") ? parseInt(searchParams.get("projects_max")!, 10) : undefined;
    const priceMin = searchParams.get("price_min") ? parseInt(searchParams.get("price_min")!, 10) : undefined;
    const priceMax = searchParams.get("price_max") ? parseInt(searchParams.get("price_max")!, 10) : undefined;

    const { listings, total } = await getListings({
      category,
      city,
      search,
      sort,
      limit,
      offset,
      experience_min: expMin,
      experience_max: expMax,
      projects_min: projectsMin,
      projects_max: projectsMax,
      price_min: priceMin,
      price_max: priceMax,
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
