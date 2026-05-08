import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { stats } from "@/lib/repo";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json(stats());
}
