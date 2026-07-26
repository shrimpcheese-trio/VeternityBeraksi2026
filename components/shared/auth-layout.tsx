import type { ReactNode } from "react";

export function AuthLayout({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
