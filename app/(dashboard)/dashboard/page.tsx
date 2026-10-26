"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ShieldAlert, FileCheck2, Clock, Loader2, FileText } from "lucide-react";
import UploadModal from "@/components/documents/UploadModal";
import { createClient } from "@/lib/supabase/client";
import { Document } from "@/lib/types";
import Link from "next/link";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<Document[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setDocs(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const pendingCount = docs.filter(d => d.status === 'pending').length;
  const approvedCount = docs.filter(d => d.status === 'approved').length;
  const flaggedCount = docs.filter(d => d.status === 'flagged').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to AEGIVAULT</h1>
        <p className="text-muted-foreground">Here is the current status of your document verification pipeline.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Pending Review</h3>
            <Clock className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold">{loading ? "-" : pendingCount}</p>
          <p className="text-xs text-muted-foreground mt-2">Awaiting human authorization</p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Approved Documents</h3>
            <FileCheck2 className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-bold">{loading ? "-" : approvedCount}</p>
          <p className="text-xs text-muted-foreground mt-2">Securely committed to vault</p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Risk Flags</h3>
            <ShieldAlert className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-3xl font-bold">{loading ? "-" : flaggedCount}</p>
          <p className="text-xs text-muted-foreground mt-2">AI detected anomalies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Action Area */}
        <div className="lg:col-span-2 p-8 rounded-xl border border-border bg-card/50 flex flex-col items-center justify-center text-center border-dashed h-full min-h-[300px]">
          <h3 className="text-lg font-semibold mb-2">Ready to process a document?</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">Upload a contract, financial report, or compliance document to let the AI extract key data for your review.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-md font-semibold hover:bg-foreground/90 transition-all"
          >
            Upload Document <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">Recent Activity</h3>
          <div className="space-y-4">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mx-auto" />
            ) : docs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              docs.slice(0, 5).map((doc) => (
                <Link href={`/dashboard/review?id=${doc.id}`} key={doc.id} className="flex items-start gap-3 group">
                  <div className="mt-0.5 bg-secondary p-1.5 rounded-md">
                    <FileText className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">{doc.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{doc.status} • {new Date(doc.created_at).toLocaleDateString()}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
