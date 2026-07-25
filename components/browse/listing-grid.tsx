import { ListingCard } from "@/components/browse/listing-card";
import type { BrowseListing } from "@/lib/browse/mock-data";

export function ListingGrid({ listings }: { listings: BrowseListing[] }) {
  return (
    <div className="grid gap-5 grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
