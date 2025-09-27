import React from 'react';
import CreatePost from '../components/Posts/CreatePost';

const CreatePostPage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
        <p className="text-gray-600">
          Share your thoughts, photos, and moments with your friends.
        </p>
      </div>

      <CreatePost onPostCreated={() => window.history.back()} />
    </div>
  );
};

export default CreatePostPage;
