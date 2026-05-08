"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Image from "next/image";

interface TeamMember {
  id: string; name: string; role: string; email?: string | null;
  photoUrl?: string | null; bio?: string | null; researchArea?: string | null;
  joinedYear?: number | null; published: boolean;
}

const empty = { name: "", role: "", email: "", photoUrl: "", bio: "", researchArea: "", joinedYear: new Date().getFullYear(), published: true };

export default function TeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
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
    const res = await fetch("/api/admin/team");
    if (res.ok) setItems(await res.json());
    else showToast("error", "Failed to load team members.");
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (item: TeamMember) => {
    setEditing(item);
    setForm({ name: item.name, role: item.role, email: item.email ?? "", photoUrl: item.photoUrl ?? "", bio: item.bio ?? "", researchArea: item.researchArea ?? "", joinedYear: item.joinedYear ?? new Date().getFullYear(), published: item.published });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const body = editing ? { id: editing.id, ...form } : form;
    const res = await fetch("/api/admin/team", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) {
      showToast("success", editing ? "Team member updated." : "Team member added.");
      setModalOpen(false);
      fetchItems();
    } else {
      const data = await res.json().catch(() => ({}));
      showToast("error", data.error ?? "Failed to save team member.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/team?id=${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    if (res.ok) {
      showToast("success", "Team member removed.");
      fetchItems();
    } else {
      showToast("error", "Failed to remove team member.");
    }
  };

  const inputClass = "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Research Team</h1>
        <Button variant="primary" onClick={openCreate}>+ Add Member</Button>
      </div>

      {toast && (
        <div role="alert" className={`mb-4 p-3 rounded-lg text-sm font-medium ${toast.type === "success" ? "bg-green-50 border border-green-300 text-green-800" : "bg-red-50 border border-red-300 text-red-700"}`}>
          {toast.message}
        </div>
      )}

      {loading ? <p className="text-navy-500">Loading...</p> : items.length === 0 ? (
        <p className="text-center text-navy-500 py-12">No team members yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-border rounded-xl p-5 text-center">
              {item.photoUrl ? (
                <Image src={item.photoUrl} alt={item.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-border" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold text-xl">{item.name.charAt(0)}</span>
                </div>
              )}
              <p className="font-semibold text-navy-900">{item.name}</p>
              <p className="text-primary text-sm">{item.role}</p>
              {item.researchArea && <p className="text-navy-500 text-xs mt-0.5">{item.researchArea}</p>}
              <div className="flex justify-center gap-2 mt-3">
                <Button variant="ghost" onClick={() => openEdit(item)}>Edit</Button>
                <Button variant="danger" onClick={() => setDeleteId(item.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Team Member" : "Add Team Member"} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role *</label>
              <input required value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="PhD Student, Postdoc..." className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Joined Year</label>
              <input type="number" value={form.joinedYear} onChange={e => setForm(p => ({ ...p, joinedYear: parseInt(e.target.value) }))} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Photo URL</label>
            <input type="url" value={form.photoUrl} onChange={e => setForm(p => ({ ...p, photoUrl: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Research Area</label>
            <input value={form.researchArea} onChange={e => setForm(p => ({ ...p, researchArea: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea rows={3} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} className={`${inputClass} resize-none`} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="team-pub" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4" />
            <label htmlFor="team-pub" className="text-sm">Show on public site</label>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={saving}>Save</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete">
        <p className="text-navy-700 mb-6">Remove this team member?</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Remove</Button>
        </div>
      </Modal>
    </div>
  );
}
