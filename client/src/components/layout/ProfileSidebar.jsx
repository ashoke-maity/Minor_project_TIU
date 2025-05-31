import React from "react";
import { UserCheck, UserPlus, Bookmark, Calendar, Briefcase, IndianRupee, ChevronRight, Image } from "lucide-react";

function ProfileSidebar({
  initials,
  firstName,
  lastName,
  connectionStats,
  setShowConnectionsPopup,
  setShowFollowingPopup,
  navigate,
}) {
  return (
    <div className="space-y-5">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600 h-24 relative">
          <div className="absolute inset-0 bg-black opacity-10"></div>
        </div>
        <div className="px-6 pb-6 pt-0 -mt-12 relative z-10">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-2xl font-bold shadow-xl mx-auto">
            {initials}
          </div>
          <h2 className="text-xl font-bold text-gray-800 mt-4 text-center">
            {firstName || ""} {lastName || ""}
          </h2>
          {/* Connection Stats */}
          <div className="grid grid-cols-2 gap-6 mt-4 w-full">
            <div
              className="text-center cursor-pointer hover:bg-teal-50 p-2 rounded-lg transition-colors duration-300"
              onClick={() => setShowConnectionsPopup && setShowConnectionsPopup(true)}
            >
              <div className="flex items-center justify-center space-x-2 text-teal-600 mb-1">
                <UserCheck size={18} />
                <span className="text-lg font-semibold">
                  {connectionStats?.connections}
                </span>
              </div>
              <p className="text-sm text-gray-600">Connections</p>
            </div>
            <div
              className="text-center cursor-pointer hover:bg-teal-50 p-2 rounded-lg transition-colors duration-300"
              onClick={() => setShowFollowingPopup && setShowFollowingPopup(true)}
            >
              <div className="flex items-center justify-center space-x-2 text-teal-600 mb-1">
                <UserPlus size={18} />
                <span className="text-lg font-semibold">
                  {connectionStats?.following}
                </span>
              </div>
              <p className="text-sm text-gray-600">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-5 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Quick Links
        </h2>
        <div className="space-y-3">
          <a
            href="#"
            className="flex items-center py-2 px-3 hover:bg-teal-50 rounded-lg transition-colors duration-300"
          >
            <Bookmark size={18} className="text-teal-500 mr-3" />
            <span className="text-gray-700">Bookmarks</span>
            <ChevronRight size={16} className="ml-auto text-gray-400" />
          </a>
          <div className="pl-8 space-y-1">
            <a
              href="#"
              className="block text-sm text-teal-600 hover:underline py-1"
              onClick={e => {
                e.preventDefault();
                navigate && navigate("/my-posts?view=bookmarks");
              }}
            >
              View Saved Bookmarks
            </a>
          </div>
          <a
            href="#"
            className="flex items-center py-2 px-3 hover:bg-teal-50 rounded-lg transition-colors duration-300"
          >
            <Calendar size={18} className="text-teal-500 mr-3" />
            <span className="text-gray-700">Events</span>
            <ChevronRight size={16} className="ml-auto text-gray-400" />
          </a>
          <div className="pl-8 space-y-1">
            <a
              href="#"
              className="block text-sm text-teal-600 hover:underline py-1"
              onClick={e => {
                e.preventDefault();
                navigate && navigate("/my-posts?view=events");
              }}
            >
              Upcoming Events
            </a>
          </div>
          <a
            href="#"
            className="flex items-center py-2 px-3 hover:bg-teal-50 rounded-lg transition-colors duration-300"
          >
            <Briefcase size={18} className="text-teal-500 mr-3" />
            <span className="text-gray-700">Jobs</span>
            <ChevronRight size={16} className="ml-auto text-gray-400" />
          </a>
          <div className="pl-8 space-y-1">
            <a
              href="#"
              className="block text-sm text-teal-600 hover:underline py-1"
              onClick={e => {
                e.preventDefault();
                navigate && navigate("/my-posts?view=jobs");
              }}
            >
              Available Opportunities
            </a>
          </div>
          <a
            href="#"
            className="flex items-center py-2 px-3 hover:bg-teal-50 rounded-lg transition-colors duration-300"
            onClick={e => {
              e.preventDefault();
              navigate && navigate("/my-posts?view=posts");
            }}
          >
            <Image size={18} className="text-teal-500 mr-3" />
            <span className="text-gray-700">My Posts</span>
            <ChevronRight size={16} className="ml-auto text-gray-400" />
          </a>
          <a
            href="#"
            className="flex items-center py-2 px-3 hover:bg-teal-50 rounded-lg transition-colors duration-300"
          >
            <IndianRupee size={18} className="text-teal-500 mr-3" />
            <span className="text-gray-700">Donations</span>
            <ChevronRight size={16} className="ml-auto text-gray-400" />
          </a>
        </div>
        {/* Footer for credits */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
          <p className="mb-1">© 2024 AlumniConnect</p>
          <div className="flex space-x-2">
            <a href="#" className="hover:text-teal-500 transition-colors">
              About
            </a>
            <span>•</span>
            <a href="#" className="hover:text-teal-500 transition-colors">
              Terms
            </a>
            <span>•</span>
            <a href="#" className="hover:text-teal-500 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSidebar;