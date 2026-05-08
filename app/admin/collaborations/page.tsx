"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import CollaboratorForm from "@/components/forms/admin/CollaboratorForm";
import ResourceForm from "@/components/forms/admin/ResourceForm";

interface Collaborator {
  id: string;
  name: string;
  institution: string;
  area: string;
  profileUrl: string | null;
  type: "individual" | "institution";
  published: boolean;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string | null;
  published: boolean;
}

export const dynamic = "force-dynamic";

type ActiveTab = "collaborators" | "resources";

export default function AdminCollaborationsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("collaborators");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function loadData() {
    setLoading(true);
    try {
      const [collabRes, resourceRes] = await Promise.all([
        fetch("/api/admin/collaborations"),
        fetch("/api/admin/collaborations?type=resources"),
      ]);
      setCollaborators(await collabRes.json());
      setResources(await resourceRes.json());
    } catch {
      showToast("error", "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  // Collaborator handlers
  async function handleCollaboratorSubmit(formData: {
    name: string; institution: string; area: string; profileUrl: string; type: "individual" | "institution"; published: boolean;
  }) {
    setSaving(true);
    const payload = { ...formData, id: editingCollaborator?.id, profileUrl: formData.profileUrl || undefined };
    try {
      const res = await fetch("/api/admin/collaborations", {
        method: editingCollaborator ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) { showToast("success", editingCollaborator ? "Collaborator updated." : "Collaborator added."); setModalOpen(false); loadData(); }
      else showToast("error", data.error ?? "Failed to save collaborator.");
    } catch { showToast("error", "An unexpected error occurred."); }
    finally { setSaving(false); }
  }

  async function handleCollaboratorDelete(c: Collaborator) {
    if (!window.confirm(`Delete "${c.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/collaborations?id=${c.id}`, { method: "DELETE" });
      if (res.ok) { showToast("success", "Collaborator deleted."); loadData(); }
      else showToast("error", "Failed to delete collaborator.");
    } catch { showToast("error", "An unexpected error occurred."); }
  }

  async function handleCollaboratorToggle(c: Collaborator) {
    // Confirm before unpublishing
    if (c.published && !window.confirm(`Unpublish "${c.name}"? They will be hidden from the public site.`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/collaborations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, published: !c.published }),
      });
      if (res.ok) { showToast("success", c.published ? "Unpublished." : "Published."); loadData(); }
      else showToast("error", "Failed to update.");
    } catch { showToast("error", "An unexpected error occurred."); }
  }

  // Resource handlers
  async function handleResourceSubmit(formData: {
    title: string; description: string; url: string; category: string; published: boolean;
  }) {
    setSaving(true);
    const payload = { ...formData, id: editingResource?.id, category: formData.category || undefined };
    try {
      const res = await fetch(`/api/admin/collaborations?type=resource`, {
        method: editingResource ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) { showToast("success", editingResource ? "Resource updated." : "Resource added."); setModalOpen(false); loadData(); }
      else showToast("error", data.error ?? "Failed to save resource.");
    } catch { showToast("error", "An unexpected error occurred."); }
    finally { setSaving(false); }
  }

  async function handleResourceDelete(r: Resource) {
    if (!window.confirm(`Delete "${r.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/collaborations?id=${r.id}&type=resource`, { method: "DELETE" });
      if (res.ok) { showToast("success", "Resource deleted."); loadData(); }
      else showToast("error", "Failed to delete resource.");
    } catch { showToast("error", "An unexpected error occurred."); }
  }

  async function handleResourceToggle(r: Resource) {
    // Confirm before unpublishing
    if (r.published && !window.confirm(`Unpublish "${r.title}"? It will be hidden from the public site.`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/collaborations?type=resource", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: r.id, published: !r.published }),
      });
      if (res.ok) { showToast("success", r.published ? "Unpublished." : "Published."); loadData(); }
      else showToast("error", "Failed to update.");
    } catch { showToast("error", "An unexpected error occurred."); }
  }

  const publishBtnClass = (published: boolean) =>
    ["px-2 py-0.5 rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      published ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"].join(" ");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Collaborations & Resources</h2>
          <p className="text-gray-600 mt-1">Manage collaborators and shared resources</p>
        </div>
        <Button variant="primary" onClick={() => {
          if (activeTab === "collaborators") { setEditingCollaborator(null); }
          else { setEditingResource(null); }
          setModalOpen(true);
        }}>
          + {activeTab === "collaborators" ? "Add Collaborator" : "Add Resource"}
        </Button>
      </div>

      {toast && (
        <div role="alert" className={["mb-4 p-3 rounded-md text-sm font-medium", toast.type === "success" ? "bg-green-50 border border-green-300 text-green-800" : "bg-red-50 border border-red-300 text-red-700"].join(" ")}>
          {toast.message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        {(["collaborators", "resources"] as ActiveTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={["px-4 py-2 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              activeTab === tab ? "border-primary text-primary" : "border-transparent text-gray-600 hover:text-navy-900"].join(" ")}
          >
            {tab === "collaborators" ? `Collaborators (${collaborators.length})` : `Resources (${resources.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading…</div>
      ) : activeTab === "collaborators" ? (
        collaborators.length === 0 ? (
          <div className="text-center py-12 bg-white border border-border rounded-lg text-gray-500">No collaborators yet.</div>
        ) : (
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy-50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-navy-800">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-navy-800 hidden sm:table-cell">Institution</th>
                  <th className="text-left px-4 py-3 font-semibold text-navy-800 hidden md:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-navy-800">Published</th>
                  <th className="text-right px-4 py-3 font-semibold text-navy-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {collaborators.map((c) => (
                  <tr key={c.id} className="hover:bg-navy-50">
                    <td className="px-4 py-3 font-medium text-navy-900">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{c.institution}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-navy-100 text-navy-700">{c.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleCollaboratorToggle(c)} className={publishBtnClass(c.published)}>
                        {c.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingCollaborator(c); setModalOpen(true); }}>Edit</Button>
                        <Button variant="danger" size="sm" onClick={() => handleCollaboratorDelete(c)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        resources.length === 0 ? (
          <div className="text-center py-12 bg-white border border-border rounded-lg text-gray-500">No resources yet.</div>
        ) : (
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy-50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-navy-800">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-navy-800 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-navy-800">Published</th>
                  <th className="text-right px-4 py-3 font-semibold text-navy-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {resources.map((r) => (
                  <tr key={r.id} className="hover:bg-navy-50">
                    <td className="px-4 py-3 font-medium text-navy-900">{r.title}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{r.category ?? "—"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleResourceToggle(r)} className={publishBtnClass(r.published)}>
                        {r.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingResource(r); setModalOpen(true); }}>Edit</Button>
                        <Button variant="danger" size="sm" onClick={() => handleResourceDelete(r)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Collaborator modal */}
      {activeTab === "collaborators" && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCollaborator ? "Edit Collaborator" : "Add Collaborator"} size="lg">
          <CollaboratorForm initialData={editingCollaborator ?? undefined} onSubmit={handleCollaboratorSubmit} onCancel={() => setModalOpen(false)} isLoading={saving} />
        </Modal>
      )}

      {/* Resource modal */}
      {activeTab === "resources" && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingResource ? "Edit Resource" : "Add Resource"} size="lg">
          <ResourceForm initialData={editingResource ?? undefined} onSubmit={handleResourceSubmit} onCancel={() => setModalOpen(false)} isLoading={saving} />
        </Modal>
      )}
    </div>
  );
}
