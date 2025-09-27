import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { friendsAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { UserPlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Friends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await friendsAPI.getFriendList();
      setFriends(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load friends');
      console.error('Error fetching friends:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (friendId) => {
    try {
      await friendsAPI.sendFriendRequest(friendId);
      alert('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
    }
  };

  const handleRespondToRequest = async (action, friendId) => {
    try {
      await friendsAPI.respondToFriendRequest(action, friendId);
      fetchFriends(); // Refresh the list
    } catch (error) {
      console.error('Error responding to friend request:', error);
      alert('Failed to respond to friend request');
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Friends</h1>
        <p className="text-gray-600">
          Connect with people and build your social network.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-social-blue focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Friends List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFriends.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <UserPlusIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No friends found' : 'No friends yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start connecting with people to see them here!'
              }
            </p>
          </div>
        ) : (
          filteredFriends.map((friend) => (
            <div key={friend.user_id} className="card-hover">
              <div className="flex items-center space-x-3 mb-4">
                <div className="user-avatar">
                  {friend.first_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {friend.first_name} {friend.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">@{friend.username}</p>
                  {friend.city && (
                    <p className="text-xs text-gray-400">{friend.city}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {friend.status === 1 && (
                    <span className="text-green-600 font-medium">Friends</span>
                  )}
                  {friend.status === 0 && (
                    <span className="text-yellow-600 font-medium">Pending</span>
                  )}
                  {friend.status === 3 && (
                    <span className="text-blue-600 font-medium">Request Sent</span>
                  )}
                </div>

                <div className="flex space-x-2">
                  {friend.status === 0 && (
                    <>
                      <button
                        onClick={() => handleRespondToRequest('accept', friend.user_id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Accept"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRespondToRequest('reject', friend.user_id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {friend.status === 3 && (
                    <button
                      onClick={() => handleSendRequest(friend.user_id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Send Request"
                    >
                      <UserPlusIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Friends;
