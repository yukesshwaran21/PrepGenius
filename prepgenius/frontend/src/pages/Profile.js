import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameLoading, setNameLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileError('');
        const response = await authAPI.getProfile();
        setName(response.data.user.name || '');
        setEmail(response.data.user.email || '');
      } catch (error) {
        setProfileError(error.response?.data?.error || 'Failed to load profile');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setProfileError('');

    if (!name.trim()) {
      setProfileError('Name is required');
      return;
    }

    setNameLoading(true);

    try {
      const response = await authAPI.updateName(name.trim());
      const updatedUser = response.data.user;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setName(updatedUser.name);
      setSuccessMessage('Name updated successfully');
    } catch (error) {
      setProfileError(error.response?.data?.error || 'Failed to update name');
    } finally {
      setNameLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setProfileError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setProfileError('All password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setProfileError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setProfileError('New password and confirm password do not match');
      return;
    }

    setPasswordLoading(true);

    try {
      await authAPI.updatePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('Password updated successfully');
    } catch (error) {
      setProfileError(error.response?.data?.error || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Update your account details.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Back to Dashboard
          </button>
        </div>

        {profileError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {profileError}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Details</h2>
          <p className="text-sm text-gray-500 mb-1">Email (read-only)</p>
          <p className="font-medium text-gray-800">{email}</p>
        </div>

        <form onSubmit={handleNameUpdate} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Name</h2>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
            required
          />
          <button
            type="submit"
            disabled={nameLoading}
            className={`mt-4 px-5 py-2 rounded-lg font-semibold text-white transition ${
              nameLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {nameLoading ? 'Updating...' : 'Update Name'}
          </button>
        </form>

        <form onSubmit={handlePasswordUpdate} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Password</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter current password"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm new password"
              required
            />
          </div>

          <p className="text-xs text-gray-500 mt-2">Password must be at least 6 characters.</p>

          <button
            type="submit"
            disabled={passwordLoading}
            className={`mt-4 px-5 py-2 rounded-lg font-semibold text-white transition ${
              passwordLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
