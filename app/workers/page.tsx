import { createClient } from "@/lib/supabase/server";
import { listWorkers } from "@/lib/repositories/worker.repo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Search } from "lucide-react";
import { getServerTranslator } from "@/lib/i18n-server";

export default async function WorkersPage(props: { searchParams: Promise<{ city?: string; jobCategory?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const t = await getServerTranslator("admin");
  const workers = await listWorkers(supabase, {
    city: searchParams.city,
    jobCategory: searchParams.jobCategory,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium tracking-tight">
            {t("workers.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("workers.subtitle", { count: workers.length })}
          </p>
        </div>
      </div>

      <form method="GET" className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="city"
            placeholder={t("workers.filterCity")}
            defaultValue={searchParams.city ?? ""}
            className="pl-9"
          />
        </div>
        <Input
          name="jobCategory"
          placeholder={t("workers.filterCategory")}
          defaultValue={searchParams.jobCategory ?? ""}
          className="max-w-60"
        />
        <Button type="submit" variant="secondary" size="sm">
          {t("workers.search")}
        </Button>
        {(searchParams.city || searchParams.jobCategory) && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/workers">{t("workers.reset")}</Link>
          </Button>
        )}
      </form>

      <Card>
        <CardHeader>
          <CardTitle>{t("workers.listTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-6 py-3 font-medium">{t("workers.tableName")}</th>
                <th className="px-6 py-3 font-medium">{t("workers.tableCity")}</th>
                <th className="px-6 py-3 font-medium">{t("workers.tableCategory")}</th>
                <th className="px-6 py-3 font-medium">{t("workers.tableExperience")}</th>
                <th className="px-6 py-3 font-medium">{t("workers.tableScore")}</th>
                <th className="px-6 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker.worker_id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium">{worker.full_name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{worker.city}</td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary">{worker.job_category}</Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {t("workers.yearsShort", { years: worker.years_experience })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={worker.trust_score >= 70 ? "font-semibold text-sky-active" : worker.trust_score >= 40 ? "" : "text-muted-foreground"}>
                      {worker.trust_score}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="xs" asChild>
                      <Link href={`/workers/${worker.worker_id}`}>
                        {t("workers.detail")}
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {workers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    {t("workers.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
