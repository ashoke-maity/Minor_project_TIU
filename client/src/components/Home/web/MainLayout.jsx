import React from 'react';
import {IndianRupee} from "lucide-react";

export default function MainLayout() {
  return (
    <div className="flex p-4 bg-gray-100 min-h-screen font-sans">
      {/* Left Sidebar */}
      <div className="w-[25rem] pr-4 space-y-3">
        {/* Profile Card */}
        <div className="bg-white rounded-md border border-gray-200 p-5 shadow-sm flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-3"></div>
          <div className="text-gray-800 font-semibold text-sm">John Doe</div>
          <div className="text-xs text-gray-500">Batch of 2020</div>
        </div>

        {/* Bookmarks Section */}
        <div className="bg-white rounded-md border border-gray-200 p-3 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Bookmarks</h2>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-md border border-gray-200 p-3 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Events</h2>
        </div>
      </div>

      {/* Main Feed */}
      <div className="w-3/5 px-4">
        {/* Start Post Input */}
        <div className="bg-white border border-gray-200 rounded-md p-3 mb-5 w-149 ml-[1.7rem] shadow-sm hover:shadow-md flex justify-center items-center text-gray-700 font-medium">
          <div className="w-9 h-9 rounded-full bg-gray-300 flex-shrink-0 mr-3"></div>
          <input
            type="text"
            placeholder="Start a Post"
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Posts - 1 by 1 square cards, vertically stacked, smaller size */}
        <div className="flex flex-col gap-5 items-center">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 aspect-square w-150 h-120 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center mb-2">
                <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white mr-3">
                  AC
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Alumni Connect</div>
                  <div className="text-xs text-teal-600">Developer at AlumniConnect</div>
                </div>
              </div>

              {/* Body Text */}
              <p className="text-gray-700 text-xs mb-2">
                hello this is 1st sample post for testing / demo
              </p>

              {/* Image */}
              <div className="bg-gray-300 w-full rounded-md flex-grow mb-2"></div>

              {/* Footer */}
              <div className="flex justify-between items-center text-teal-600 text-base px-1 mt-2">
                <div className="flex space-x-3">
                  <button className="hover:text-teal-800">&#9825;</button>
                  <button className="hover:text-teal-800">&#128172;</button>
                  <button className="hover:text-teal-800">&#9654;</button>
                </div>
                <button className="hover:text-teal-800">&#128278;</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[25rem] pl-4 space-y-3">
        {/* Support Section */}
        <div className="bg-white rounded-md border border-gray-200 p-3 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Support</h2>
        </div>

        {/* Donations Section */}
        <div className="bg-white rounded-md border border-gray-200 p-3 shadow-sm flex items-center">
            <div><IndianRupee size={20} /></div>
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Donations</h2>
        </div>
      </div>
    </div>
  );
}
