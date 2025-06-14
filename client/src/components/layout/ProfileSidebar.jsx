import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  UserCheck,
  UserPlus,
  Bookmark,
  Calendar,
  Briefcase,
  IndianRupee,
  ChevronRight,
  Image,
  User,
} from "lucide-react";

function ProfileSidebar({
  connectionStats,
  setShowConnectionsPopup,
  setShowFollowingPopup,
  navigate,
  firstName = "",
  lastName = "",
  profileImage = "",
}) {
  const [imgError, setImgError] = useState(false);
  const initials = `${firstName?.[0] ?? ""}${
    lastName?.[0] ?? ""
  }`.toUpperCase();
  
  // Add console log to debug profile image
  useEffect(() => {
    console.log("Profile Image URL:", profileImage);
  }, [profileImage]);

  return (
    <div className="space-y-5">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600 h-24 relative">
          <div className="absolute inset-0 bg-black opacity-10"></div>
        </div>
        <div className="px-6 pb-6 pt-0 -mt-12 relative z-10">
          <div className="bg-teal-500 rounded-full w-24 h-24 flex items-center justify-center text-white font-semibold uppercase overflow-hidden mx-auto">
            {profileImage && !imgError ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 object-cover rounded-full"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error("Image failed to load:", e);
                  console.error("Image src:", profileImage);
                  setImgError(true);
                }}
                onLoad={() => console.log("Image loaded successfully")}
              />
            ) : (
              <span className="text-6xl">{initials || <User size={80} />}</span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800 mt-4 text-center">
            {firstName || ""} {lastName || ""}
          </h2>
          {/* Connection Stats */}
          <div className="grid grid-cols-2 gap-6 mt-4 w-full">
            <div
              className="text-center cursor-pointer hover:bg-teal-50 p-2 rounded-lg transition-colors duration-300"
              onClick={() =>
                setShowConnectionsPopup && setShowConnectionsPopup(true)
              }
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
              onClick={() =>
                setShowFollowingPopup && setShowFollowingPopup(true)
              }
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
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h2>
        <div className="space-y-3">
          <a
            href="#"
            className="flex items-center py-2 px-3 hover:bg-teal-50 rounded-lg transition-colors duration-300"
            onClick={(e) => {
              e.preventDefault();
              navigate && navigate("/saved-posts");
            }}
          >
            <Bookmark size={18} className="text-teal-500 mr-3" />
            <span className="text-gray-700">Saved Items</span>
            <ChevronRight size={16} className="ml-auto text-gray-400" />
          </a>
          <a
            href="#"
            className="flex items-center py-2 px-3 hover:bg-teal-50 rounded-lg transition-colors duration-300"
            onClick={(e) => {
              e.preventDefault();
              navigate && navigate("/get-events");
            }}
          >
            <Calendar size={18} className="text-teal-500 mr-3" />
            <span className="text-gray-700">All Events</span>
            <ChevronRight size={16} className="ml-auto text-gray-400" />
          </a>
          <a
            href="#"
            className="flex items-center py-2 px-3 hover:bg-teal-50 rounded-lg transition-colors duration-300"
            onClick={(e) => {
              e.preventDefault();
              navigate && navigate("/get-jobs");
            }}
          >
            <Briefcase size={18} className="text-teal-500 mr-3" />
            <span className="text-gray-700">Available Jobs</span>
            <ChevronRight size={16} className="ml-auto text-gray-400" />
          </a>
          <a
            href="#"
            className="flex items-center py-2 px-3 hover:bg-teal-50 rounded-lg transition-colors duration-300"
            onClick={(e) => {
              e.preventDefault();
              navigate && navigate("/my-posts");
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
          <p className="mb-1 text-teal-500">© 2025 AlumniConnect</p>
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
