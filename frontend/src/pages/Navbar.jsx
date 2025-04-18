// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { motion } from 'framer-motion';
import axios from 'axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isStatementsOpen, setIsStatementsOpen] = useState(false); // For Statements dropdown
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // For Notifications dropdown
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications when a student logs in
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user && user.role === 'student') {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const response = await axios.get("http://localhost:5000/api/notifications/get", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.success) {
            const fetchedNotifications = response.data.notifications;
            setNotifications(fetchedNotifications);
            setUnreadCount(fetchedNotifications.filter(n => !n.read).length);
          }
        } catch (error) {
          console.error("Fetch Notifications Error:", error);
        }
      }
    };

    fetchNotifications();
  }, [user]);

  // Redirect after login based on role
  useEffect(() => {
    if (user) {
      const currentPath = window.location.pathname;
      if (currentPath === '/login' || currentPath === '/signup') {
        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (user.role === 'student') {
          navigate('/dashboard');
        }
      }
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/notifications/mark-read",
        { notificationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setNotifications(notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        ));
        setUnreadCount(unreadCount - 1);
      }
    } catch (error) {
      console.error("Mark as Read Error:", error);
    }
  };

  // Get user initials for the circular profile icon
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    const initials = names.map((n) => n.charAt(0)).join('');
    return initials.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="bg-white shadow-md px-6 md:px-10 py-2.5 flex items-center justify-between sticky top-0 z-50 border-b border-yellow-500/20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-semibold text-gray-800 tracking-tight"
      >
        <Link to="/">
          Fee<span className="text-yellow-500">Stream</span>
        </Link>
      </motion.div>
      <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-800 items-center uppercase tracking-wide">
        <li>
          <motion.div
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link to="/" className="hover:text-yellow-500 transition-colors duration-300 py-1 px-2 rounded-md hover:bg-yellow-100/50">
              Home
            </Link>
          </motion.div>
        </li>
        <li>
          <motion.div
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link to="/about" className="hover:text-yellow-500 transition-colors duration-300 py-1 px-2 rounded-md hover:bg-yellow-100/50">
              About
            </Link>
          </motion.div>
        </li>
        <li>
          <motion.div
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link to="/contact" className="hover:text-yellow-500 transition-colors duration-300 py-1 px-2 rounded-md hover:bg-yellow-100/50">
              Contact Us
            </Link>
          </motion.div>
        </li>
        {user && (
          <>
            <li>
              <motion.div
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Link
                  to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}
                  className="hover:text-yellow-500 transition-colors duration-300 py-1 px-2 rounded-md hover:bg-yellow-100/50"
                >
                  Dashboard
                </Link>
              </motion.div>
            </li>
            {user.role === 'student' && (
              <>
                <li>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link to="/make-payment" className="hover:text-yellow-500 transition-colors duration-300 py-1 px-2 rounded-md hover:bg-yellow-100/50">
                      Make Payment
                    </Link>
                  </motion.div>
                </li>
                <li className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    onClick={() => setIsStatementsOpen(!isStatementsOpen)}
                    className="hover:text-yellow-500 transition-colors duration-300 flex items-center gap-1 py-1 px-2 rounded-md hover:bg-yellow-100/50"
                  >
                    Statement
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.button>
                  {isStatementsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-md shadow-lg w-52 border border-gray-100"
                    >
                      <Link
                        to="/statement?type=current"
                        className="block px-4 py-2 text-sm uppercase hover:bg-yellow-100 hover:text-yellow-600 transition-colors duration-200 rounded-t-md"
                        onClick={() => setIsStatementsOpen(false)}
                      >
                        Current Statement
                      </Link>
                      <Link
                        to="/statement?type=history"
                        className="block px-4 py-2 text-sm uppercase hover:bg-yellow-100 hover:text-yellow-600 transition-colors duration-200 rounded-b-md"
                        onClick={() => setIsStatementsOpen(false)}
                      >
                        Payment History
                      </Link>
                    </motion.div>
                  )}
                </li>
                {/* Notifications Icon and Dropdown */}
                <li className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="hover:text-yellow-500 transition-colors duration-300 flex items-center gap-1 py-1 px-2 rounded-md hover:bg-yellow-100/50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </motion.button>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-full right-0 mt-2 bg-white text-gray-800 rounded-md shadow-lg w-64 border border-gray-100 max-h-96 overflow-y-auto"
                    >
                      {notifications.length === 0 ? (
                        <p className="px-4 py-2 text-sm text-gray-600">No notifications</p>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`px-4 py-2 text-sm border-b last:border-b-0 ${
                              notification.read ? 'bg-gray-50' : 'bg-yellow-50'
                            } hover:bg-yellow-100 transition-colors duration-200 flex justify-between items-start`}
                          >
                            <div>
                              <p className="text-gray-800">{notification.message}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification._id)}
                                className="text-blue-600 hover:underline text-xs"
                              >
                                Mark as Read
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </li>
              </>
            )}
            <li className="ml-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Link to="/profile">
                  <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center text-base font-semibold hover:bg-yellow-600 transition-colors duration-300 shadow-sm">
                    {getInitials(user.name)}
                  </div>
                </Link>
              </motion.div>
            </li>
            <li>
              <motion.div
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <button
                  onClick={handleLogout}
                  className="hover:text-yellow-500 transition-colors duration-300 py-1 px-2 rounded-md hover:bg-yellow-100/50"
                >
                  Logout
                </button>
              </motion.div>
            </li>
          </>
        )}
        {!user && (
          <>
            <li>
              <motion.div
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Link to="/login" className="hover:text-yellow-500 transition-colors duration-300 py-1 px-2 rounded-md hover:bg-yellow-100/50">
                  Login
                </Link>
              </motion.div>
            </li>
            <li>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Link to="/signup">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors duration-300 shadow-sm">
                    Sign Up
                  </button>
                </Link>
              </motion.div>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;