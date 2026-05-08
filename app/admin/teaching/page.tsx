"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import CourseForm from "@/components/forms/admin/CourseForm";

interface Course {
  id: string;
  name: string;
  code: string;
  term: string;
  status: "active" | "archived";
  syllabusUrl: string | null;
  externalUrl: string | null;
  description: string | null;
  published: boolean;
}

export const dynamic = "force-dynamic";

export default function AdminTeachingPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function loadCourses() {
    try {
      const res = await fetch("/api/admin/teaching");
      const data = await res.json();
      setCourses(data);
    } catch {
      showToast("error", "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCourses(); }, []);

  async function handleSubmit(formData: {
    name: string; code: string; term: string; status: "active" | "archived";
    syllabusUrl: string; externalUrl: string; description: string; published: boolean;
  }) {
    setSaving(true);
    const payload = {
      ...formData,
      id: editingCourse?.id,
      syllabusUrl: formData.syllabusUrl || undefined,
      externalUrl: formData.externalUrl || undefined,
    };

    try {
      const res = await fetch("/api/admin/teaching", {
        method: editingCourse ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        showToast("success", editingCourse ? "Course updated." : "Course created.");
        setModalOpen(false);
        loadCourses();
      } else {
        showToast("error", data.error ?? "Failed to save course.");
      }
    } catch {
      showToast("error", "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(course: Course) {
    if (!window.confirm(`Delete "${course.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/teaching?id=${course.id}`, { method: "DELETE" });
      if (res.ok) { showToast("success", "Course deleted."); loadCourses(); }
      else showToast("error", "Failed to delete course.");
    } catch { showToast("error", "An unexpected error occurred."); }
  }

  async function handleTogglePublish(course: Course) {
    // Confirm before unpublishing
    if (course.published && !window.confirm(`Unpublish "${course.name}"? It will be hidden from the public site.`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/teaching", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: course.id, published: !course.published }),
      });
      if (res.ok) { showToast("success", course.published ? "Course unpublished." : "Course published."); loadCourses(); }
      else showToast("error", "Failed to update publish status.");
    } catch { showToast("error", "An unexpected error occurred."); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Teaching & Courses</h2>
          <p className="text-gray-600 mt-1">Manage your courses</p>
        </div>
        <Button variant="primary" onClick={() => { setEditingCourse(null); setModalOpen(true); }}>+ New Course</Button>
      </div>

      {toast && (
        <div role="alert" className={["mb-4 p-3 rounded-md text-sm font-medium", toast.type === "success" ? "bg-green-50 border border-green-300 text-green-800" : "bg-red-50 border border-red-300 text-red-700"].join(" ")}>
          {toast.message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading…</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 bg-white border border-border rounded-lg text-gray-500">No courses yet.</div>
      ) : (
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-navy-800">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-navy-800 hidden sm:table-cell">Code</th>
                <th className="text-left px-4 py-3 font-semibold text-navy-800 hidden md:table-cell">Term</th>
                <th className="text-left px-4 py-3 font-semibold text-navy-800 hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-navy-800">Published</th>
                <th className="text-right px-4 py-3 font-semibold text-navy-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-navy-50">
                  <td className="px-4 py-3 font-medium text-navy-900">{course.name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{course.code}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{course.term}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={["px-2 py-0.5 rounded-full text-xs font-medium", course.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"].join(" ")}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleTogglePublish(course)} className={["px-2 py-0.5 rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary", course.published ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"].join(" ")}>
                      {course.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingCourse(course); setModalOpen(true); }}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(course)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCourse ? "Edit Course" : "New Course"} size="lg">
        <CourseForm initialData={editingCourse ?? undefined} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} isLoading={saving} />
      </Modal>
    </div>
  );
}
