"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ResearchForm from "@/components/forms/admin/ResearchForm";

interface ResearchProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: "active" | "completed";
  startYear: number;
  endYear: number | null;
  fundingSources: string[];
  collaborators: string[];
  externalUrl: string | null;
  published: boolean;
  createdAt: string;
}

export const dynamic = "force-dynamic";

export default function AdminResearchPage() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ResearchProject | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function loadProjects() {
    try {
      const res = await fetch("/api/admin/research");
      const data = await res.json();
      setProjects(data);
    } catch {
      showToast("error", "Failed to load research projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProjects(); }, []);

  function openCreate() {
    setEditingProject(null);
    setModalOpen(true);
  }

  function openEdit(project: ResearchProject) {
    setEditingProject(project);
    setModalOpen(true);
  }

  async function handleSubmit(formData: {
    slug: string; title: string; description: string; status: "active" | "completed";
    startYear: number; endYear: number | null; fundingSources: string; collaborators: string;
    externalUrl: string; published: boolean;
  }) {
    setSaving(true);
    const payload = {
      ...formData,
      id: editingProject?.id,
      fundingSources: formData.fundingSources.split(",").map((s) => s.trim()).filter(Boolean),
      collaborators: formData.collaborators.split(",").map((s) => s.trim()).filter(Boolean),
      externalUrl: formData.externalUrl || undefined,
    };

    try {
      const res = await fetch("/api/admin/research", {
        method: editingProject ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        showToast("success", editingProject ? "Project updated." : "Project created.");
        setModalOpen(false);
        loadProjects();
      } else {
        showToast("error", data.error ?? "Failed to save project.");
      }
    } catch {
      showToast("error", "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(project: ResearchProject) {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/research?id=${project.id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("success", "Project deleted.");
        loadProjects();
      } else {
        showToast("error", "Failed to delete project.");
      }
    } catch {
      showToast("error", "An unexpected error occurred.");
    }
  }

  async function handleTogglePublish(project: ResearchProject) {
    // Confirm before unpublishing
    if (project.published && !window.confirm(`Unpublish "${project.title}"? It will be hidden from the public site.`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/research", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: project.id, published: !project.published }),
      });
      if (res.ok) {
        showToast("success", project.published ? "Project unpublished." : "Project published.");
        loadProjects();
      } else {
        showToast("error", "Failed to update publish status.");
      }
    } catch {
      showToast("error", "An unexpected error occurred.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Research Projects</h2>
          <p className="text-gray-600 mt-1">Manage your research projects</p>
        </div>
        <Button variant="primary" onClick={openCreate}>+ New Project</Button>
      </div>

      {toast && (
        <div role="alert" className={[
          "mb-4 p-3 rounded-md text-sm font-medium",
          toast.type === "success" ? "bg-green-50 border border-green-300 text-green-800" : "bg-red-50 border border-red-300 text-red-700",
        ].join(" ")}>
          {toast.message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading…</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-white border border-border rounded-lg text-gray-500">
          No research projects yet. <button onClick={openCreate} className="text-primary underline">Create one</button>.
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-navy-800">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-navy-800 hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-navy-800 hidden md:table-cell">Years</th>
                <th className="text-left px-4 py-3 font-semibold text-navy-800">Published</th>
                <th className="text-right px-4 py-3 font-semibold text-navy-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-navy-50">
                  <td className="px-4 py-3 font-medium text-navy-900">{project.title}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={[
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      project.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600",
                    ].join(" ")}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                    {project.startYear}{project.endYear ? `–${project.endYear}` : "–present"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTogglePublish(project)}
                      className={[
                        "px-2 py-0.5 rounded-full text-xs font-medium transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        project.published ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200",
                      ].join(" ")}
                      aria-label={project.published ? "Unpublish project" : "Publish project"}
                    >
                      {project.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(project)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(project)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? "Edit Research Project" : "New Research Project"}
        size="lg"
      >
        <ResearchForm
          initialData={editingProject ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          isLoading={saving}
        />
      </Modal>
    </div>
  );
}
