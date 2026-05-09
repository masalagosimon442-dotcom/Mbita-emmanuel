"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface Announcement {
  id: string;
  title: string;
  content: string;
  link?: string | null;
  published: boolean;
  createdAt: string;
}

interface FormData {
  title: string;
  content: string;
  link: string;
  published: boolean;
}

const empty: FormData = { title: "", content: "", link: "", published: true };

export default function AnnouncementsAdminPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<FormData>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/announcements");
    if (res.ok) setItems(await res.json());
    else showToast("error", "Failed to load announcements.");
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (item: Announcement) => {
    setEditing(item);
    setForm({ title: item.title, content: item.content, link: item.link ?? "", published: item.published });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const body = editing ? { id: editing.id, ...form } : form;
    try {
      const res = await fetch("/api/admin/announcements", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        showToast("success", editing ? "Announcement updated." : "Announcement added.");
        setModalOpen(false);
        fetchItems();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast("error", data.error ?? "Failed to save announcement.");
      }
    } catch {
      showToast("error", "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/announcements?id=${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      if (res.ok) {
        showToast("success", "Announcement deleted.");
        fetchItems();
      } else {
        showToast("error", "Failed to delete announcement.");
      }
    } catch {
      showToast("error", "An unexpected error occurred.");
    }
  };

  const inputClass = "w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Announcements</h1>
        <Button variant="primary" onClick={openCreate}>+ Add Announcement</Button>
      </div>

      {toast && (
        <div role="alert" className={`mb-4 p-3 rounded-lg text-sm font-medium ${toast.type === "success" ? "bg-green-50 border border-green-300 text-green-800" : "bg-red-50 border border-red-300 text-red-700"}`}>
          {toast.message}
        </div>
      )}

      {loading ? (
        <p className="text-navy-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-navy-500 text-center py-12">No announcements yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 p-4 bg-white border border-border rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy-900">{item.title}</p>
                <p className="text-sm text-navy-600 mt-1 line-clamp-2">{item.content}</p>
                {item.link && <a href={item.link} className="text-xs text-primary hover:underline" target="_blank" rel="noopener noreferrer">{item.link}</a>}
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Announcement" : "Add Announcement"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="ann-title" className="block text-sm font-medium mb-1">Title *</label>
            <input id="ann-title" required value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label htmlFor="ann-content" className="block text-sm font-medium mb-1">Content *</label>
            <textarea id="ann-content" required rows={3} value={form.content} onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label htmlFor="ann-link" className="block text-sm font-medium mb-1">Link (optional)</label>
            <input id="ann-link" type="url" value={form.link} onChange={(e) => setForm(p => ({ ...p, link: e.target.value }))} className={inputClass} />
          </div>
          <div className="flex items-center gap-2">
            <input id="ann-pub" type="checkbox" checked={form.published} onChange={(e) => setForm(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4" />
            <label htmlFor="ann-pub" className="text-sm">Published</label>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={saving}>Save</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete">
        <p className="text-navy-700 mb-6">Are you sure you want to delete this announcement?</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
