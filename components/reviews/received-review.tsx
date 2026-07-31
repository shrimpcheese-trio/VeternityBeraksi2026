import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getServerTranslator } from "@/lib/i18n-server";
import { getLocale } from "@/lib/i18n";

export async function ReceivedReview({
  rating,
  comment,
  photoUrls,
  employerName,
  createdAt,
}: {
  rating: number;
  comment: string | null;
  photoUrls: string[];
  employerName: string;
  createdAt: string;
}) {
  const t = await getServerTranslator("reviews");
  const locale = await getLocale();
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Star className="size-4 text-amber-400" />
          <CardTitle className="font-heading text-lg font-medium">
            {t("received.title")}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{employerName}</p>
          <span className="text-xs text-muted-foreground">
            {new Date(createdAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={cn(
                "size-4",
                index < rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground",
              )}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {t("received.score", { rating })}
          </span>
        </div>

        {comment && (
          <p className="text-sm text-muted-foreground">{comment}</p>
        )}

        {photoUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {photoUrls.map((photoUrl) => (
              <div
                key={photoUrl}
                className="aspect-video overflow-hidden rounded-xl bg-bg-alt"
              >
                <img
                  src={photoUrl}
                  alt={t("received.photoAlt")}
                  className="size-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
