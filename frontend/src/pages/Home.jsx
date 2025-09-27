import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import PostCard from '../components/Posts/PostCard';
import CreatePost from '../components/Posts/CreatePost';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAllPosts();
      setPosts(response.data.posts || []);
      setError(null);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post.post_id !== postId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-600">
          Stay connected with your friends and share what's on your mind.
        </p>
      </div>

      {/* Create Post Section */}
      <div className="mb-8">
        <CreatePost onPostCreated={handlePostCreated} />
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12h6m-6 4h6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Be the first to share something with your friends!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.post_id}
              post={post}
              onPostDeleted={handlePostDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
