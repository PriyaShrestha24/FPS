import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/auth/users", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

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
          program: editingUser.program,
          year: editingUser.year,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { userId },
      });

      if (response.data.success) {
        setUsers(users.filter((u) => u._id !== userId));
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-gray-900 text-white w-64 p-5 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-4">
          <a className="block hover:text-yellow-400" href="#">Dashboard</a>
          <a className="block hover:text-yellow-400" href="#">Users</a>
          <a className="block hover:text-yellow-400" href="#">Settings</a>
          <a className="block hover:text-yellow-400" href="#">Reports</a>
          <a className="block hover:text-yellow-400" href="#">Logout</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Welcome, {user.name}</h1>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">☰</button>
        </header>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Program</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td className="px-4 py-2" colSpan="5">No users found</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                    <td className="px-4 py-2">{user.program || 'N/A'}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleEdit(user)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600 text-sm">Edit</button>
                      <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {editingUser && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <div className="space-y-3">
              <input
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              />
              <select
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
              {editingUser.role === 'student' && (
                <>
                  <input
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    value={editingUser.studentId}
                    onChange={(e) => setEditingUser({ ...editingUser, studentId: e.target.value })}
                    placeholder="Student ID"
                  />
                  <input
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    value={editingUser.program}
                    onChange={(e) => setEditingUser({ ...editingUser, program: e.target.value })}
                    placeholder="Program"
                  />
                  <input
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    value={editingUser.year}
                    onChange={(e) => setEditingUser({ ...editingUser, year: e.target.value })}
                    placeholder="Year"
                  />
                </>
              )}
              <div className="flex gap-2 pt-2">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleUpdate}>Save</button>
                <button className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => setEditingUser(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
