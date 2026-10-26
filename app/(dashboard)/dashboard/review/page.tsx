"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, CheckCircle2, ShieldAlert, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function ReviewContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editedAnalysis, setEditedAnalysis] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchDoc = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setDoc(data);
        setEditedAnalysis(data.ai_analysis || "");
      }
      setLoading(false);
    };
    fetchDoc();
  }, [id]);

  const handleAction = async (newStatus: string) => {
    if (!id) return;
    setActionLoading(true);
    const supabase = createClient();
    
    await supabase
      .from("documents")
      .update({ status: newStatus, ai_analysis: editedAnalysis })
      .eq("id", id);

    router.push("/dashboard/documents");
    router.refresh();
  };

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!doc) return <div className="p-8 text-center text-muted-foreground">Document not found.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/documents" className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight line-clamp-1">{doc.title}</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Review AI extraction and authorize.</p>
          </div>
        </div>
      </div>

      {/* Changed to flex-col on mobile, grid on desktop */}
      <div className="flex-1 flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6 min-h-0 overflow-y-auto md:overflow-hidden pb-4 md:pb-0">
        
        {/* Left Side: Source Document */}
        <div className="flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm min-h-[250px] md:min-h-0">
          <div className="px-4 py-3 border-b border-border bg-secondary/30">
            <h2 className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wider">Original Source</h2>
          </div>
          <div className="flex-1 p-4 md:p-6 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {doc.content}
          </div>
        </div>

        {/* Right Side: AI Draft */}
        <div className="flex flex-col bg-card border border-primary/30 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.1)] relative min-h-[300px] md:min-h-0">
          <div className="px-4 py-3 border-b border-primary/20 bg-primary/5 flex items-center justify-between">
            <h2 className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> AI Extraction
            </h2>
            <span className="text-[10px] md:text-xs font-medium text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full">Editable</span>
          </div>
          <textarea
            value={editedAnalysis}
            onChange={(e) => setEditedAnalysis(e.target.value)}
            className="flex-1 p-4 md:p-6 bg-transparent resize-none focus:outline-none text-sm leading-relaxed text-foreground/90"
            placeholder="AI analysis failed to generate."
          />
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-4 md:mt-6 p-4 rounded-xl border border-border bg-card flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
        <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left hidden md:block">
          Review the AI output. You must explicitly approve to commit this to the vault.
        </p>
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <button onClick={() => handleAction('flagged')} disabled={actionLoading} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium border border-destructive/30 text-destructive rounded-md hover:bg-destructive/10 transition-colors">
            <XCircle className="w-4 h-4" /> Discard
          </button>
          <button onClick={() => handleAction('approved')} disabled={actionLoading} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2 text-xs md:text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all disabled:opacity-50">
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ReviewContent />
    </Suspense>
  );
}
