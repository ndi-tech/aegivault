import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Navigation (Logo) */}
      <div className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-start z-10 absolute top-0 left-0 right-0">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">AEGIVAULT</span>
        </Link>
      </div>

      {/* Centered Form Area */}
      <main className="flex-1 flex items-center justify-center z-10 px-6">
        {children}
      </main>
    </div>
  );
}
