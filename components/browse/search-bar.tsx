"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar({ placeholder, defaultQuery }: { placeholder: string; defaultQuery: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = (formData.get("query") as string).trim();
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.push(`/browse?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5">
      <input
        name="query"
        type="text"
        defaultValue={defaultQuery}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-sky-active"
      >
        <Search size={16} />
      </button>
    </form>
  );
}
