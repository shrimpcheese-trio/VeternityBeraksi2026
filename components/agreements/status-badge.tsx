import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  draft: "bg-amber-500/10 text-amber-600 border-amber-200",
  active: "bg-green-500/10 text-green-600 border-green-200",
  completed: "bg-blue-500/10 text-blue-600 border-blue-200",
  disputed: "bg-red-500/10 text-red-600 border-red-200",
};

const statusLabels: Record<string, string> = {
  draft: "Penawaran",
  active: "Aktif",
  completed: "Selesai",
  disputed: "Sengketa",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        statusStyles[status] ?? "bg-gray-500/10 text-gray-600 border-gray-200",
      )}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}
