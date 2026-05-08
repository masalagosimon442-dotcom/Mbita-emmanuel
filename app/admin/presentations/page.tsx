"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface Presentation {
  id: string; title: string; event: string; date: string;
  slideUrl?: string | null; videoUrl?: string | null; description?: string | null; published: boolean;
}

const empty = { title: "", event: "", date: "", slideUrl: "", videoUrl: "", description: "", published: true };

export default function PresentationsPage() {
  const [items, setItems] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Presentation | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/presentations");
    if (res.ok) setItems(await res.json());
    else showToast("error", "Failed to load presentations.");
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (item: Presentation) => {
    setEditing(item);
    setForm({ title: item.title, event: item.event, date: item.date.split("T")[0], slideUrl: item.slideUrl ?? "", videoUrl: item.videoUrl ?? "", description: item.description ?? "", published: item.published });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const body = editing ? { id: editing.id, ...form } : form;
    const res = await fetch("/api/admin/presentations", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) {
      showToast("success", editing ? "Presentation updated." : "Presentation added.");
      setModalOpen(false);
      fetchItems();
    } else {
      const data = await res.json().catch(() => ({}));
      showToast("error", data.error ?? "Failed to save presentation.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/presentations?id=${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    if (res.ok) {
      showToast("success", "Presentation deleted.");
      fetchItems();
    } else {
      showToast("error", "Failed to delete presentation.");
    }
  };

  const inputClass = "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Research Presentations</h1>
        <Button variant="primary" onClick={openCreate}>+ Add Presentation</Button>
      </div>

      {toast && (
        <div role="alert" className={`mb-4 p-3 rounded-lg text-sm font-medium ${toast.type === "success" ? "bg-green-50 border border-green-300 text-green-800" : "bg-red-50 border border-red-300 text-red-700"}`}>
          {toast.message}
        </div>
      )}

      {loading ? <p className="text-navy-500">Loading...</p> : items.length === 0 ? (
        <p className="text-center text-navy-500 py-12">No presentations yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-border rounded-xl p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-navy-900">{item.title}</h3>
                <p className="text-navy-600 text-sm">{item.event} · {new Date(item.date).toLocaleDateString()}</p>
                <div className="flex gap-3 mt-1">
                  {item.slideUrl && <a href={item.slideUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Slides →</a>}
                  {item.videoUrl && <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-navy-500 hover:underline">Video →</a>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => openEdit(item)}>Edit</Button>
                <Button variant="danger" onClick={() => setDeleteId(item.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Presentation" : "Add Presentation"} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event/Conference *</label>
              <input required value={form.event} onChange={e => setForm(p => ({ ...p, event: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
              <input required type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slides URL</label>
              <input type="url" value={form.slideUrl} onChange={e => setForm(p => ({ ...p, slideUrl: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Video URL</label>
              <input type="url" value={form.videoUrl} onChange={e => setForm(p => ({ ...p, videoUrl: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={`${inputClass} resize-none`} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="pres-pub" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4" />
            <label htmlFor="pres-pub" className="text-sm">Show on public site</label>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={saving}>Save</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete">
        <p className="text-navy-700 mb-6">Delete this presentation?</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
