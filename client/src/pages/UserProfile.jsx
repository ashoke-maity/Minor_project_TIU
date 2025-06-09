import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/layout/Header";
import { UserPlus, UserCheck, Mail, Phone, Briefcase, GraduationCap, MapPin, CalendarDays, LinkIcon } from "lucide-react";

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/");
          return;
        }

        // Get profile data of the user we're viewing
        const profileResponse = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Get current user data to check connections
        const currentUserResponse = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/user/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Get connection status
        const connectionStatusResponse = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/connection-status/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Profile data received:", profileResponse.data.user);
        console.log("Profile image URL:", profileResponse.data.user.profileImage);
        
        setProfileData(profileResponse.data.user);
        setCurrentUserData(currentUserResponse.data.user);
        setIsFollowing(connectionStatusResponse.data.isFollowing);
        setIsConnected(connectionStatusResponse.data.isConnected);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, navigate]);

  const handleConnect = async () => {
    try {
      setSendingRequest(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/follow-request`,
        { targetUserId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 1) {
        setIsFollowing(true);
      }
      setSendingRequest(false);
    } catch (error) {
      console.error("Failed to send connection request", error);
      setSendingRequest(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="text-red-500 text-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="text-xl font-semibold mt-2">Error</h2>
            </div>
            <p className="text-gray-600 text-center">{error}</p>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Go Back
              </button>
              <button
                onClick={() => navigate("/network")}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
              >
                Back to Network
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!profileData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="text-yellow-500 text-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="text-xl font-semibold mt-2">User Not Found</h2>
            </div>
            <p className="text-gray-600 text-center">
              The profile you're looking for doesn't exist or has been removed.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Go Back
              </button>
              <button
                onClick={() => navigate("/network")}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
              >
                Back to Network
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const initials = `${profileData.FirstName?.[0] ?? ""}${
    profileData.LastName?.[0] ?? ""
  }`.toUpperCase();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-teal-500 to-emerald-400 relative">
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-transparent hover:bg-white/20 rounded-md transition-colors border border-white/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
            </div>
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col md:flex-row">
                {/* Profile Picture */}
                <div className="relative -mt-16 md:-mt-20">
                  {profileData.profileImage ? (
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden">
                      <img 
                        src={profileData.profileImage} 
                        alt={`${profileData.FirstName} ${profileData.LastName}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error("Profile image failed to load:", profileData.profileImage);
                          e.target.onerror = null;
                          e.target.parentNode.innerHTML = `<div class="w-full h-full rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-4xl">${initials}</div>`;
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-4xl border-4 border-white">
                      {initials}
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">
                        {profileData.FirstName} {profileData.LastName}
                      </h1>
                      <p className="text-gray-600">
                        {profileData.Title || "Alumni"}
                      </p>
                    </div>

                    {/* Connect Button */}
                    <div className="mt-4 md:mt-0">
                      {isConnected ? (
                        <button
                          disabled
                          className="px-4 py-2 flex items-center justify-center text-teal-600 bg-teal-50 rounded-md border border-teal-200"
                        >
                          <UserCheck size={18} className="mr-2" />
                          Connected
                        </button>
                      ) : isFollowing ? (
                        <button
                          disabled
                          className="px-4 py-2 flex items-center justify-center text-gray-600 bg-gray-100 rounded-md"
                        >
                          Request Sent
                        </button>
                      ) : (
                        <button
                          onClick={handleConnect}
                          disabled={sendingRequest}
                          className="px-4 py-2 flex items-center justify-center text-white bg-teal-500 hover:bg-teal-600 rounded-md transition-colors"
                        >
                          {sendingRequest ? (
                            <span className="flex items-center">
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                              Connecting...
                            </span>
                          ) : (
                            <>
                              <UserPlus size={18} className="mr-2" />
                              Connect
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column */}
            <div className="lg:col-span-1">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail size={18} className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-gray-800">{profileData.Email}</p>
                      <p className="text-xs text-gray-500">Email</p>
                    </div>
                  </div>
                  
                  {profileData.Phone && (
                    <div className="flex items-center">
                      <Phone size={18} className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-gray-800">{profileData.Phone}</p>
                        <p className="text-xs text-gray-500">Phone</p>
                      </div>
                    </div>
                  )}
                  
                  {profileData.Location && (
                    <div className="flex items-center">
                      <MapPin size={18} className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-gray-800">{profileData.Location}</p>
                        <p className="text-xs text-gray-500">Location</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Education */}
              {profileData.Education && profileData.Education.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Education</h2>
                  
                  <div className="space-y-5">
                    {profileData.Education.map((edu, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start">
                          <GraduationCap size={18} className="text-gray-400 mr-3 mt-1" />
                          <div>
                            <p className="font-medium text-gray-800">{edu.school}</p>
                            <p className="text-sm text-gray-600">{edu.degree}</p>
                            {edu.fieldOfStudy && (
                              <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
                            )}
                            {edu.startYear && edu.endYear && (
                              <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <CalendarDays size={14} className="mr-1" />
                                {edu.startYear} - {edu.endYear}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2">
              {/* About */}
              {profileData.Bio && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">About</h2>
                  <p className="text-gray-700 whitespace-pre-line">{profileData.Bio}</p>
                </div>
              )}
              
              {/* Experience */}
              {profileData.Experience && profileData.Experience.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Experience</h2>
                  
                  <div className="space-y-6">
                    {profileData.Experience.map((exp, index) => (
                      <div key={index} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                        <div className="flex">
                          <Briefcase size={18} className="text-gray-400 mr-3 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{exp.title}</h3>
                            <p className="text-sm text-gray-600">{exp.company}</p>
                            {exp.location && (
                              <p className="text-sm text-gray-500">
                                <span className="flex items-center text-xs mt-1">
                                  <MapPin size={14} className="mr-1" /> {exp.location}
                                </span>
                              </p>
                            )}
                            {exp.startDate && (
                              <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <CalendarDays size={14} className="mr-1" />
                                {exp.startDate} - {exp.endDate || 'Present'}
                              </p>
                            )}
                            {exp.description && (
                              <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Skills */}
              {profileData.Skills && profileData.Skills.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profileData.Skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-teal-50 text-teal-700 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Links */}
              {profileData.Links && profileData.Links.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Links</h2>
                  <div className="space-y-3">
                    {profileData.Links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-teal-600 hover:text-teal-700"
                      >
                        <LinkIcon size={16} className="mr-2" />
                        {link.title || link.url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;