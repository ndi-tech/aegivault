import Link from "next/link";
import { ShieldCheck, ArrowRight, Activity } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Abstract Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10 border-b border-border/50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">AEGIVAULT</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-all">
            Request Access
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 z-10 mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-8 border border-border">
          <Activity className="w-3 h-3 text-primary" />
          <span>Enterprise Document Intelligence</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6">
          AI Speed. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">
            Human Judgment.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12">
          AEGIVAULT is the secure Human-in-the-Loop engine for high-stakes workflows. 
          Extract data, draft summaries, and flag risks—but nothing enters your database without explicit human authorization.
        </p>

        <div className="flex items-center gap-4">
          <Link href="/register" className="flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-md font-semibold hover:bg-foreground/90 transition-all">
            Start Verification <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}