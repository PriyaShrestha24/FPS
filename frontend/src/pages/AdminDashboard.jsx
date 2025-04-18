import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const AdminDashboard = () => {
  const { user, loading, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // State to manage active tab
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationStatus, setNotificationStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const usersResponse = await axios.get("http://localhost:5000/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (usersResponse.data.success) {
          setUsers(usersResponse.data.users);
        } else {
          throw new Error("Failed to fetch users");
        }

        const uniResponse = await axios.get("http://localhost:5000/api/universities/get");
        if (uniResponse.data.success) {
          setUniversities(uniResponse.data.universities);
        } else {
          throw new Error("Failed to fetch universities");
        }

        const courseResponse = await axios.get("http://localhost:5000/api/courses/get");
        if (courseResponse.data.success) {
          setCourses(courseResponse.data.courses);
        } else {
          throw new Error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Fetch Error:", error.response || error.message);
        setFetchError(error.response?.data?.error || error.message || "Error fetching data");
      } finally {
        setIsFetching(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/auth/users/update",
        {
          userId: editingUser._id,
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
          studentId: editingUser.studentId,
          university: editingUser.university?._id || editingUser.university,
          program: editingUser.program?._id || editingUser.program,
          year: editingUser.year,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUsers(users.map((u) => (u._id === editingUser._id ? response.data.user : u)));
        setEditingUser(null);
      }
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete("http://localhost:5000/api/auth/users/delete", {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId },
      });

      if (response.data.success) {
        setUsers(users.filter((u) => u._id !== userId));
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const handleSendNotification = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/notifications/send-fee-reminder",
        {
          message: notificationMessage || "Reminder: Your fee payment is due soon. Please pay on time to avoid late fees.",
          recipients: users.filter(u => u.role === 'student').map(u => u._id),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setNotificationStatus('Notification sent successfully!');
      } else {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      console.error("Notification Error:", error);
      setNotificationStatus(error.response?.data?.error || error.message || "Error sending notification");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 mt-8 flex gap-6">
        {/* Sidebar */}
        <div className="w-1/4 bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center text-lg font-semibold mr-4">
              {user?.name ? user.name.split(" ").map(n => n.charAt(0)).join("").slice(0, 2).toUpperCase() : "A"}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{user?.name || "Admin"}</h3>
              <p className="text-sm text-gray-600">{user?.email || "admin@example.com"}</p>
            </div>
          </div>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeTab === "dashboard" ? "bg-yellow-500 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeTab === "profile" ? "bg-yellow-500 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Profile Details
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeTab === "users" ? "bg-yellow-500 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Users
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeTab === "notifications" ? "bg-yellow-500 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Send Notifications
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeTab === "settings" ? "bg-yellow-500 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Settings
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("reports")}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeTab === "reports" ? "bg-yellow-500 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Reports
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-4 rounded text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-3/4">
          {activeTab === "dashboard" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>
              <p className="text-gray-700">Welcome to the admin dashboard. Use the sidebar to manage users and view details.</p>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Details</h2>
              {isFetching && <p className="text-gray-600 mb-4">Loading user details...</p>}
              {fetchError && <p className="text-red-500 mb-4">Error: {fetchError}</p>}
              {!isFetching && !fetchError && users.length === 0 && (
                <p className="text-gray-600 mb-4">No users found</p>
              )}
              {users.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">University</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Program</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700">{user.name}</td>
                          <td className="px-4 py-3 text-gray-700">{user.email}</td>
                          <td className="px-4 py-3 capitalize text-gray-700">{user.role}</td>
                          <td className="px-4 py-3 text-gray-700">{user.university?.name || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-700">{user.program?.name || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-700">{user.year || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>
              {isFetching && <p className="text-gray-600 mb-4">Loading users...</p>}
              {fetchError && <p className="text-red-500 mb-4">Error: {fetchError}</p>}
              {!isFetching && !fetchError && users.length === 0 && (
                <p className="text-gray-600 mb-4">No users found</p>
              )}
              {users.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">University</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Program</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Year</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700">{user.name}</td>
                          <td className="px-4 py-3 text-gray-700">{user.email}</td>
                          <td className="px-4 py-3 capitalize text-gray-700">{user.role}</td>
                          <td className="px-4 py-3 text-gray-700">{user.university?.name || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-700">{user.program?.name || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-700">{user.year || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleEdit(user)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Fee Payment Reminders</h2>
              <p className="text-gray-700 mb-4">Send a reminder to all students to pay their fees on time.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notification Message</label>
                  <textarea
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Reminder: Your fee payment is due soon. Please pay on time to avoid late fees."
                    rows="3"
                  />
                </div>
                <button
                  onClick={handleSendNotification}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Send Notification
                </button>
                {notificationStatus && (
                  <p className={`mt-4 ${notificationStatus.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                    {notificationStatus}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Settings</h2>
              <p className="text-gray-700">Manage your admin settings here.</p>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Reports</h2>
              <p className="text-gray-700">View and generate reports here.</p>
            </div>
          )}

          {editingUser && (
            <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit User</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {editingUser.role === 'student' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                      <input
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={editingUser.studentId}
                        onChange={(e) => setEditingUser({ ...editingUser, studentId: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                      <select
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={editingUser.university?._id || editingUser.university || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, university: e.target.value })}
                      >
                        <option value="">Select University</option>
                        {universities.map((uni) => (
                          <option key={uni._id} value={uni._id}>{uni.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                      <select
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={editingUser.program?._id || editingUser.program || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, program: e.target.value })}
                      >
                        <option value="">Select Program</option>
                        {courses.map((course) => (
                          <option key={course._id} value={course._id}>{course.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <input
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={editingUser.year}
                        onChange={(e) => setEditingUser({ ...editingUser, year: e.target.value })}
                      />
                    </div>
                  </>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    onClick={handleUpdate}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;