import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Calendar,
  Briefcase,
  Image,
  IndianRupee,
  X,
  Upload,
  FileText,
} from "lucide-react";

function PostModal({
  isOpen,
  onClose,
  initials,
  firstName,
  lastName,
  onPostCreate,
  postType: initialPostType,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("regular");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Job post form fields
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");
  const [requirements, setRequirements] = useState("");
  const [deadline, setDeadline] = useState("");

  // Event form fields
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventSummary, setEventSummary] = useState("");

  // Media form
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  // Donation form
  const [donationTitle, setDonationTitle] = useState("");
  const [donationGoal, setDonationGoal] = useState("");
  const [donationPurpose, setDonationPurpose] = useState("");

  useEffect(() => {
    if (initialPostType) {
      setPostType(initialPostType);
    }

    // Reset form when modal opens/closes
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, initialPostType]);

  const resetForm = () => {
    setContent("");
    setError("");
    setJobTitle("");
    setCompanyName("");
    setJobLocation("");
    setJobType("");
    setSalary("");
    setRequirements("");
    setDeadline("");
    setEventName("");
    setEventDate("");
    setEventLocation("");
    setEventSummary("");
    setMediaFile(null);
    setMediaPreview(null);
    setDonationTitle("");
    setDonationGoal("");
    setDonationPurpose("");
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate based on post type
    if (postType === "regular" && !content.trim()) {
      setError("Please enter some content.");
      return;
    } else if (postType === "job") {
      if (!jobTitle || !companyName || !jobLocation || !jobType) {
        setError("Please fill out all required job fields.");
        return;
      }
    } else if (postType === "event") {
      if (!eventName || !eventDate || !eventLocation) {
        setError("Please fill out all required event fields.");
        return;
      }
    } else if (postType === "media" && !mediaFile && !content.trim()) {
      setError("Please upload media or enter some content.");
      return;
    } else if (postType === "donation") {
      if (!donationTitle || !donationPurpose) {
        setError("Please fill out all required donation fields.");
        return;
      }
    }

    setError("");
    setLoading(true);

    // Prepare extra data based on post type
    const extraData = {};
    if (postType === "job") {
      extraData.jobTitle = jobTitle;
      extraData.companyName = companyName;
      extraData.location = jobLocation;
      extraData.jobType = jobType;
      extraData.salary = salary;
      extraData.requirements = requirements;
      extraData.deadline = deadline;
    } else if (postType === "event") {
      extraData.eventName = eventName;
      extraData.eventDate = eventDate;
      extraData.location = eventLocation;
      extraData.summary = eventSummary;
    } else if (postType === "donation") {
      extraData.donationTitle = donationTitle;
      extraData.goal = donationGoal;
      extraData.purpose = donationPurpose;
    }

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("postType", postType);
      if (selectedFile) {
        formData.append("media", selectedFile);
      }
      // Add job details
      if (postType === "job") {
        formData.append(
          "jobDetails",
          JSON.stringify({
            jobTitle,
            companyName,
            location: jobLocation,
            jobType,
            salary,
            requirements,
            deadline,
          })
        );
      }

      // Add event details
      if (postType === "event") {
        formData.append(
          "eventDetails",
          JSON.stringify({
            eventName,
            eventDate,
            location: eventLocation,
            summary: eventSummary,
          })
        );
      }

      // Add donation details
      if (postType === "donation") {
        formData.append(
          "donationDetails",
          JSON.stringify({
            donationTitle,
            goal: donationGoal,
            purpose: donationPurpose,
          })
        );
      }

      // Add media if present
      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/create/post`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (typeof onPostCreate === "function") {
        onPostCreate(response.data.post);
      }

      resetForm();
      onClose();
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error("Failed to create post:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/quicktime",
        "video/x-msvideo",
      ];

      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please select an image or video file.");
        return;
      }

      // Validate file size (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        toast.error("File is too large. Maximum size is 10MB.");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-5 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-lg"
          onClick={onClose}
          disabled={loading}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center mb-5 border-b pb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-sm font-bold mr-3 shadow-md">
            {initials}
          </div>
          <div>
            <div className="text-base font-medium text-gray-800">
              {firstName} {lastName}
            </div>
            <div className="text-sm text-gray-500">
              {postType === "regular" && "Creating a post"}
              {postType === "job" && "Posting a job opportunity"}
              {postType === "event" && "Creating an event"}
              {postType === "media" && "Sharing media"}
              {postType === "donation" && "Starting a donation"}
            </div>
          </div>
        </div>

        {/* Post Type Tabs */}
        <div className="flex mb-5 border-b overflow-x-auto">
          <button
            className={`flex items-center px-4 py-2 ${
              postType === "regular"
                ? "text-teal-600 border-b-2 border-teal-500"
                : "text-gray-500 hover:text-teal-600"
            }`}
            onClick={() => setPostType("regular")}
          >
            <FileText size={18} className="mr-2" /> Regular
          </button>
          <button
            className={`flex items-center px-4 py-2 ${
              postType === "job"
                ? "text-teal-600 border-b-2 border-teal-500"
                : "text-gray-500 hover:text-teal-600"
            }`}
            onClick={() => setPostType("job")}
          >
            <Briefcase size={18} className="mr-2" /> Job
          </button>
          <button
            className={`flex items-center px-4 py-2 ${
              postType === "event"
                ? "text-teal-600 border-b-2 border-teal-500"
                : "text-gray-500 hover:text-teal-600"
            }`}
            onClick={() => setPostType("event")}
          >
            <Calendar size={18} className="mr-2" /> Event
          </button>
          <button
            className={`flex items-center px-4 py-2 ${
              postType === "media"
                ? "text-teal-600 border-b-2 border-teal-500"
                : "text-gray-500 hover:text-teal-600"
            }`}
            onClick={() => setPostType("media")}
          >
            <Image size={18} className="mr-2" /> Media
          </button>
          <button
            className={`flex items-center px-4 py-2 ${
              postType === "donation"
                ? "text-teal-600 border-b-2 border-teal-500"
                : "text-gray-500 hover:text-teal-600"
            }`}
            onClick={() => setPostType("donation")}
          >
            <IndianRupee size={18} className="mr-2" /> Donation
          </button>
        </div>

        {/* Form Content */}
        <div className="mb-4 max-h-[400px] overflow-y-auto">
          {/* Regular Post Form */}
          {postType === "regular" && (
            <textarea
              placeholder="What's on your mind?"
              className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-teal-500"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
            />
          )}

          {/* Job Post Form */}
          {postType === "job" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="e.g. Software Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="e.g. Tech Innovations Inc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="e.g. Bangalore, India"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type *
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="">Select job type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="e.g. ₹10-15 LPA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  rows={3}
                  placeholder="List key requirements for the position"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  rows={3}
                  placeholder="Describe the role and responsibilities"
                />
              </div>
            </div>
          )}

          {/* Event Form */}
          {postType === "event" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="e.g. Alumni Reunion 2024"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="e.g. College Auditorium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Summary
                </label>
                <textarea
                  value={eventSummary}
                  onChange={(e) => setEventSummary(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  rows={2}
                  placeholder="Brief summary of the event"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Description
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  rows={3}
                  placeholder="Detailed description, agenda, etc."
                />
              </div>
            </div>
          )}
          {/* Media Upload Form */}
          {postType === "media" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                {mediaPreview ? (
                  <div className="relative">
                    {selectedFile?.type.startsWith("video/") ? (
                      <video
                        src={mediaPreview}
                        className="max-h-48 mx-auto"
                        controls
                      />
                    ) : (
                      <img
                        src={mediaPreview}
                        alt="Upload preview"
                        className="max-h-48 mx-auto object-contain"
                      />
                    )}
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setMediaPreview(null);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      Images (PNG, JPG, GIF) or Videos (MP4, WebM) up to 10MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className={
                    mediaPreview
                      ? "hidden"
                      : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  }
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Validate file type and size
                      const validTypes = [
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                        "image/webp",
                        "video/mp4",
                        "video/webm",
                        "video/quicktime",
                      ];

                      if (!validTypes.includes(file.type)) {
                        toast.error(
                          "Please upload a valid image or video file"
                        );
                        return;
                      }

                      if (file.size > 10 * 1024 * 1024) {
                        toast.error("File size must be less than 10MB");
                        return;
                      }

                      setSelectedFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setMediaPreview(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  accept="image/*, video/mp4, video/webm, video/quicktime"
                />
              </div>

              <textarea
                placeholder="Write a caption..."
                className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-teal-500"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          {/* Donation Form */}
          {postType === "donation" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Donation Title *
                </label>
                <input
                  type="text"
                  value={donationTitle}
                  onChange={(e) => setDonationTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="e.g. Scholarship Fund"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Donation Goal
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={donationGoal}
                    onChange={(e) => setDonationGoal(e.target.value)}
                    className="w-full border border-gray-300 rounded-md pl-8 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="e.g. 100000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose *
                </label>
                <textarea
                  value={donationPurpose}
                  onChange={(e) => setDonationPurpose(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  rows={2}
                  placeholder="Explain the purpose of this donation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  rows={3}
                  placeholder="Provide more details about this donation initiative"
                />
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            className={`bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white px-5 py-2 rounded-md text-sm font-medium shadow-sm hover:shadow transition-shadow ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostModal;
