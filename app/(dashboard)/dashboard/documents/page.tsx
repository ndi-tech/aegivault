"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Document } from "@/lib/types";
import Link from "next/link";
import { FileText, Clock, CheckCircle2, ShieldAlert, ArrowRight, Loader2 } from "lucide-react";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (data) setDocuments(data);
      }
      setLoading(false);
    };

    fetchDocs();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Document Library</h1>
        <p className="text-muted-foreground">Manage and review your processed documents.</p>
      </div>

      {documents.length === 0 ? (
        <div className="p-12 text-center border border-border border-dashed rounded-xl bg-card/50">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Upload a document to start the AI analysis pipeline.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-md font-semibold hover:bg-foreground/90 transition-all">
            Go to Upload <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="p-5 rounded-xl border border-border bg-card flex items-center justify-between hover:border-primary/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{doc.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(doc.created_at).toLocaleDateString()} at {new Date(doc.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {doc.status === 'pending' && <span className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-full"><Clock className="w-3.5 h-3.5" /> Pending Review</span>}
                  {doc.status === 'approved' && <span className="flex items-center gap-1.5 text-primary bg-primary/10 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>}
                  {doc.status === 'flagged' && <span className="flex items-center gap-1.5 text-destructive bg-destructive/10 px-2.5 py-1 rounded-full"><ShieldAlert className="w-3.5 h-3.5" /> Flagged</span>}
                </div>

                {doc.status === 'pending' ? (
                  <Link 
                    href={`/dashboard/review?id=${doc.id}`}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary/90 transition-all opacity-90 group-hover:opacity-100"
                  >
                    Review Now <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link 
                    href={`/dashboard/review?id=${doc.id}`}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View Record
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
