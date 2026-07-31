import { cn } from "@/lib/utils";
import { getServerTranslator } from "@/lib/i18n-server";

const statusStyles: Record<string, string> = {
  draft: "bg-bg-alt text-navy border-border",
  active: "bg-sky/10 text-sky border-sky/20",
  completed: "bg-sky/10 text-sky-active border-sky/30",
  disputed: "bg-coral/10 text-coral border-coral/20",
};

export async function StatusBadge({ status }: { status: string }) {
  const t = await getServerTranslator("agreement");
  const labelByStatus: Record<string, string> = {
    draft: t("status.draft"),
    active: t("status.active"),
    completed: t("status.completed"),
    disputed: t("status.disputed"),
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        statusStyles[status] ?? "bg-gray-500/10 text-gray-600 border-gray-200",
      )}
    >
      {labelByStatus[status] ?? status}
    </span>
  );
}
