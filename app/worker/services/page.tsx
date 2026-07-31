"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, X, GripVertical, Upload, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadServiceImage, deleteServiceImage } from "@/lib/supabase/storage";
import { formatPriceInput, parsePriceInput } from "@/lib/utils/currency";
import { useTranslations } from "next-intl";

type ServiceRow = {
  service_id: string;
  worker_id: string;
  name: string;
  description: string | null;
  price: number;
  price_unit: string;
  category: string | null;
  is_active: boolean;
  thumbnail_url: string | null;
  image_urls: string[];
  created_at: string;
  updated_at: string;
};

type ModalMode = "closed" | "add" | "edit";
type FormTab = "details" | "photos";

function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export default function WorkerServicesPage() {
  const t = useTranslations("workerServices");
  const PRICE_UNIT_LABELS: Record<string, string> = {
    fixed: t("priceUnits.fixed"),
    hourly: t("priceUnits.hourly"),
    daily: t("priceUnits.daily"),
  };
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>("closed");
  const [formTab, setFormTab] = useState<FormTab>("details");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formPriceUnit, setFormPriceUnit] = useState("fixed");
  const [formCategory, setFormCategory] = useState("");
  const [formThumbnail, setFormThumbnail] = useState<string | null>(null);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [priceError, setPriceError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  async function fetchServices() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const res = await fetch(`/api/worker-services`);
    if (res.ok) {
      const data = await res.json();
      setServices(data.map((s: Record<string, unknown>) => ({
        ...s,
        image_urls: Array.isArray(s.image_urls) ? s.image_urls : [],
      })));
    }
    setLoading(false);
  }

  useEffect(() => { fetchServices(); // eslint-disable-line react-hooks/set-state-in-effect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAdd() {
    setEditingId(null);
    setFormName("");
    setFormDescription("");
    setFormPrice("");
    setFormPriceUnit("fixed");
    setFormCategory("");
    setFormThumbnail(null);
    setFormImages([]);
    setPriceError("");
    setFormTab("details");
    setModalMode("add");
  }

  function openEdit(service: ServiceRow) {
    setEditingId(service.service_id);
    setFormName(service.name);
    setFormDescription(service.description ?? "");
    setFormPrice(formatPriceInput(String(service.price)));
    setFormPriceUnit(service.price_unit);
    setFormCategory(service.category ?? "");
    setFormThumbnail(service.thumbnail_url);
    setFormImages(service.image_urls);
    setPriceError("");
    setFormTab("details");
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode("closed");
    setEditingId(null);
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    if (formThumbnail) {
      await deleteServiceImage(formThumbnail).catch(() => {});
    }

    const tempId = "temp-" + Date.now();
    try {
      const url = await uploadServiceImage(file, tempId, "thumbnail");
      setFormThumbnail(url);
    } catch {
      // ignore
    }
    setUploading(false);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = 5 - formImages.length;
    if (remaining <= 0) return;

    setUploading(true);
    const tempId = "temp-" + Date.now();
    const batch = Array.from(files).slice(0, remaining);

    const urls: string[] = [];
    for (const file of batch) {
      try {
        const url = await uploadServiceImage(file, tempId, "gallery");
        urls.push(url);
      } catch {
        // skip failed uploads
      }
    }

    setFormImages((prev) => [...prev, ...urls]);
    setUploading(false);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  async function removeGalleryImage(url: string) {
    await deleteServiceImage(url).catch(() => {});
    setFormImages((prev) => prev.filter((u) => u !== url));
  }

  async function handleSave() {
    if (!formName.trim()) return;
    const parsedPrice = parsePriceInput(formPrice);
    if (parsedPrice === null || parsedPrice <= 0) {
      setPriceError(t("priceError"));
      return;
    }
    setSaving(true);
    setPriceError("");

    const body = {
      name: formName.trim(),
      description: formDescription.trim() || null,
      price: parsedPrice,
      priceUnit: formPriceUnit,
      category: formCategory.trim() || null,
      thumbnailUrl: formThumbnail,
      imageUrls: formImages,
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
          <h1 className="font-heading text-2xl font-medium tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" />
          {t("addService")}
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">{t("loading")}</div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GripVertical className="mb-4 size-12 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">{t("emptyTitle")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("emptyDescription")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.service_id}
              className="flex items-start gap-4 rounded-xl border border-border bg-bg-card p-5"
            >
              {service.thumbnail_url && (
                <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-bg-alt">
                  <img src={service.thumbnail_url} alt={service.name} className="size-full object-cover" />
                </div>
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{service.name}</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      service.is_active
                        ? "bg-sky/10 text-sky-active"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {service.is_active ? t("active") : t("inactive")}
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
                  title={service.is_active ? t("deactivate") : t("activate")}
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
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-sm font-semibold">
                {modalMode === "add" ? t("addService") : t("editService")}
              </h2>
              <button type="button" onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <div className="flex border-b border-border px-6">
              <button
                type="button"
                onClick={() => setFormTab("details")}
                className={`px-4 py-3 text-xs font-medium transition-colors ${
                  formTab === "details"
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("tabs.details")}
              </button>
              <button
                type="button"
                onClick={() => setFormTab("photos")}
                className={`px-4 py-3 text-xs font-medium transition-colors ${
                  formTab === "photos"
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("tabs.photos")}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {formTab === "details" && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("form.nameLabel")}</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder={t("form.namePlaceholder")}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("form.descriptionLabel")}</label>
                    <textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      rows={3}
                      placeholder={t("form.descriptionPlaceholder")}
                      className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("form.priceLabel")}</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formPrice}
                        onChange={(e) => {
                          setFormPrice(formatPriceInput(e.target.value));
                          setPriceError("");
                        }}
                        placeholder={t("form.pricePlaceholder")}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="w-32">
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("form.unitLabel")}</label>
                      <select
                        value={formPriceUnit}
                        onChange={(e) => setFormPriceUnit(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="fixed">{t("priceUnits.fixed")}</option>
                        <option value="hourly">{t("priceUnits.hourly")}</option>
                        <option value="daily">{t("priceUnits.daily")}</option>
                      </select>
                    </div>
                  </div>

                  {priceError && <p className="text-xs text-red-600">{priceError}</p>}

                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("form.categoryLabel")}</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">{t("form.categoryPlaceholder")}</option>
                      <option value="tukang">{t("categories.tukang")}</option>
                      <option value="ac">{t("categories.ac")}</option>
                      <option value="montir">{t("categories.montir")}</option>
                      <option value="fotografer">{t("categories.fotografer")}</option>
                      <option value="guru">{t("categories.guru")}</option>
                      <option value="tata_rias">{t("categories.tata_rias")}</option>
                      <option value="tukang_kayu">{t("categories.tukang_kayu")}</option>
                      <option value="tukang_cat">{t("categories.tukang_cat")}</option>
                    </select>
                  </div>
                </div>
              )}

              {formTab === "photos" && (
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted-foreground">
                      {t("photos.thumbnailLabel")} <span className="text-red-500">*</span>
                    </label>
                    <p className="mb-3 text-[10px] text-muted-foreground">
                      {t("photos.thumbnailHelper")}
                    </p>
                    {formThumbnail ? (
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-bg-alt">
                        <img src={formThumbnail} alt={t("photos.thumbnailAlt")} className="size-full object-cover" />
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteServiceImage(formThumbnail).catch(() => {});
                            setFormThumbnail(null);
                          }}
                          className="absolute right-2 top-2 rounded-full bg-white/80 p-1"
                        >
                          <X className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => thumbnailInputRef.current?.click()}
                          className="absolute bottom-2 right-2 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-medium"
                        >
                          {t("photos.replace")}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="flex aspect-video w-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-bg-alt text-muted-foreground hover:border-primary hover:text-primary"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="size-6" />
                          <span className="text-xs">{t("photos.clickToUpload")}</span>
                        </div>
                      </button>
                    )}
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleThumbnailUpload}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted-foreground">
                      {t("photos.galleryLabel")}
                    </label>
                    <p className="mb-3 text-[10px] text-muted-foreground">
                      {t("photos.galleryHelper")}
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {formImages.map((url) => (
                        <div key={url} className="relative aspect-square overflow-hidden rounded-lg bg-bg-alt">
                          <img src={url} alt={t("photos.galleryAlt")} className="size-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(url)}
                            className="absolute right-1 top-1 rounded-full bg-white/80 p-0.5"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                      {formImages.length < 5 && (
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          disabled={uploading}
                          className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border bg-bg-alt text-muted-foreground hover:border-primary hover:text-primary"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <ImageIcon className="size-5" />
                            <span className="text-[10px]">{t("photos.add")}</span>
                          </div>
                        </button>
                      )}
                    </div>
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      className="hidden"
                      onChange={handleGalleryUpload}
                    />
                    {uploading && (
                      <p className="mt-2 text-xs text-muted-foreground">{t("photos.uploading")}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  {t("cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!formName.trim() || !formPrice.trim() || !formThumbnail || saving}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving ? t("form.saving") : t("form.save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-xl">
            <h2 className="text-sm font-semibold">{t("deleteTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("deleteConfirm")}
            </p>
            <div className="mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingId)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
