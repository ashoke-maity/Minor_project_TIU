import React, { useState, useEffect } from 'react';
import { Megaphone, Bell, Plus, Trash, ExternalLink, Edit } from 'lucide-react';
import axios from 'axios';
import { Button } from '../../shared';
import { Toast } from '../../../utils';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formProcessing, setFormProcessing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    link: ''
  });

  // Fetch announcements
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/get-announcements`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data && res.data.announcements) {
        setAnnouncements(res.data.announcements);
      } else {
        setAnnouncements([]);
      }
    } catch (error) {
      setError("No announcements yet");
    } finally {
      setLoading(false);
    }
  };

  // Handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormProcessing(true);
    try {
      const token = localStorage.getItem("authToken");
      if (editingId) {
        // Edit mode: update the announcement
        const res = await axios.put(
          `${import.meta.env.VITE_ADMIN_API_URL}/admin/update-announcement/${editingId}`,
          {
            title: formData.title,
            content: formData.content,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 200) {
          Toast.success("Announcement updated");
          setShowForm(false);
          setAnnouncements(prev => prev.map(a => a._id === editingId ? res.data.announcement : a));
          resetForm();
        }
      } else {
        // Create mode: create a new announcement
        const res = await axios.post(
          `${import.meta.env.VITE_ADMIN_API_URL}/admin/create-announcement`,
          {
            title: formData.title,
            content: formData.content,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 201 || res.status === 200) {
          Toast.success("Announcement posted");
          setShowForm(false);
          setAnnouncements(prev => [res.data.announcement, ...prev]);
          resetForm();
        }
      }
    } catch (error) {
      Toast.error("Failed to save announcement");
    } finally {
      setFormProcessing(false);
    }
  };

  // Edit announcement
  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      link: announcement.link || ''
    });
    setEditingId(announcement._id);
    setShowForm(true);
  };

  // Delete announcement
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/delete-announcement/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Toast.success("Announcement deleted");
      fetchAnnouncements();
    } catch (error) {
      Toast.error("Failed to delete announcement");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      link: ''
    });
    setEditingId(null);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold flex items-center">
          <Bell className="mr-2 text-blue-500" size={20} />
          Announcements
        </h2>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) resetForm();
          }}
          variant={showForm ? "secondary" : "primary"}
          size="sm"
          icon={showForm ? null : <Plus size={16} />}
        >
          {showForm ? "Cancel" : "New Announcement"}
        </Button>
      </div>

      {/* Form for adding/editing announcements */}
      {showForm && (
        <div className="mb-6 p-4 border border-blue-100 rounded-lg bg-blue-50">
          <h3 className="font-medium mb-3 text-blue-800">
            {editingId ? "Edit Announcement" : "Create New Announcement"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Announcement title"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-gray-700">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Announcement content"
                required
              ></textarea>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                isLoading={formProcessing}
                className="ml-2"
              >
                {editingId ? "Update" : "Post Announcement"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 h-20 rounded"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-5 text-red-500">{error}</div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <Megaphone className="mx-auto mb-3 text-gray-300" size={40} />
          <p>No announcements have been posted yet</p>
          <button 
            onClick={() => setShowForm(true)}
            className="mt-2 text-blue-500 hover:underline text-sm"
          >
            Create your first announcement
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement._id} className="border border-gray-200 rounded-lg p-4 relative hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <h3 className="font-medium">{announcement.title}</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(announcement)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(announcement._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-2">{announcement.content}</p>
              {announcement.link && (
                <a 
                  href={announcement.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-500 text-xs mt-2 hover:underline"
                >
                  <ExternalLink size={12} className="mr-1" />
                  View link
                </a>
              )}
              <div className="mt-2 text-xs text-gray-400">
                Posted on {formatDate(announcement.createdAt)}
                {announcement.updatedAt !== announcement.createdAt && (
                  <span> (Updated: {formatDate(announcement.updatedAt)})</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;