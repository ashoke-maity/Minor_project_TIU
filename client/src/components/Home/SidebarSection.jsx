import React from 'react';

export default function SidebarSection({ title, links }) {
  if (!Array.isArray(links)) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm mb-4 p-4">
      <h3 className="text-md font-semibold mb-2 text-gray-700">{title}</h3>
      <ul className="space-y-1 text-sm text-blue-700">
        {links.map((link, index) => (
          <li key={index} className="cursor-pointer hover:underline">{link}</li>
        ))}
      </ul>
    </div>
  );
}
