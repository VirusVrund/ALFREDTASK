import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/axios';

const Settings = () => {
  const { auth } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    // Add password validation
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    try {

      const response = await api.put(`/auth/users/${auth.userId}/password`, {
        oldPassword,
        newPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}` // Add token if required
        }
      });

      if (response.status === 200) {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setMessage('Password updated successfully');
        setError('');
      }
    } catch (err) {
      console.error('Password update error:', {
        status: err.response?.status,
        message: err.response?.data?.message || err.message
      });

      if (err.response?.status === 401) {
        setError('Current password is incorrect');
      } else if (err.response?.status === 500) {
        setError('Server error occurred. Please try again later.');
      } else {
        setError(`Failed to update password: ${err.response?.data?.message || 'Please try again'}`);
      }
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handlePasswordChange}>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label htmlFor="oldPassword" className="form-label">Current Password</label>
        <input
          type="password"
          className="form-control"
          id="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="newPassword" className="form-label">New Password</label>
        <input
          type="password"
          className="form-control"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
        <input
          type="password"
          className="form-control"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isLoading}
      >
        {isLoading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
};

export default Settings;