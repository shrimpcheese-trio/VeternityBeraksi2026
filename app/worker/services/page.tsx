"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, GripVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ServiceRow = {
  service_id: string;
  worker_id: string;
  name: string;
  description: string | null;
  price: number;
  price_unit: string;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ModalMode = "closed" | "add" | "edit";

const PRICE_UNIT_LABELS: Record<string, string> = {
  fixed: "Harga Tetap",
  hourly: "Per Jam",
  daily: "Per Hari",
};

function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export default function WorkerServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>("closed");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formPriceUnit, setFormPriceUnit] = useState("fixed");
  const [formCategory, setFormCategory] = useState("");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  async function fetchServices() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const res = await fetch(`/api/worker-services`);
    if (res.ok) {
      const data = await res.json();
      setServices(data);
    }
    setLoading(false);
  }

  useEffect(() => { fetchServices(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  function openAdd() {
    setEditingId(null);
    setFormName("");
    setFormDescription("");
    setFormPrice("");
    setFormPriceUnit("fixed");
    setFormCategory("");
    setModalMode("add");
  }

  function openEdit(service: ServiceRow) {
    setEditingId(service.service_id);
    setFormName(service.name);
    setFormDescription(service.description ?? "");
    setFormPrice(String(service.price));
    setFormPriceUnit(service.price_unit);
    setFormCategory(service.category ?? "");
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode("closed");
    setEditingId(null);
  }

  async function handleSave() {
    if (!formName.trim() || !formPrice.trim()) return;
    setSaving(true);

    const body = {
      name: formName.trim(),
      description: formDescription.trim() || null,
      price: Number(formPrice),
      priceUnit: formPriceUnit,
      category: formCategory.trim() || null,
    };

    if (modalMode === "add") {
      const res = await fetch("/api/worker-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setModalMode("closed");
        fetchServices();
      }
    } else if (modalMode === "edit" && editingId) {
      const res = await fetch(`/api/worker-services/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        closeModal();
        fetchServices();
      }
    }

    setSaving(false);
  }

  async function handleToggleActive(service: ServiceRow) {
    await fetch(`/api/worker-services/${service.service_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !service.is_active }),
    });
    fetchServices();
  }

  async function handleDelete(serviceId: string) {
    await fetch(`/api/worker-services/${serviceId}`, { method: "DELETE" });
    setDeletingId(null);
    fetchServices();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium tracking-tight">Layanan Saya</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola layanan yang Anda tawarkan kepada pemberi kerja.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Tambah Layanan
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Memuat...</div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GripVertical className="mb-4 size-12 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">Belum ada layanan.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tambah layanan pertama Anda agar pemberi kerja dapat melihatnya.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.service_id}
              className="flex items-start gap-4 rounded-xl border border-border bg-surface-card p-5"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{service.name}</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      service.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {service.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                {service.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
                )}
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-sm font-medium text-primary">
                    {formatPrice(service.price)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    / {PRICE_UNIT_LABELS[service.price_unit] ?? service.price_unit}
                  </span>
                  {service.category && (
                    <span className="text-[10px] text-muted-foreground">
                      {service.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleToggleActive(service)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title={service.is_active ? "Nonaktifkan" : "Aktifkan"}
                >
                  <span className="size-3.5 block rounded-sm border border-current" />
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(service)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingId(service.service_id)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(modalMode === "add" || modalMode === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">
                {modalMode === "add" ? "Tambah Layanan" : "Edit Layanan"}
              </h2>
              <button type="button" onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Nama Layanan</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Misal: Service AC, Pasang AC Baru"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Deskripsi</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  placeholder="Jelaskan layanan yang Anda tawarkan..."
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Harga</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="150000"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="w-32">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Satuan</label>
                  <select
                    value={formPriceUnit}
                    onChange={(e) => setFormPriceUnit(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="fixed">Harga Tetap</option>
                    <option value="hourly">Per Jam</option>
                    <option value="daily">Per Hari</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Kategori</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Pilih kategori...</option>
                  <option value="tukang">Tukang</option>
                  <option value="ac">Teknisi AC</option>
                  <option value="montir">Montir</option>
                  <option value="fotografer">Fotografer</option>
                  <option value="guru">Guru Les</option>
                  <option value="tata_rias">Tata Rias</option>
                  <option value="tukang_kayu">Tukang Kayu</option>
                  <option value="tukang_cat">Tukang Cat</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!formName.trim() || !formPrice.trim() || saving}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-xl">
            <h2 className="text-sm font-semibold">Hapus Layanan</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Apakah Anda yakin ingin menghapus layanan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingId)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
