export default function WeddingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--cream)] text-[var(--ink)]">
      {children}
    </div>
  );
}
