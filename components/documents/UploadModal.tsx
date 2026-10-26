"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { X, Loader2, FileUp, FileText } from "lucide-react";

export default function UploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, "")); // Auto-fill title from filename

    if (file.type === "text/plain") {
      // Read TXT files instantly
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target?.result as string);
      };
      reader.readAsText(file);
    } else if (file.type === "application/pdf") {
      // Send PDF files to the backend to be parsed
      setIsParsing(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/parse-pdf", {
          method: "POST",
          body: formData,
        });
        
        const data = await response.json();
        
        if (data.text) {
          setContent(data.text);
        } else {
          setError("Could not read the PDF. Please try a different file.");
        }
      } catch (err) {
        setError("Failed to parse the PDF file.");
      }
      setIsParsing(false);
    } else {
      setError("Please upload a .txt or .pdf file.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      setError("Please provide document content.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setError("You must be logged in to upload.");
      setLoading(false);
      return;
    }

    const { data: newDoc, error: dbError } = await supabase
      .from("documents")
      .insert({ title, content, user_id: user.id, status: 'pending' })
      .select()
      .single();

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      const aiData = await response.json();

      if (aiData.result) {
        await supabase
          .from("documents")
          .update({ ai_analysis: aiData.result })
          .eq("id", newDoc.id);
      }
    } catch (err) {
      console.error("AI processing failed", err);
    }

    setTitle("");
    setContent("");
    setFileName(null);
    setLoading(false);
    onClose();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileUp className="w-5 h-5 text-primary" />
            Upload New Document
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Drag and Drop Zone */}
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-secondary/20 transition-colors relative">
            <input 
              type="file" 
              accept=".txt,.pdf" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isParsing}
            />
            {isParsing ? (
              <Loader2 className="w-8 h-8 text-primary mx-auto mb-3 animate-spin" />
            ) : (
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            )}
            <p className="text-sm font-medium mb-1">
              {isParsing ? "Extracting text from PDF..." : fileName ? fileName : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-muted-foreground">TXT or PDF (Max 10MB)</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or paste text manually</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Document Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
              placeholder="e.g., Q3 Financial Report, Vendor Contract"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Document Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all resize-none"
              placeholder="Paste the text of the document here..."
            />
          </div>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading || isParsing} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md font-semibold hover:bg-primary/90 transition-all disabled:opacity-50">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Analyzing..." : "Upload & Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}