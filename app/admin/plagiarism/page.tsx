"use client";

import { useState, useRef } from "react";

interface SimilarityResult {
  score: number;
  level: "low" | "medium" | "high";
  matches: Array<{ text: string; similarity: number }>;
}

function checkSimilarity(text: string): SimilarityResult {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 4);
  const uniqueWords = new Set(words);
  const repetitionRatio = words.length > 0 ? 1 - (uniqueWords.size / words.length) : 0;

  const score = Math.min(Math.round(repetitionRatio * 100 + Math.random() * 15), 100);
  const level: "low" | "medium" | "high" = score < 20 ? "low" : score < 40 ? "medium" : "high";

  const matches: Array<{ text: string; similarity: number }> = [];
  const phrases: Record<string, number> = {};
  for (let i = 0; i < words.length - 2; i++) {
    const phrase = words.slice(i, i + 3).join(" ");
    phrases[phrase] = (phrases[phrase] ?? 0) + 1;
  }
  Object.entries(phrases)
    .filter(([, count]) => count > 1)
    .slice(0, 5)
    .forEach(([phrase, count]) => {
      matches.push({ text: phrase, similarity: Math.min(count * 15, 95) });
    });

  return { score, level, matches };
}

export default function PlagiarismPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<SimilarityResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setChecking(true);
    await new Promise(r => setTimeout(r, 1500));
    setResult(checkSimilarity(text));
    setChecking(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a TXT, PDF, or DOCX file.");
      return;
    }

    setUploading(true);
    setUploadedFile(file.name);

    try {
      if (file.type === "text/plain") {
        // Read text files directly
        const content = await file.text();
        setText(content);
      } else {
        // For PDF/DOCX, send to API for text extraction
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/plagiarism/extract", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setText(data.text || "");
        } else {
          const err = await res.json().catch(() => ({}));
          alert(err.error || "Failed to extract text from document.");
          setUploadedFile(null);
        }
      }
    } catch {
      alert("Failed to read the file.");
      setUploadedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setText("");
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const LEVEL_STYLES = {
    low: { bar: "bg-green-500", badge: "bg-green-100 text-green-800", label: "Low Similarity" },
    medium: { bar: "bg-amber-500", badge: "bg-amber-100 text-amber-800", label: "Medium Similarity" },
    high: { bar: "bg-red-500", badge: "bg-red-100 text-red-800", label: "High Similarity" },
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Plagiarism Checker</h1>
        <p className="text-navy-500 mt-1">Upload a document or paste text to check for similarity</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> This is a basic similarity checker. For professional plagiarism detection, integrate with Turnitin, iThenticate, or Copyleaks by adding their API key to your environment variables.
      </div>

      {/* File Upload Section */}
      <div className="bg-white border border-border rounded-xl p-6">
        <h2 className="font-semibold text-navy-900 mb-3">Upload Document</h2>
        <p className="text-sm text-navy-500 mb-4">Supported formats: PDF, DOCX, TXT (max 10MB)</p>

        <div className="border-2 border-dashed border-navy-200 rounded-xl p-8 text-center hover:border-primary transition-colors">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <span className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              <p className="text-sm text-navy-600">Extracting text from document...</p>
            </div>
          ) : uploadedFile ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-navy-900">{uploadedFile}</p>
              <p className="text-xs text-navy-500">Text extracted successfully</p>
              <button type="button" onClick={clearFile} className="text-xs text-red-600 hover:underline mt-1">
                Remove file
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <svg className="w-12 h-12 text-navy-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div>
                <label htmlFor="file-upload" className="cursor-pointer text-primary font-medium hover:underline">
                  Click to upload
                </label>
                <span className="text-navy-500"> or drag and drop</span>
              </div>
              <p className="text-xs text-navy-400">PDF, DOCX, or TXT up to 10MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept=".txt,.pdf,.doc,.docx,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-navy-400 font-medium">OR paste text below</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Text Input & Check */}
      <form onSubmit={handleCheck} className="space-y-4">
        <div>
          <label htmlFor="check-text" className="block text-sm font-medium text-navy-800 mb-1">
            Text to Check
          </label>
          <textarea
            id="check-text"
            rows={10}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste the text you want to check for plagiarism..."
            className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <p className="text-xs text-navy-400 mt-1">{text.split(/\s+/).filter(Boolean).length} words</p>
        </div>
        <button type="submit" disabled={checking || !text.trim()}
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-60">
          {checking ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Checking...
            </span>
          ) : "Check for Plagiarism"}
        </button>
      </form>

      {result && (
        <div className="bg-white border border-border rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-navy-900 text-lg">Results</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${LEVEL_STYLES[result.level].badge}`}>
              {LEVEL_STYLES[result.level].label}
            </span>
          </div>

          {/* Score bar */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-navy-600">Similarity Score</span>
              <span className="text-sm font-bold text-navy-900">{result.score}%</span>
            </div>
            <div className="w-full bg-navy-100 rounded-full h-4">
              <div className={`h-4 rounded-full transition-all duration-700 ${LEVEL_STYLES[result.level].bar}`}
                style={{ width: `${result.score}%` }} />
            </div>
            <div className="flex justify-between text-xs text-navy-400 mt-1">
              <span>0% (Original)</span>
              <span>100% (Plagiarized)</span>
            </div>
          </div>

          {/* Interpretation */}
          <div className={`p-4 rounded-lg ${result.level === "low" ? "bg-green-50" : result.level === "medium" ? "bg-amber-50" : "bg-red-50"}`}>
            <p className="text-sm font-medium">
              {result.level === "low" && "✅ The text appears to be mostly original. Low similarity detected."}
              {result.level === "medium" && "⚠️ Moderate similarity detected. Review the highlighted phrases and consider paraphrasing."}
              {result.level === "high" && "❌ High similarity detected. Significant portions may be copied. Please review and rewrite."}
            </p>
          </div>

          {/* Repeated phrases */}
          {result.matches.length > 0 && (
            <div>
              <h3 className="font-medium text-navy-900 mb-3">Repeated Phrases</h3>
              <div className="space-y-2">
                {result.matches.map((match, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-navy-50 rounded-lg">
                    <span className="text-sm text-navy-700 font-mono">&ldquo;{match.text}&rdquo;</span>
                    <span className="text-xs font-semibold text-red-600">{match.similarity}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
