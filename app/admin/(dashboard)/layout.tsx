import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/dashboard/admin-shell";

export default async function AdminDashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return <AdminShell user={user}>{children}</AdminShell>;
}
