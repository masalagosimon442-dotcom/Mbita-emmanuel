"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import BlogPostForm from "@/components/forms/admin/BlogPostForm";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  content: string;
  tags: string[];
  draft: boolean;
}

export const dynamic = "force-dynamic";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [draftFilter, setDraftFilter] = useState<"all" | "published" | "draft">("all");

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function loadPosts() {
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      setPosts(data);
    } catch {
      showToast("error", "Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPosts(); }, []);

  async function handleSubmit(formData: {
    title: string; slug: string; publishedAt: string; excerpt: string;
    content: string; tags: string; draft: boolean;
  }) {
    setSaving(true);
    const payload = {
      ...formData,
      id: editingPost?.id,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/blog", {
        method: editingPost ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        showToast("success", editingPost ? "Post updated." : "Post created.");
        setModalOpen(false);
        loadPosts();
      } else {
        showToast("error", data.error ?? "Failed to save post.");
      }
    } catch {
      showToast("error", "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(post: BlogPost) {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/blog?id=${post.id}`, { method: "DELETE" });
      if (res.ok) { showToast("success", "Post deleted."); loadPosts(); }
      else showToast("error", "Failed to delete post.");
    } catch { showToast("error", "An unexpected error occurred."); }
  }

  async function handleToggleDraft(post: BlogPost) {
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, draft: !post.draft }),
      });
      if (res.ok) { showToast("success", post.draft ? "Post published." : "Post moved to draft."); loadPosts(); }
      else showToast("error", "Failed to update post status.");
    } catch { showToast("error", "An unexpected error occurred."); }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  const filteredPosts = posts.filter((post) => {
    if (draftFilter === "published") return !post.draft;
    if (draftFilter === "draft") return post.draft;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Blog Posts</h2>
          <p className="text-gray-600 mt-1">Manage your blog posts and news</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={draftFilter}
            onChange={(e) => setDraftFilter(e.target.value as "all" | "published" | "draft")}
            className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <Button variant="primary" onClick={() => { setEditingPost(null); setModalOpen(true); }}>+ New Post</Button>
        </div>
      </div>

      {toast && (
        <div role="alert" className={["mb-4 p-3 rounded-md text-sm font-medium", toast.type === "success" ? "bg-green-50 border border-green-300 text-green-800" : "bg-red-50 border border-red-300 text-red-700"].join(" ")}>
          {toast.message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading…</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-white border border-border rounded-lg text-gray-500">No blog posts yet.</div>
      ) : (
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-navy-800">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-navy-800 hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-navy-800">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-navy-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-navy-50">
                  <td className="px-4 py-3 font-medium text-navy-900 max-w-xs truncate">{post.title}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{formatDate(post.publishedAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleDraft(post)}
                      className={["px-2 py-0.5 rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary", !post.draft ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200"].join(" ")}
                    >
                      {post.draft ? "Draft" : "Published"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingPost(post); setModalOpen(true); }}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(post)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingPost ? "Edit Blog Post" : "New Blog Post"} size="xl">
        <BlogPostForm initialData={editingPost ?? undefined} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} isLoading={saving} />
      </Modal>
    </div>
  );
}
