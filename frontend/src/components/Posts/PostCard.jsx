import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postsAPI } from '../../services/api';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ShareIcon, 
  TrashIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const PostCard = ({ post, onPostDeleted }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwnPost = user?.userId === post.user_id;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await postsAPI.deletePost(post.post_id);
      onPostDeleted(post.post_id);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="user-avatar">
            {post.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {post.first_name} {post.last_name}
            </h3>
            <p className="text-sm text-gray-500">@{post.username}</p>
            <p className="text-xs text-gray-400">{formatDate(post.date_created)}</p>
          </div>
        </div>

        {/* Post Actions Menu */}
        {isOwnPost && (
          <div className="relative">
            <button
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>

            {showDeleteConfirm && (
              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>{isDeleting ? 'Deleting...' : 'Delete Post'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      {post.caption && (
        <div className="mb-4">
          <p className="text-gray-900 whitespace-pre-wrap">{post.caption}</p>
        </div>
      )}

      {/* Post Image */}
      {post.img_url && (
        <div className="mb-4">
          <img
            src={post.img_url}
            alt="Post content"
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            {isLiked ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
            <ChatBubbleLeftIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Comment</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
            <ShareIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
