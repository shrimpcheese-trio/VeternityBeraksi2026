"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  User,
  ShieldCheck,
  BadgeCheck,
  CreditCard,
  MapPin,
  Globe,
  Plus,
  Trash2,
  Edit3,
  MoreHorizontal,
  Building2,
  Phone,
  Lock,
  Bell,
  Mail,
  AlertTriangle,
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  Upload,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select } from "@/components/ui/select"
import { SettingsSidebar } from "@/components/settings/settings-sidebar"
import { updateAccount, updatePassword, deleteAccount } from "@/lib/actions/settings"

const industryOptions = [
  { value: "construction", label: "Konstruksi & Bangunan" },
  { value: "automotive", label: "Otomotif" },
  { value: "photography", label: "Fotografi" },
  { value: "education", label: "Pendidikan" },
  { value: "technology", label: "Teknologi" },
  { value: "cleaning", label: "Kebersihan" },
  { value: "other", label: "Lainnya" },
]

const payoutOptions = [
  { value: "manual", label: "Manual — Cairkan manual" },
  { value: "weekly", label: "Mingguan — Setiap hari Senin" },
  { value: "biweekly", label: "Dua Mingguan — Tanggal 1 & 15" },
  { value: "monthly", label: "Bulanan — Tanggal 1" },
]

type VerificationItem = {
  key: string
  icon: React.ReactNode
  status: "verified" | "pending" | "unverified"
}

type BankAccount = {
  id: string
  bank: string
  name: string
  number: string
  status: "active" | "inactive"
}

function SectionCard({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="rounded-xl border border-border bg-background p-5"
    >
      {children}
    </section>
  )
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export function SettingsForm({
  role,
  userName,
  userEmail,
  phone: initialPhone,
  city: initialCity,
  companyName: initialCompanyName,
  avatarUrl,
  isGoogleAccount,
  sessions: initialSessions,
  bio: initialBio,
  locationVisible: initialLocationVisible,
}: {
  role: "worker" | "employer"
  userName: string
  userEmail: string
  phone?: string
  city?: string
  companyName?: string
  avatarUrl?: string
  isGoogleAccount?: boolean
  sessions?: Array<{ id: string; device: string; location: string; lastActive: string; isCurrent?: boolean }>
  bio?: string
  locationVisible?: boolean
}) {
  const router = useRouter()
  const t = useTranslations("settings")
  const [activeSection, setActiveSection] = useState("account")
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const observerRef = useRef<IntersectionObserver | null>(null)

  const sectionIds = [
    "account",
    "company",
    "verification",
    "payment",
    "notifications",
    "security",
    "dangerZone",
  ]

  const [form, setForm] = useState({
    name: userName,
    email: userEmail,
    phone: initialPhone ?? "",
    companyName: initialCompanyName ?? "",
    regNumber: "",
    city: initialCity ?? "",
    industry: "",
    payoutSchedule: "manual",
    bio: initialBio ?? "",
    locationVisible: initialLocationVisible ?? true,
  })

  const [saving, setSaving] = useState(false)
  const [saveResult, setSaveResult] = useState<{ error?: string | null; success?: boolean }>({})
  const [changingPassword, setChangingPassword] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [passwordResult, setPasswordResult] = useState<{ error?: string | null; success?: boolean }>({})

  const [showPassword, setShowPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const [notifications, setNotifications] = useState({
    offers: true,
    payments: true,
    listingExpiry: false,
    messages: true,
  })

  const [documents, setDocuments] = useState<Record<string, string>>({})

  const [verifications] = useState<VerificationItem[]>([
    {
      key: "id",
      icon: <ShieldCheck className="size-4" />,
      status: "verified",
    },
    {
      key: "company",
      icon: <BadgeCheck className="size-4" />,
      status: "pending",
    },
    {
      key: "bank",
      icon: <CreditCard className="size-4" />,
      status: "unverified",
    },
  ])

  const [bankAccounts] = useState<BankAccount[]>([
    { id: "1", bank: "BCA", name: "Budi Santoso", number: "****1234", status: "active" },
    { id: "2", bank: "Mandiri", name: "Budi Santoso", number: "****5678", status: "active" },
  ])

  const [sessions] = useState(initialSessions ?? [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    )

    for (const id of sectionIds) {
      const el = sectionRefs.current[id]
      if (el) observerRef.current.observe(el)
    }

    return () => observerRef.current?.disconnect()
  }, [])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleAccountSave(formData: FormData) {
    setSaving(true)
    setSaveResult({})
    try {
      const result = await updateAccount({ error: null, success: false }, formData)
      setSaveResult(result)
      if (result.success) {
        const name = formData.get("name")?.toString().trim() ?? form.name
        const city = formData.get("city")?.toString().trim() ?? form.city
        const bio = formData.get("bio")?.toString().trim() ?? form.bio
        const locationVisible = formData.get("locationVisible") === "true"
        setForm((prev) => ({ ...prev, name, city, bio, locationVisible }))
        router.refresh()
      }
    } catch {
      setSaveResult({ error: "Terjadi kesalahan. Silakan coba lagi." })
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordChange(formData: FormData) {
    setChangingPassword(true)
    setPasswordResult({})
    try {
      const result = await updatePassword({ error: null, success: false }, formData)
      setPasswordResult(result)
    } catch {
      setPasswordResult({ error: "Terjadi kesalahan. Silakan coba lagi." })
    } finally {
      setChangingPassword(false)
    }
  }

  function handleDocUpload(key: string) {
    setDocuments((prev) => ({ ...prev, [key]: "uploaded" }))
  }

  function removeDoc(key: string) {
    setDocuments((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const statusLabel = (s: VerificationItem["status"]) => {
    if (s === "verified") return "Terverifikasi"
    if (s === "pending") return "Menunggu"
    return "Belum"
  }

  const statusVariant = (s: VerificationItem["status"]) => {
    if (s === "verified") return "default" as const
    if (s === "pending") return "secondary" as const
    return "outline" as const
  }

  const actionLabel = (s: VerificationItem["status"]) => {
    if (s === "verified") return "Lihat"
    if (s === "pending") return "Kirim Ulang"
    return "Verifikasi"
  }

  const docLabel = (key: string) => {
    if (key === "license") return "Surat Izin Usaha"
    if (key === "taxId") return "NPWP"
    return key
  }

  return (
    <div className="flex gap-6">
      <aside className="sticky top-6 w-56 shrink-0 self-start">
        <SettingsSidebar activeSection={activeSection} onSectionClick={scrollTo} />
      </aside>

      <main className="min-w-0 flex-1 space-y-8">
        <div>
          <h1 className="text-xl font-semibold">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <hr className="border-border" />

        {/* ── Account ── */}
        <SectionCard id="account">
          <div ref={(el) => { sectionRefs.current["account"] = el }}>
            <SectionHeader title={t("account.title")} description={t("account.description")} />
            <form onSubmit={(e) => { e.preventDefault(); handleAccountSave(new FormData(e.currentTarget)); }}>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{t("account.name")}</label>
                  <Input name="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{t("account.email")}</label>
                  <Input name="email" type="email" value={form.email} disabled />
                  <p className="mt-1 text-xs text-muted-foreground">{t("account.emailHelper")}</p>
                </div>
                {role === "employer" && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">{t("account.phone")}</label>
                    <Input name="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+62 xxx xxxx xxxx" />
                  </div>
                )}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Kota</label>
                  <Input name="city" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Jakarta Selatan" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{t("account.avatar")}</label>
                  <div className="flex items-center gap-4">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={userName} className="size-16 rounded-full object-cover" />
                    ) : (
                      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" type="button">{t("account.upload")}</Button>
                      <Button variant="ghost" size="sm" type="button">{t("account.remove")}</Button>
                    </div>
                  </div>
                </div>

                {role === "worker" && (
                  <>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Bio</label>
                      <textarea
                        name="bio"
                        value={form.bio}
                        onChange={(e) => update("bio", e.target.value)}
                        placeholder="Ceritakan tentang diri Anda..."
                        className="flex min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">Tampilkan lokasi</p>
                        <p className="text-xs text-muted-foreground">Biarkan pelanggan melihat kota Anda di profil publik</p>
                      </div>
                      <input name="locationVisible" type="hidden" value={form.locationVisible ? "true" : "false"} />
                      <Switch checked={form.locationVisible} onCheckedChange={(v) => update("locationVisible", v)} />
                    </div>
                  </>
                )}
              </div>
              {saveResult.success && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-emerald-600"><CheckCircle2 className="size-4" /> Data berhasil disimpan.</p>
              )}
              {saveResult.error && (
                <p className="mt-3 text-sm text-destructive">{saveResult.error}</p>
              )}
              <div className="mt-4 flex items-center gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
                {role === "worker" && (
                  <Button variant="outline" asChild>
                    <Link href="/profile">Lihat profil publik</Link>
                  </Button>
                )}
              </div>
            </form>
          </div>
        </SectionCard>

        {role === "employer" && (
          <SectionCard id="company">
            <div ref={(el) => { sectionRefs.current["company"] = el }}>
              <SectionHeader title={t("company.title")} description={t("company.description")} />
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{t("company.companyName")}</label>
                  <Input value={form.companyName} onChange={(e) => update("companyName", e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{t("company.regNumber")}</label>
                  <Input value={form.regNumber} onChange={(e) => update("regNumber", e.target.value)} />
                </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">{t("company.address")}</label>
                    <Input value={form.city} onChange={(e) => update("city", e.target.value)} />
                  </div>
                {(["license", "taxId"] as const).map((doc) => (
                  <div key={doc}>
                    <label className="mb-1.5 block text-sm font-medium">{docLabel(doc)}</label>
                    {documents[doc] ? (
                      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="size-4 text-primary" />
                        </div>
                        <span className="flex-1 text-sm font-medium">{docLabel(doc)}.pdf</span>
                        <Button variant="ghost" size="icon-xs" onClick={() => removeDoc(doc)}>
                          <Trash2 className="size-3.5 text-destructive" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => handleDocUpload(doc)}>
                        <Upload className="size-3.5" />
                        {t("company.uploadDocument")}
                      </Button>
                    )}
                  </div>
                ))}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{t("company.industry")}</label>
                  <Select options={industryOptions} value={form.industry} onValueChange={(v) => update("industry", v)} placeholder={t("company.industryPlaceholder")} />
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── Verification & Trust ── */}
        <SectionCard id="verification">
          <div ref={(el) => { sectionRefs.current["verification"] = el }}>
            <SectionHeader title={t("verification.title")} description={t("verification.description")} />
            <div className="space-y-3">
              {verifications.map((v) => (
                <div key={v.key} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    {v.icon}
                  </div>
                  <span className="flex-1 text-sm font-medium">{t(`verification.${v.key}`)}</span>
                  <Badge variant={statusVariant(v.status)}>{statusLabel(v.status)}</Badge>
                  <Button variant="outline" size="xs">{actionLabel(v.status)}</Button>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-muted/30 p-4 text-sm text-muted-foreground">
              <p>{t("verification.trustExplainer")}</p>
            </div>
          </div>
        </SectionCard>

        {/* ── Payment & Payout ── */}
        <SectionCard id="payment">
          <div ref={(el) => { sectionRefs.current["payment"] = el }}>
            <SectionHeader title={t("payment.title")} description={t("payment.description")} />
            <div className="space-y-3">
              {bankAccounts.map((acc) => (
                <div key={acc.id} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{acc.bank} — {acc.number}</p>
                    <p className="text-xs text-muted-foreground">{acc.name}</p>
                  </div>
                  <Badge variant={acc.status === "active" ? "default" : "secondary"}>
                    {acc.status === "active" ? "Aktif" : "Nonaktif"}
                  </Badge>
                  <div className="relative">
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full gap-2">
                <Plus className="size-4" />
                {t("payment.addBank")}
              </Button>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium">{t("payment.payoutSchedule")}</label>
              <Select options={payoutOptions} value={form.payoutSchedule} onValueChange={(v) => update("payoutSchedule", v)} />
            </div>
          </div>
        </SectionCard>

        {/* ── Notifications ── */}
        <SectionCard id="notifications">
          <div ref={(el) => { sectionRefs.current["notifications"] = el }}>
            <SectionHeader title={t("notifications.title")} description={t("notifications.description")} />
            <div className="space-y-4">
              {(["offers", "payments", "listingExpiry", "messages"] as const).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t(`notifications.${key}`)}</p>
                    <p className="text-xs text-muted-foreground">{t(`notifications.${key}Helper`)}</p>
                  </div>
                  <Switch
                    checked={notifications[key]}
                    onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* ── Security ── */}
        <SectionCard id="security">
          <div ref={(el) => { sectionRefs.current["security"] = el }}>
            <SectionHeader title={t("security.title")} description={t("security.description")} />
            <div className="space-y-6">
              {isGoogleAccount ? (
                <div className="rounded-xl bg-muted/30 p-4 text-sm text-muted-foreground">
                  <p>Akun ini masuk menggunakan Google. Kata sandi dikelola oleh Google dan tidak dapat diubah di sini.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); handlePasswordChange(new FormData(e.currentTarget)); }}>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">{t("security.currentPassword")}</label>
                      <div className="relative">
                        <Input name="current" type={showPassword ? "text" : "password"} value={passwordForm.current} onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">{t("security.newPassword")}</label>
                      <Input name="new" type="password" value={passwordForm.new} onChange={(e) => setPasswordForm((p) => ({ ...p, new: e.target.value }))} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">{t("security.confirmPassword")}</label>
                      <Input name="confirm" type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))} />
                    </div>
                    {passwordResult.success && (
                      <p className="flex items-center gap-1.5 text-sm text-emerald-600"><CheckCircle2 className="size-4" /> Kata sandi berhasil diperbarui.</p>
                    )}
                    {passwordResult.error && (
                      <p className="text-sm text-destructive">{passwordResult.error}</p>
                    )}
                    <Button type="submit" size="sm" disabled={changingPassword}>
                      {changingPassword ? "Memperbarui..." : t("security.updatePassword")}
                    </Button>
                  </div>
                </form>
              )}

              <hr className="border-border" />

              <div>
                <p className="mb-3 text-sm font-medium">{t("security.sessions")} {sessions.length > 0 && <span className="text-muted-foreground font-normal">({sessions.length})</span>}</p>
                {sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Tidak ada sesi aktif.</p>
                ) : (
                  <div className="space-y-2">
                    {sessions.map((s) => (
                      <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                          <Globe className="size-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{s.device}</p>
                            {s.isCurrent && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Saat ini</span>}
                          </div>
                          <p className="text-xs text-muted-foreground">{s.location} &middot; {s.lastActive}</p>
                        </div>
                        {!s.isCurrent && (
                          <Button variant="ghost" size="xs" className="text-destructive">{t("security.revoke")}</Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Danger Zone ── */}
        <SectionCard id="dangerZone">
          <div ref={(el) => { sectionRefs.current["dangerZone"] = el }} className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="size-5 text-destructive" />
              </div>
                <div>
                  <h2 className="text-base font-semibold text-destructive">{t("dangerZone.title")}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{t("dangerZone.description")}</p>
                  {confirmDelete ? (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-destructive">Apakah Anda yakin ingin menghapus akun? Semua data akan hilang dan tidak dapat dikembalikan.</p>
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm" className="gap-2" disabled={deleting} onClick={async () => {
                          setDeleting(true)
                          const result = await deleteAccount()
                          if (result.success) {
                            window.location.href = "/"
                          }
                          setDeleting(false)
                          setConfirmDelete(false)
                        }}>
                          <Trash2 className="size-4" />
                          {deleting ? "Menghapus..." : "Ya, hapus akun"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>
                          Batal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="destructive" size="sm" className="mt-4 gap-2" onClick={() => setConfirmDelete(true)}>
                      <Trash2 className="size-4" />
                      {t("dangerZone.deleteAccount")}
                    </Button>
                  )}
                </div>
            </div>
          </div>
        </SectionCard>
      </main>
    </div>
  )
}
