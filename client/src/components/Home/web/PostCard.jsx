import { useState } from "react"; // Add this at the top of the file if not already

// Inside the PostCard component, before return:
const [liked, setLiked] = useState(false);
const [likes, setLikes] = useState(post?.likes || 0);
const [saved, setSaved] = useState(false);
const [commentsVisible, setCommentsVisible] = useState(false);
const [comments, setComments] = useState(post?.comments || []);
const [newComment, setNewComment] = useState("");
const [shares, setShares] = useState(post?.shares || 0);

const toggleLike = () => {
  setLiked((prev) => !prev);
  setLikes((prev) => (liked ? prev - 1 : prev + 1));
};

const toggleSave = () => {
  setSaved((prev) => !prev);
};

const toggleComments = () => {
  setCommentsVisible((prev) => !prev);
};

const handleCommentSubmit = () => {
  if (!newComment.trim()) return;
  const commentObj = {
    id: Date.now(),
    text: newComment,
    author: "You",
  };
  setComments((prev) => [...prev, commentObj]);
  setNewComment("");
};

const handleShare = () => {
  setShares((prev) => prev + 1);
};

// Replace your existing social interaction block with this:
<div className="mt-3 pt-3 border-t border-gray-100">
  <div className="flex justify-between">
    <button
      onClick={toggleLike}
      className={`flex items-center ${
        liked ? "text-teal-600" : "text-gray-500"
      } hover:text-teal-500 transition-colors py-1 px-2`}
    >
      <Heart size={18} className="mr-1" fill={liked ? "currentColor" : "none"} />
      <span className="text-xs">{liked ? "Liked" : "Like"} ({likes})</span>
    </button>

    <button
      onClick={toggleComments}
      className="flex items-center text-gray-500 hover:text-teal-500 transition-colors py-1 px-2"
    >
      <MessageCircle size={18} className="mr-1" />
      <span className="text-xs">Comment ({comments.length})</span>
    </button>

    <button
      onClick={toggleSave}
      className={`flex items-center ${
        saved ? "text-teal-600" : "text-gray-500"
      } hover:text-teal-500 transition-colors py-1 px-2`}
    >
      <Save size={18} className="mr-1" fill={saved ? "currentColor" : "none"} />
      <span className="text-xs">{saved ? "Saved" : "Save"}</span>
    </button>

    <button
      onClick={handleShare}
      className="flex items-center text-gray-500 hover:text-teal-500 transition-colors py-1 px-2"
    >
      <FileText size={18} className="mr-1" />
      <span className="text-xs">Share ({shares})</span>
    </button>
  </div>

  {commentsVisible && (
    <div className="mt-2 bg-gray-50 rounded-md p-2">
      <div className="space-y-1 max-h-40 overflow-y-auto text-sm">
        {comments.map((c) => (
          <div key={c.id} className="text-gray-700 border-b border-gray-100 pb-1">
            <strong>{c.author}</strong>: {c.text}
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-gray-400 italic">No comments yet</div>
        )}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border border-gray-200 rounded-l-md px-2 py-1 text-sm focus:outline-none"
        />
        <button
          onClick={handleCommentSubmit}
          className="bg-teal-500 text-white text-sm px-3 rounded-r-md"
        >
          Post
        </button>
      </div>
    </div>
  )}
</div>
