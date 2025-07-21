import React from 'react';

export function InviteUserForm({ onInvite }: { onInvite: (email: string, role: string) => void }) {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("driver");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(email, role);
    setEmail("");
    setRole("driver");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md bg-neutral-800 text-white border-gray-600 p-2"
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-white">Role</label>
        <select
          id="role"
          value={role}
          onChange={e => setRole(e.target.value)}
          className="mt-1 block w-full rounded-md bg-neutral-800 text-white border-gray-600 p-2"
        >
          <option value="admin">Administrator</option>
          <option value="dispatcher">Dispatcher</option>
          <option value="driver">Driver</option>
          <option value="compliance_officer">Compliance Officer</option>
          <option value="accountant">Accountant</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>
      <button
        type="submit"
        className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
      >
        Invite
      </button>
    </form>
  );
}
