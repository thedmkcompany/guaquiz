"use client";

import { useEffect, useState } from "react";

type Role = "coach" | "program_manager" | "admin_assistant";

interface ManagedUser {
  id: string;
  username: string;
  role: Role;
  createdAt: string;
}

export default function AdminUsersManager() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "coach" as Role,
  });

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users");
      const data = (await res.json()) as { users?: ManagedUser[]; error?: string };
      if (!res.ok) {
        setError(data.error || "Failed to load users.");
        return;
      }
      setUsers(data.users || []);
    } catch {
      setError("Network error while loading users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function onAddUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { user?: ManagedUser; error?: string };
      if (!res.ok) {
        setError(data.error || "Failed to add user.");
        return;
      }
      if (data.user) {
        const user = data.user;
        setUsers((prev) => [user, ...prev]);
      }
      setForm({ username: "", password: "", role: "coach" });
    } catch {
      setError("Network error while adding user.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <section className="rounded-2xl border border-[#cdbf9a] bg-[#fff8ea] p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-[#7e0f1d] font-semibold">
          Add Portal User
        </p>
        <h2 className="mt-1 text-xl font-headline text-[#123b34]">
          Coaches / Program Managers
        </h2>
        <form className="mt-4 space-y-3" onSubmit={onAddUser}>
          <div>
            <label className="block text-sm font-medium text-[#123b34] mb-1">
              Username
            </label>
            <input
              value={form.username}
              onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
              className="w-full rounded-lg border border-[#cdbf9a] bg-white px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#123b34] mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-lg border border-[#cdbf9a] bg-white px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#123b34] mb-1">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as Role }))}
              className="w-full rounded-lg border border-[#cdbf9a] bg-white px-3 py-2"
            >
              <option value="coach">Coach</option>
              <option value="program_manager">Program Manager</option>
              <option value="admin_assistant">Admin Assistant</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-[#7e0f1d] text-[#f7f3e8] py-2.5 font-semibold hover:bg-[#6b0c18] transition-colors disabled:opacity-60"
          >
            {saving ? "Adding..." : "Add User"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-[#cdbf9a] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#7e0f1d] font-semibold">
              Existing Users
            </p>
            <h2 className="mt-1 text-xl font-headline text-[#123b34]">
              Portal Access List
            </h2>
          </div>
          <button
            type="button"
            onClick={() => void loadUsers()}
            className="rounded-lg border border-[#cdbf9a] px-3 py-2 text-sm text-[#123b34] hover:bg-[#f7f3e8]"
          >
            Refresh
          </button>
        </div>

        {error ? <p className="mt-3 text-sm text-[#9b2335]">{error}</p> : null}

        {loading ? (
          <p className="mt-4 text-sm text-[#0f3c36]/70">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="mt-4 text-sm text-[#0f3c36]/70">No extra users added yet.</p>
        ) : (
          <div className="mt-4 overflow-auto rounded-xl border border-[#e6dcc2]">
            <table className="w-full text-sm">
              <thead className="bg-[#fff8ea]">
                <tr className="text-left">
                  <th className="px-3 py-2 font-semibold text-[#123b34]">Username</th>
                  <th className="px-3 py-2 font-semibold text-[#123b34]">Role</th>
                  <th className="px-3 py-2 font-semibold text-[#123b34]">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-[#efe7d6]">
                    <td className="px-3 py-2">{u.username}</td>
                    <td className="px-3 py-2 capitalize">{u.role.replace("_", " ")}</td>
                    <td className="px-3 py-2 text-[#0f3c36]/70">
                      {new Date(u.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

