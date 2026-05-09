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
    setSuccessMessage(''); setProfileError('');
    if (!name.trim()) { setProfileError('Name is required'); return; }
    setNameLoading(true);
    try {
      const response = await authAPI.updateName(name.trim());
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setName(response.data.user.name);
      setSuccessMessage('Name updated successfully');
    } catch (error) {
      setProfileError(error.response?.data?.error || 'Failed to update name');
    } finally { setNameLoading(false); }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSuccessMessage(''); setProfileError('');
    if (!currentPassword || !newPassword || !confirmPassword) { setProfileError('All password fields are required'); return; }
    if (newPassword.length < 6) { setProfileError('New password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setProfileError('Passwords do not match'); return; }
    setPasswordLoading(true);
    try {
      await authAPI.updatePassword(currentPassword, newPassword);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setSuccessMessage('Password updated successfully');
    } catch (error) {
      setProfileError(error.response?.data?.error || 'Failed to update password');
    } finally { setPasswordLoading(false); }
  };

  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a12' }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-3" />
          <p style={{ color: '#a1a1b5' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  const cardStyle = { background: '#13131f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a12' }}>
      <div style={{ background: 'rgba(19,19,31,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
        className="sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>P</div>
            <span className="text-white font-bold">Prep<span className="gradient-text">Genius</span></span>
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-ghost text-sm px-3 py-1.5">← Dashboard</button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Profile Settings</h1>
          <p style={{ color: '#a1a1b5' }}>Manage your account details and security.</p>
        </div>

        {profileError && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            ⚠ {profileError}
          </div>
        )}
        {successMessage && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
            ✓ {successMessage}
          </div>
        )}

        {/* Avatar Card */}
        <div className="p-6 mb-5 flex items-center gap-5" style={cardStyle}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#6c5ef7,#7c3aed)', boxShadow: '0 0 24px rgba(108,94,247,0.4)' }}>
            {initials}
          </div>
          <div>
            <p className="text-lg font-bold text-white">{name}</p>
            <p className="text-sm mt-0.5" style={{ color: '#6b6b8a' }}>{email}</p>
            <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(108,94,247,0.15)', color: '#8179fa' }}>
              ✦ Active Member
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="p-6 mb-5" style={cardStyle}>
          <h2 className="text-base font-semibold text-white mb-4">Account Details</h2>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6b6b8a' }}>Email (read-only)</label>
            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#a1a1b5' }}>
              {email}
            </div>
          </div>
        </div>

        {/* Update Name */}
        <form onSubmit={handleNameUpdate} className="p-6 mb-5" style={cardStyle}>
          <h2 className="text-base font-semibold text-white mb-4">Update Display Name</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#c1c1d5' }}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="input-dark" placeholder="Enter your full name" required />
          </div>
          <button type="submit" disabled={nameLoading}
            className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all"
            style={nameLoading ? { background: 'rgba(108,94,247,0.3)', cursor: 'not-allowed' }
              : { background: 'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>
            {nameLoading ? 'Updating...' : 'Update Name'}
          </button>
        </form>

        {/* Update Password */}
        <form onSubmit={handlePasswordUpdate} className="p-6" style={cardStyle}>
          <h2 className="text-base font-semibold text-white mb-4">Change Password</h2>
          <div className="space-y-4">
            {[
              { label: 'Current Password', value: currentPassword, onChange: setCurrentPassword, placeholder: 'Enter current password' },
              { label: 'New Password', value: newPassword, onChange: setNewPassword, placeholder: 'Enter new password' },
              { label: 'Confirm New Password', value: confirmPassword, onChange: setConfirmPassword, placeholder: 'Confirm new password' },
            ].map(field => (
              <div key={field.label}>
                <label className="block text-sm font-medium mb-2" style={{ color: '#c1c1d5' }}>{field.label}</label>
                <input type="password" value={field.value} onChange={e => field.onChange(e.target.value)}
                  className="input-dark" placeholder={field.placeholder} required />
              </div>
            ))}
            <p className="text-xs" style={{ color: '#6b6b8a' }}>Password must be at least 6 characters.</p>
          </div>
          <button type="submit" disabled={passwordLoading}
            className="mt-5 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all"
            style={passwordLoading ? { background: 'rgba(108,94,247,0.3)', cursor: 'not-allowed' }
              : { background: 'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
