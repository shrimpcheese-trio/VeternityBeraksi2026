export function ProfileLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-6">
      <aside className="w-96 shrink-0">{sidebar}</aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
