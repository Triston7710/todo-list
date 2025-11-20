import React, { useState } from 'react';
import './Auth.css';
import { authAPI } from '../utils/api';
import { setToken } from '../utils/auth';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authAPI.login(email, password);
        setToken(response.data.token);
        onLogin();
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const response = await authAPI.register(email, password);
        setToken(response.data.token);
        onLogin();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      setError(response.data.message || 'Password reset email sent');
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
        setError(`Reset token (dev only): ${response.data.resetToken}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.resetPassword(resetToken, newPassword);
      setError('Password reset successful! You can now login.');
      setShowForgotPassword(false);
      setResetToken('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Reset Password</h2>
          {!resetToken ? (
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <input
                type="text"
                placeholder="Reset Token"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
          {error && <div className="error">{error}</div>}
          <button 
            className="link-btn" 
            onClick={() => {
              setShowForgotPassword(false);
              setError('');
            }}
          >
            Back to {isLogin ? 'Login' : 'Register'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        {error && <div className="error">{error}</div>}
        <div className="auth-links">
          <button 
            className="link-btn" 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
          {isLogin && (
            <button 
              className="link-btn" 
              onClick={() => {
                setShowForgotPassword(true);
                setError('');
              }}
            >
              Forgot Password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;


