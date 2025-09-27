import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile(user?.email?.split('@')[0] || '');
      setProfile(response.data);
      setFormData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setFormData(profile);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(profile);
  };

  const handleSave = async () => {
    try {
      await userAPI.updateProfile(formData);
      setProfile(formData);
      updateUser(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and preferences.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="user-avatar w-20 h-20 text-2xl">
              {profile?.first_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profile?.first_name} {profile?.last_name}
              </h2>
              <p className="text-gray-600">@{profile?.username}</p>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
          </div>

          {!editing ? (
            <button
              onClick={handleEdit}
              className="btn-secondary flex items-center space-x-2"
            >
              <PencilIcon className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="btn-primary flex items-center space-x-2"
              >
                <CheckIcon className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center space-x-2"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            {editing ? (
              <input
                type="text"
                name="first_name"
                value={formData.first_name || ''}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-gray-900">{profile?.first_name || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            {editing ? (
              <input
                type="text"
                name="last_name"
                value={formData.last_name || ''}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-gray-900">{profile?.last_name || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            {editing ? (
              <input
                type="text"
                name="username"
                value={formData.username || ''}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-gray-900">@{profile?.username || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            {editing ? (
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            ) : (
              <p className="text-gray-900">
                {profile?.gender === 'M' ? 'Male' : profile?.gender === 'F' ? 'Female' : 'Not specified'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            {editing ? (
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-gray-900">{profile?.city || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            {editing ? (
              <input
                type="text"
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-gray-900">{profile?.state || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            {editing ? (
              <input
                type="text"
                name="country"
                value={formData.country || ''}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-gray-900">{profile?.country || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Date
            </label>
            {editing ? (
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date || ''}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-gray-900">
                {profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString() : 'Not provided'}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Member since:</span>{' '}
              {profile?.date_created ? new Date(profile.date_created).toLocaleDateString() : 'Unknown'}
            </div>
            <div>
              <span className="font-medium">Last updated:</span>{' '}
              {profile?.date_updated ? new Date(profile.date_updated).toLocaleDateString() : 'Never'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
