import { PageShell } from "@cvmake/ui";
import { requireAdminProfile, getUserOverview } from "@/lib/auth";

export default async function AdminUsersPage() {
  await requireAdminProfile();
  const users: Awaited<ReturnType<typeof getUserOverview>> = await getUserOverview();

  return (
    <PageShell
      title="User overview"
      description="Clerk identity merged with your app database role and CV count."
    >
      <div className="panel-strong overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4 font-medium">User</th>
              <th className="px-5 py-4 font-medium">Role</th>
              <th className="px-5 py-4 font-medium">CVs</th>
              <th className="px-5 py-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-black/10">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-950">{user.name || user.clerkUserId}</p>
                  <p className="text-slate-500">{user.email || "Email unavailable"}</p>
                </td>
                <td className="px-5 py-4">{user.role}</td>
                <td className="px-5 py-4">{user.cvCount}</td>
                <td className="px-5 py-4">{user.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
