import React, { useState } from 'react';

export default function ManageUsersTable() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <section className="bg-white p-4 rounded-lg shadow mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold">Manage Users</h3>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border">
          <thead>
            <tr className="bg-primary-100">
              {["Name", "Passout Year", "Account Created", "Email", "Password", "Last Admin Update", "Permissions"].map((h, idx) => (
                <th key={idx} className="px-4 py-2 border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">User 1</td>
              <td className="px-4 py-2">2023</td>
              <td className="px-4 py-2">01 Jan 2024</td>
              <td className="px-4 py-2">user1@gmail.com</td>
              <td className="px-4 py-2">••••••••</td>
              <td className="px-4 py-2">01 Apr 2024</td>
              <td className="px-4 py-2">Admin</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
