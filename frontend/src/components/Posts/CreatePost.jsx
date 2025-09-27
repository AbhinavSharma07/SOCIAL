import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postsAPI } from '../../services/api';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!caption.trim() && !imageUrl.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await postsAPI.createPost({
        caption: caption.trim(),
        imageUrl: imageUrl.trim(),
      });

      // Reset form
      setCaption('');
      setImageUrl('');
      setShowImageInput(false);

      // Notify parent component
      onPostCreated(response.data);

    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  return (
    <div className="card">
      <div className="flex items-start space-x-3 mb-4">
        <div className="user-avatar">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            {user?.email?.split('@')[0]}
          </h3>
          <p className="text-sm text-gray-500">What's on your mind?</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-social-blue focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {showImageInput && (
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={imageUrl}
                onChange={handleImageUrlChange}
                placeholder="Paste image URL here..."
                className="flex-1 input-field"
              />
              <button
                type="button"
                onClick={() => {
                  setShowImageInput(false);
                  setImageUrl('');
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className="flex items-center space-x-2 text-gray-500 hover:text-social-blue transition-colors"
            >
              <PhotoIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Photo</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (!caption.trim() && !imageUrl.trim())}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="spinner h-4 w-4"></div>
                <span>Posting...</span>
              </div>
            ) : (
              'Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
