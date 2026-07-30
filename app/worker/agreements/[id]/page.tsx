import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { getAgreementById } from "@/lib/repositories/agreement.repo";
import { AgreementDetail } from "@/components/agreements/agreement-detail";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function WorkerAgreementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const agreement = await getAgreementById(supabase, id);

  if (!agreement) notFound();
  if (agreement.worker_id !== user.id) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/worker/agreements"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar
      </Link>

      <AgreementDetail agreement={agreement} />
    </div>
  );
}
