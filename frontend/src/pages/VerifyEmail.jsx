// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import backgroundImage from '../assets/uni.jpg';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, login } = useAuth(); // Ensure login is destructured

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (token) {
        // Handle verification token from the email link
        try {
          const response = await axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`);
          if (response.data.success) {
            setMessage('Email verified successfully! Redirecting to your dashboard...');
            // Check if token exists before calling /verify
            const authToken = localStorage.getItem('token');
            if (!authToken) {
              setError('No authentication token found. Please log in again.');
              setTimeout(() => navigate('/login'), 3000);
              return;
            }

            try {
              const verifyResponse = await axios.get('http://localhost:5000/api/auth/verify', {
                headers: { Authorization: `Bearer ${authToken}` },
              });
              if (verifyResponse.data.success) {
                logout(); // Clear current user state
                login(verifyResponse.data.user); // Update with new user data
                setTimeout(() => {
                  navigate(user?.role === 'admin' ? '/admin-dashboard' : '/dashboard');
                }, 3000);
              }
            } catch (verifyError) {
              console.error('Verify user error after email verification:', verifyError);
              setError('Failed to refresh user data. Please log in again.');
              localStorage.removeItem('token');
              logout();
              setTimeout(() => navigate('/login'), 3000);
            }
          }
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to verify email.');
        }
      } else if (user && !user.emailVerified) {
        setMessage('Please verify your email to continue. Check your inbox for the verification link.');
      } else if (!user) {
        navigate('/login');
      }
    };

    verifyEmail();
  }, [location, user, navigate, logout, login]);

  const handleResend = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/resend-verification', {
        email: user.email,
      });
      if (response.data.success) {
        setMessage('Verification email resent! Please check your inbox.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend verification email.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen overflow-hidden relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-50"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 z-10">
        <div className="bg-white bg-opacity-90 p-8 rounded-lg max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">FeeStream</h2>
          {message && <p className="text-green-600 mb-4">{message}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {user && !user.emailVerified && (
            <div className="space-y-4">
              <button
                onClick={handleResend}
                className="w-full py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
              >
                Resend Verification Email
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;