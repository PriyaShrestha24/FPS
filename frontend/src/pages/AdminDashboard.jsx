import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]); // State to store users
  const navigate = useNavigate();

  // Authentication loading and check
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect if user is not an admin
  if (!user || user.role !== 'admin') {
    navigate('/login');
  }

  // Fetch users when component mounts
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
          setUsers(response.data.users); // Update the state with fetched users
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this will only run once on component mount

  const handleEdit = (userId) => {
    // Implement logic to edit user details
    console.log('Edit user', userId);
  };

  return (
    <div className="d-flex" id="wrapper">
      {/* Sidebar */}
      <div className="bg-dark text-white" id="sidebar" style={{ width: '250px' }}>
        <div className="sidebar-header p-4">
          <h4>Admin Panel</h4>
        </div>
        <ul className="nav flex-column p-2">
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Dashboard</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Users</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Settings</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Reports</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Logout</a>
          </li>
        </ul>
      </div>

      {/* Page Content */}
      <div id="page-content-wrapper" style={{ width: '100%' }}>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <button className="btn btn-dark" id="menu-toggle">☰</button>
          <span className="navbar-text ml-auto">Welcome, {user.name}</span>
        </nav>

        <div className="container-fluid p-4">
          <h2>Users</h2>
          <div className="row">
            <div className="col-12">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Program</th> 
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Render the list of users */}
                  {users.length === 0 ? (
                    <tr><td colSpan="5">No users found</td></tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.program || 'N/A'}</td>
                        <td>
                          <button onClick={() => handleEdit(user._id)} className="btn btn-primary">Edit</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
