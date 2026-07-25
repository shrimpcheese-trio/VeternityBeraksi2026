import { Search } from "lucide-react";

export function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5">
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-soft"
      />
      <button
        type="button"
        className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-active"
      >
        <Search size={16} />
      </button>
    </div>
  );
}
