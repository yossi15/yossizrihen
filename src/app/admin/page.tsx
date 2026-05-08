import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listGuests, stats } from "@/lib/repo";
import AdminDashboard from "./dashboard";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdmin())) redirect("/admin/login");
  const guests = listGuests();
  const s = stats();
  return <AdminDashboard initialGuests={guests} initialStats={s} />;
}
