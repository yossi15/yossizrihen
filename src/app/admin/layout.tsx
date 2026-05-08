import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#0f1620] text-[var(--cream-soft)]">
      {children}
    </div>
  );
}
