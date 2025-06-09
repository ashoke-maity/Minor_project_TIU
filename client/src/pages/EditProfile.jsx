import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Save,
  XCircle,
  Plus,
  Trash2,
  Upload,
  ChevronLeft
} from "lucide-react";
import MobileHeader from "../components/mobile/Header";

function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Profile data
  const [profile, setProfile] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    Location: "",
    Title: "",
    Bio: "",
    PassoutYear: "",
    profileImage: "",
    Skills: [],
    Experience: [],
    Education: [],
    SocialLinks: {
      LinkedIn: "",
      GitHub: "",
      Twitter: "",
      Portfolio: ""
    }
  });

  // For adding new items
  const [newSkill, setNewSkill] = useState("");
  const [newExperience, setNewExperience] = useState({
    company: "",
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: ""
  });
  const [newEducation, setNewEducation] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: ""
  });

  // Profile image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/user/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data.user;
        
        // Set default arrays if they don't exist
        userData.Skills = userData.Skills || [];
        userData.Experience = userData.Experience || [];
        userData.Education = userData.Education || [];
        userData.SocialLinks = userData.SocialLinks || {
          LinkedIn: "",
          GitHub: "",
          Twitter: "",
          Portfolio: ""
        };

        setProfile(userData);
        setImagePreview(userData.profileImage);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load your profile. Please try again.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfile({
        ...profile,
        [parent]: {
          ...profile[parent],
          [child]: value
        }
      });
    } else {
      setProfile({
        ...profile,
        [name]: value
      });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Skills handlers
  const addSkill = () => {
    if (newSkill.trim() !== "") {
      setProfile({
        ...profile,
        Skills: [...profile.Skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = [...profile.Skills];
    updatedSkills.splice(index, 1);
    setProfile({
      ...profile,
      Skills: updatedSkills
    });
  };

  // Experience handlers
  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExperience({
      ...newExperience,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const addExperience = () => {
    if (newExperience.company && newExperience.title) {
      setProfile({
        ...profile,
        Experience: [...profile.Experience, { ...newExperience }]
      });
      setNewExperience({
        company: "",
        title: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: ""
      });
    }
  };

  const removeExperience = (index) => {
    const updatedExperience = [...profile.Experience];
    updatedExperience.splice(index, 1);
    setProfile({
      ...profile,
      Experience: updatedExperience
    });
  };

  // Education handlers
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation({
      ...newEducation,
      [name]: value
    });
  };

  const addEducation = () => {
    if (newEducation.school && newEducation.degree) {
      setProfile({
        ...profile,
        Education: [...profile.Education, { ...newEducation }]
      });
      setNewEducation({
        school: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: ""
      });
    }
  };

  const removeEducation = (index) => {
    const updatedEducation = [...profile.Education];
    updatedEducation.splice(index, 1);
    setProfile({
      ...profile,
      Education: updatedEducation
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("authToken");
      
      // Create form data for file upload
      const formData = new FormData();
      
      // Add profile image if changed
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }
      
      // Add profile data
      formData.append("profileData", JSON.stringify(profile));
      
      const response = await axios.put(
        `${import.meta.env.VITE_USER_API_URL}/user/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <MobileHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </>
    );
  }

  const initials = `${profile.FirstName?.[0] ?? ""}${
    profile.LastName?.[0] ?? ""
  }`.toUpperCase();

  return (
    <>
      <MobileHeader />
      <div className="bg-gray-50 min-h-screen pb-20">
        {/* Back Navigation */}
        <div className="bg-white p-4 shadow-sm">
          <button 
            onClick={() => navigate("/home")}
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="ml-1">Back to Home</span>
          </button>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
                Profile updated successfully! Redirecting...
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Profile Image */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Photo</h2>
                <div className="flex items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-2xl overflow-hidden mr-6">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div>
                    <label className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md cursor-pointer inline-flex items-center transition-colors">
                      <Upload size={18} className="mr-2" />
                      Upload Photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="FirstName"
                      value={profile.FirstName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="LastName"
                      value={profile.LastName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="Email"
                      value={profile.Email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="Phone"
                      value={profile.Phone || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="Location"
                      value={profile.Location || ""}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Graduation Year
                    </label>
                    <input
                      type="text"
                      name="PassoutYear"
                      value={profile.PassoutYear || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      name="Title"
                      value={profile.Title || ""}
                      onChange={handleInputChange}
                      placeholder="e.g. Software Engineer at Google"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="Bio"
                      value={profile.Bio || ""}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Tell us about yourself"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Social Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="SocialLinks.LinkedIn"
                      value={profile.SocialLinks?.LinkedIn || ""}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourusername"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub
                    </label>
                    <input
                      type="url"
                      name="SocialLinks.GitHub"
                      value={profile.SocialLinks?.GitHub || ""}
                      onChange={handleInputChange}
                      placeholder="https://github.com/yourusername"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter
                    </label>
                    <input
                      type="url"
                      name="SocialLinks.Twitter"
                      value={profile.SocialLinks?.Twitter || ""}
                      onChange={handleInputChange}
                      placeholder="https://twitter.com/yourusername"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Portfolio Website
                    </label>
                    <input
                      type="url"
                      name="SocialLinks.Portfolio"
                      value={profile.SocialLinks?.Portfolio || ""}
                      onChange={handleInputChange}
                      placeholder="https://yourwebsite.com"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Skills */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Skills</h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.Skills.map((skill, index) => (
                    <div 
                      key={index} 
                      className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full flex items-center"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="ml-2 text-teal-500 hover:text-teal-700"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-teal-500 focus:border-teal-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-r-md transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
              
              {/* Experience */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Experience</h2>
                
                {/* Existing Experience Items */}
                {profile.Experience.length > 0 && (
                  <div className="mb-6 space-y-4">
                    {profile.Experience.map((exp, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-4 relative">
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                        <h3 className="font-medium text-gray-800">{exp.title}</h3>
                        <p className="text-gray-600">{exp.company}</p>
                        {exp.location && <p className="text-gray-500 text-sm">{exp.location}</p>}
                        {(exp.startDate || exp.endDate) && (
                          <p className="text-gray-500 text-sm">
                            {exp.startDate} {exp.endDate && !exp.current ? `- ${exp.endDate}` : exp.current ? "- Present" : ""}
                          </p>
                        )}
                        {exp.description && <p className="text-gray-600 mt-2">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add New Experience Form */}
                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-medium text-gray-800 mb-3">Add New Experience</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company *
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={newExperience.company}
                        onChange={handleExperienceChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={newExperience.title}
                        onChange={handleExperienceChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={newExperience.location}
                        onChange={handleExperienceChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        id="current-position"
                        name="current"
                        checked={newExperience.current}
                        onChange={handleExperienceChange}
                        className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <label htmlFor="current-position" className="ml-2 text-sm text-gray-700">
                        I currently work here
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="text"
                        name="startDate"
                        placeholder="MM/YYYY"
                        value={newExperience.startDate}
                        onChange={handleExperienceChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="text"
                        name="endDate"
                        placeholder="MM/YYYY or leave blank if current"
                        value={newExperience.endDate}
                        onChange={handleExperienceChange}
                        disabled={newExperience.current}
                        className={`w-full p-2 border border-gray-300 rounded-md ${newExperience.current ? 'bg-gray-100' : ''}`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={newExperience.description}
                        onChange={handleExperienceChange}
                        rows="3"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      ></textarea>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors inline-flex items-center"
                  >
                    <Plus size={18} className="mr-1" />
                    Add Experience
                  </button>
                </div>
              </div>
              
              {/* Education */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Education</h2>
                
                {/* Existing Education Items */}
                {profile.Education.length > 0 && (
                  <div className="mb-6 space-y-4">
                    {profile.Education.map((edu, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-4 relative">
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                        <h3 className="font-medium text-gray-800">{edu.school}</h3>
                        <p className="text-gray-600">{edu.degree}</p>
                        {edu.fieldOfStudy && <p className="text-gray-500 text-sm">{edu.fieldOfStudy}</p>}
                        {(edu.startYear || edu.endYear) && (
                          <p className="text-gray-500 text-sm">
                            {edu.startYear} {edu.endYear ? `- ${edu.endYear}` : ""}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add New Education Form */}
                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-medium text-gray-800 mb-3">Add New Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        School *
                      </label>
                      <input
                        type="text"
                        name="school"
                        value={newEducation.school}
                        onChange={handleEducationChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree *
                      </label>
                      <input
                        type="text"
                        name="degree"
                        value={newEducation.degree}
                        onChange={handleEducationChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        name="fieldOfStudy"
                        value={newEducation.fieldOfStudy}
                        onChange={handleEducationChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Year
                        </label>
                        <input
                          type="text"
                          name="startYear"
                          value={newEducation.startYear}
                          onChange={handleEducationChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Year
                        </label>
                        <input
                          type="text"
                          name="endYear"
                          value={newEducation.endYear}
                          onChange={handleEducationChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors inline-flex items-center"
                  >
                    <Plus size={18} className="mr-1" />
                    Add Education
                  </button>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-md transition-colors flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;