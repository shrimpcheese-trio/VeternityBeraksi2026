export function DuotoneBox({ className = "", aspect = "aspect-square" }: { className?: string; aspect?: string }) {
  return (
    <div className={`${aspect} w-full overflow-hidden rounded-xl bg-surface-soft ${className}`}>
      <div className="flex h-full w-full items-center justify-center text-step--1 font-medium uppercase tracking-widest text-muted-foreground/40">
        Image
      </div>
    </div>
  );
}
