import React from "react";
import { Bookmark, Heart, MessageCircle, PlayCircle } from "lucide-react";

function PostCard({ job, post }) {
  const data = job || post;

  if (!data) return null;

  const isJob = !!job;

  // For posts: get user info from populated userId
  const authorFirstName = post?.userId?.FirstName || "";
  const authorLastName = post?.userId?.LastName || "";
  const authorName =
    authorFirstName || authorLastName
      ? `${authorFirstName} ${authorLastName}`
      : "Unknown User";

  const authorInitials =
    ((authorFirstName?.[0] ?? "") + (authorLastName?.[0] ?? "")).toUpperCase() ||
    "U";

  const postTitle = post?.title || "";
  const postContent = post?.content || "";

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-4 w-full">
      {/* Header: Logo or Avatar + Company/User Info */}
      <div className="flex items-center mb-3">
        {isJob ? (
          job?.logo ? (
            <img
              src={job.logo}
              alt="Logo"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="bg-gray-300 text-white w-12 h-12 flex items-center justify-center rounded-full font-bold">
              AC
            </div>
          )
        ) : (
          <div className="bg-gray-300 text-white w-12 h-12 flex items-center justify-center rounded-full font-bold">
            {authorInitials}
          </div>
        )}
        <div className="ml-4">
          <div className="font-semibold text-lg">
            {isJob ? job.companyName : authorName}
          </div>
          <div className="text-blue-600 text-sm">
            {isJob ? job.jobTitle : postTitle}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-2">
        {isJob
          ? job.description?.substring(0, 150) + "..."
          : postContent.substring(0, 150) + "..."}
      </p>

      {/* Additional Job Details */}
      {isJob && (
        <div className="text-sm text-gray-600 space-y-1 mb-3">
          {job.requirements && (
            <div>
              <span className="font-medium">Requirements:</span> {job.requirements}
            </div>
          )}
          {job.jobType && (
            <div>
              <span className="font-medium">Type:</span> {job.jobType}
            </div>
          )}
          {job.location && (
            <div>
              <span className="font-medium">Location:</span> {job.location}
            </div>
          )}
          {job.salary && (
            <div>
              <span className="font-medium">Salary:</span> {job.salary}
            </div>
          )}
          {job.deadline && (
            <div>
              <span className="font-medium">Deadline:</span>{" "}
              {new Date(job.deadline).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      {/* Action Icons */}
      <div className="flex justify-between text-gray-500 pt-2 border-t">
        <Heart className="cursor-pointer" />
        <MessageCircle className="cursor-pointer" />
        <PlayCircle className="cursor-pointer" />
        <Bookmark className="cursor-pointer" />
      </div>
    </div>
  );
}

export default PostCard;