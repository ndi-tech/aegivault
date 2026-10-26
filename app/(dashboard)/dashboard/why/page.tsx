import { ShieldAlert, ShieldCheck, Lock, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WhyAegivaultPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <ShieldAlert className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">The Multi-Million Dollar AI Problem</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Large Language Models are incredible, but in high-stakes industries (Law, Finance, Healthcare, Compliance), they have a fatal flaw: <strong>Hallucinations.</strong>
        </p>
      </div>

      {/* The Problem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border border-border rounded-xl bg-card">
          <ShieldAlert className="w-8 h-8 text-destructive mb-4" />
          <h3 className="text-xl font-bold mb-2">The Risk</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            If an AI misreads a contract clause or invents a financial figure, it can result in millions of dollars in legal damages, regulatory fines, or reputational ruin. Because of this, 90% of enterprises are terrified to deploy AI into their actual workflows.
          </p>
        </div>
        <div className="p-6 border border-primary/30 rounded-xl bg-primary/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <ShieldCheck className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">The Solution</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            AEGIVAULT implements a strict <strong>Human-in-the-Loop (HITL)</strong> architecture. We don't replace your experts; we supercharge them. The AI extracts the data, but it is frozen in a "Pending" state until a human expert verifies the source and clicks "Approve."
          </p>
        </div>
      </div>

      {/* The Industry Standard */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-border pb-2">How This Scales to Industry Level</h2>
        
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-secondary rounded-md mt-1"><Lock className="w-5 h-5 text-primary" /></div>
            <div>
              <h4 className="font-semibold text-foreground">1. Zero-Trust Data Security</h4>
              <p className="text-sm text-muted-foreground">Currently, AEGIVAULT uses Supabase Row-Level Security (RLS) so users only see their own documents. At an industry level, this would integrate with enterprise SSO (Okta, Azure AD) and private cloud deployments.</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-secondary rounded-md mt-1"><Eye className="w-5 h-5 text-primary" /></div>
            <div>
              <h4 className="font-semibold text-foreground">2. Immutable Audit Trails</h4>
              <p className="text-sm text-muted-foreground">Every action (AI extraction, human edit, final approval) is logged. In a full enterprise deployment, these logs would be immutable (blockchain or WORM storage) to satisfy legal compliance.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-2 bg-secondary rounded-md mt-1"><ShieldCheck className="w-5 h-5 text-primary" /></div>
            <div>
              <h4 className="font-semibold text-foreground">3. Model Redundancy (Dual-AI)</h4>
              <p className="text-sm text-muted-foreground">You are currently seeing our Dual-AI fallback in action (Groq & Gemini). If one provider goes down or hits a rate limit, the system instantly routes the request to the backup. This guarantees 99.9% uptime.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 rounded-xl border border-border border-dashed bg-card/50 text-center">
        <h3 className="text-lg font-semibold mb-2">Ready to experience controlled automation?</h3>
        <p className="text-sm text-muted-foreground mb-6">Upload your first document and act as the Human-in-the-Loop.</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-md font-semibold hover:bg-foreground/90 transition-all">
          Go to Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}