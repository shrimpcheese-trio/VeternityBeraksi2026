import { SearchX } from "lucide-react";
import { ListingCard } from "@/components/browse/listing-card";
import type { ListingResult } from "@/lib/services/listings";

export function ListingGrid({ listings }: { listings: ListingResult[] }) {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <SearchX className="size-10 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">
          Tidak ada pekerja ditemukan
        </p>
        <p className="text-xs text-muted-foreground">
          Coba ubah filter atau kata kunci pencarian
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={`${listing.id}-${listing.serviceId}`} listing={listing} />
      ))}
    </div>
  );
}
