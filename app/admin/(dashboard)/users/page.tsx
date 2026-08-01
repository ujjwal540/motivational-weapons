import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserActions } from "./user-actions-row";

export const metadata: Metadata = {
  title: "Users",
  robots: { index: false, follow: false },
};

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  role: string;
  blocked: boolean;
  createdAt: Date;
}

export default async function AdminUsersPage() {
  const currentUser = await requireAdmin();

  const users: UserRow[] = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide">
          USERS <span className="text-primary">({users.length})</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everyone who has signed in — promote to admin or block an account.
        </p>
      </div>

      {users.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No users yet.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-sm font-medium">
                  {user.name ?? "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "ADMIN" ? "ember" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.blocked ? (
                    <Badge variant="destructive">Blocked</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Active
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <UserActions
                    id={user.id}
                    role={user.role}
                    blocked={user.blocked}
                    isSelf={user.id === currentUser.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
