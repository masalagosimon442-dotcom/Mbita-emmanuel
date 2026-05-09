"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  photoUrl?: string | null;
  published: boolean;
}

interface FormData {
  name: string;
  role: string;
  content: string;
  photoUrl: string;
  published: boolean;
}

const empty: FormData = { name: "", role: "", content: "", photoUrl: "", published: true };

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<FormData>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [publishedFilter, setPublishedFilter] = useState<"all" | "published" | "hidden">("all");

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/testimonials");
    if (res.ok) setItems(await res.json());
    else showToast("error", "Failed to load testimonials.");
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (item: Testimonial) => {
    setEditing(item);
    setForm({ name: item.name, role: item.role, content: item.content, photoUrl: item.photoUrl ?? "", published: item.published });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const body = editing ? { id: editing.id, ...form } : form;
    const res = await fetch("/api/admin/testimonials", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) {
      showToast("success", editing ? "Testimonial updated." : "Testimonial added.");
      setModalOpen(false);
      fetchItems();
    } else {
      const data = await res.json().catch(() => ({}));
      showToast("error", data.error ?? "Failed to save testimonial.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/testimonials?id=${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    if (res.ok) {
      showToast("success", "Testimonial deleted.");
      fetchItems();
    } else {
      showToast("error", "Failed to delete testimonial.");
    }
  };

  const inputClass = "w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  const filteredItems = items.filter((item) => {
    if (publishedFilter === "published") return item.published;
    if (publishedFilter === "hidden") return !item.published;
    return true;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Testimonials</h1>
        <div className="flex items-center gap-2">
          <select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value as "all" | "published" | "hidden")}
            className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </select>
          <Button variant="primary" onClick={openCreate}>+ Add Testimonial</Button>
        </div>
      </div>

      {toast && (
        <div role="alert" className={`mb-4 p-3 rounded-lg text-sm font-medium ${toast.type === "success" ? "bg-green-50 border border-green-300 text-green-800" : "bg-red-50 border border-red-300 text-red-700"}`}>
          {toast.message}
        </div>
      )}

      {loading ? (
        <p className="text-navy-500">Loading...</p>
      ) : filteredItems.length === 0 ? (
        <p className="text-navy-500 text-center py-12">No testimonials yet.</p>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 p-4 bg-white border border-border rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy-900">{item.name}</p>
                <p className="text-sm text-navy-500">{item.role}</p>
                <p className="text-sm text-navy-600 mt-1 line-clamp-2 italic">&ldquo;{item.content}&rdquo;</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {item.published ? "Published" : "Hidden"}
                </span>
                <Button variant="ghost" onClick={() => openEdit(item)}>Edit</Button>
                <Button variant="danger" onClick={() => setDeleteId(item.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Testimonial" : "Add Testimonial"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="t-name" className="block text-sm font-medium mb-1">Name *</label>
              <input id="t-name" required value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label htmlFor="t-role" className="block text-sm font-medium mb-1">Role *</label>
              <input id="t-role" required value={form.role} onChange={(e) => setForm(p => ({ ...p, role: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="t-content" className="block text-sm font-medium mb-1">Testimonial *</label>
            <textarea id="t-content" required rows={4} value={form.content} onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label htmlFor="t-photo" className="block text-sm font-medium mb-1">Photo URL</label>
            <input id="t-photo" type="url" value={form.photoUrl} onChange={(e) => setForm(p => ({ ...p, photoUrl: e.target.value }))} className={inputClass} />
          </div>
          <div className="flex items-center gap-2">
            <input id="t-pub" type="checkbox" checked={form.published} onChange={(e) => setForm(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4" />
            <label htmlFor="t-pub" className="text-sm">Published</label>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={saving}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete">
        <p className="text-navy-700 mb-6">Are you sure you want to delete this testimonial?</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
