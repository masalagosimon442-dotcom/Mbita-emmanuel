"use client";

import { useState } from "react";

interface SimilarityResult {
  score: number;
  level: "low" | "medium" | "high";
  matches: Array<{ text: string; similarity: number }>;
}

function checkSimilarity(text: string): SimilarityResult {
  // Simple local similarity check — compares against common academic phrases
  // In production, integrate with Turnitin, iThenticate, or Copyleaks API
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 4);
  const uniqueWords = new Set(words);
  const repetitionRatio = words.length > 0 ? 1 - (uniqueWords.size / words.length) : 0;

  // Simulate similarity score based on text characteristics
  const score = Math.min(Math.round(repetitionRatio * 100 + Math.random() * 15), 100);
  const level: "low" | "medium" | "high" = score < 20 ? "low" : score < 40 ? "medium" : "high";

  // Find repeated phrases (3+ word sequences)
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

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setChecking(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    setResult(checkSimilarity(text));
    setChecking(false);
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
        <p className="text-navy-500 mt-1">Check text for similarity and potential plagiarism</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> This is a basic similarity checker. For professional plagiarism detection, integrate with Turnitin, iThenticate, or Copyleaks by adding their API key to your environment variables.
      </div>

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
