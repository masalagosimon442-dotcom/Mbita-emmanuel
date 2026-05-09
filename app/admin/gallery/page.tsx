"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import GalleryItemForm from "@/components/forms/admin/GalleryItemForm";

interface GalleryItem {
  id: string;
  imageUrl: string;
  alt: string;
  caption: string;
  category: string;
  published: boolean;
}

export const dynamic = "force-dynamic";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [publishedFilter, setPublishedFilter] = useState<"all" | "published" | "hidden">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function loadItems() {
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      setItems(data);
    } catch {
      showToast("error", "Failed to load gallery items.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadItems(); }, []);

  async function handleSubmit(formData: {
    imageUrl: string; alt: string; caption: string; category: string; published: boolean;
  }) {
    setSaving(true);
    const payload = { ...formData, id: editingItem?.id };

    try {
      const res = await fetch("/api/admin/gallery", {
        method: editingItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        showToast("success", editingItem ? "Item updated." : "Item added.");
        setModalOpen(false);
        loadItems();
      } else {
        showToast("error", data.error ?? "Failed to save item.");
      }
    } catch {
      showToast("error", "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: GalleryItem) {
    if (!window.confirm(`Delete "${item.caption}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${item.id}`, { method: "DELETE" });
      if (res.ok) { showToast("success", "Item deleted."); loadItems(); }
      else showToast("error", "Failed to delete item.");
    } catch { showToast("error", "An unexpected error occurred."); }
  }

  async function handleTogglePublish(item: GalleryItem) {
    // Confirm before unpublishing
    if (item.published && !window.confirm(`Unpublish "${item.caption}"? It will be hidden from the public site.`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, published: !item.published }),
      });
      if (res.ok) { showToast("success", item.published ? "Item unpublished." : "Item published."); loadItems(); }
      else showToast("error", "Failed to update publish status.");
    } catch { showToast("error", "An unexpected error occurred."); }
  }

  const filteredItems = items.filter((item) => {
    if (publishedFilter === "published" && !item.published) return false;
    if (publishedFilter === "hidden" && item.published) return false;
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Gallery</h2>
          <p className="text-gray-600 mt-1">Manage gallery images</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value as "all" | "published" | "hidden")}
            className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Visibility</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            {[...new Set(items.map((i) => i.category))].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <Button variant="primary" onClick={() => { setEditingItem(null); setModalOpen(true); }}>+ Add Image</Button>
        </div>
      </div>

      {toast && (
        <div role="alert" className={["mb-4 p-3 rounded-md text-sm font-medium", toast.type === "success" ? "bg-green-50 border border-green-300 text-green-800" : "bg-red-50 border border-red-300 text-red-700"].join(" ")}>
          {toast.message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading…</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white border border-border rounded-lg text-gray-500">No gallery items yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white border border-border rounded-lg overflow-hidden">
              <div className="relative w-full h-40 bg-navy-100">
                <Image
                  src={item.imageUrl}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-navy-900 truncate">{item.caption}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    className={["px-2 py-0.5 rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary", item.published ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"].join(" ")}
                  >
                    {item.published ? "Published" : "Draft"}
                  </button>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); setModalOpen(true); }}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item)}>✕</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? "Edit Gallery Item" : "Add Gallery Item"} size="lg">
        <GalleryItemForm initialData={editingItem ?? undefined} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} isLoading={saving} />
      </Modal>
    </div>
  );
}
