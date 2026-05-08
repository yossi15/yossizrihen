"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("סיסמה שגויה");
      return;
    }
    window.location.href = "/admin";
  };

  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-[#1a2530] border border-white/10 rounded-md p-7 flex flex-col gap-4"
      >
        <h1 className="font-serif text-2xl">ניהול הזמנות</h1>
        <p className="text-sm text-white/60">הזן סיסמה כדי להמשיך</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#0f1620] border border-white/15 rounded px-4 py-3 outline-none focus:border-[var(--gold)]"
          placeholder="סיסמה"
          autoFocus
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--gold-deep)] hover:bg-[var(--gold)] text-white py-3 rounded transition-colors disabled:opacity-60"
        >
          {loading ? "שולח…" : "כניסה"}
        </button>
      </form>
    </main>
  );
}
