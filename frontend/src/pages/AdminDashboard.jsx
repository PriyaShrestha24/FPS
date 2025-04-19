import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const { user, loading, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationStatus, setNotificationStatus] = useState(null);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [newUniversity, setNewUniversity] = useState('');
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    duration: '',
    university: '',
    yearlyFees: {},
  });
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
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
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        // Fetch users
        const usersResponse = await axios.get('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 1000 },
        });
        if (usersResponse.data.success) {
          setUsers(usersResponse.data.users);
        } else {
          throw new Error('Failed to fetch users');
        }

        // Fetch universities
        const uniResponse = await axios.get('http://localhost:5000/api/universities/get', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (uniResponse.data.success) {
          setUniversities(uniResponse.data.universities);
        } else {
          throw new Error('Failed to fetch universities');
        }

        // Fetch courses
        const courseResponse = await axios.get('http://localhost:5000/api/courses/get', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (courseResponse.data.success) {
          setCourses(courseResponse.data.courses);
        } else {
          throw new Error('Failed to fetch courses');
        }

        // Fetch transactions for Fee Management tab
        if (activeTab === 'fees') {
          const transactionsResponse = await axios.get('http://localhost:5000/api/transactions/all', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (transactionsResponse.data.success) {
            setTransactions(transactionsResponse.data.transactions);
          } else {
            throw new Error('Failed to fetch transactions');
          }
        }

        // Fetch notification history for Notifications tab
        if (activeTab === 'notifications') {
          const historyResponse = await axios.get('http://localhost:5000/api/notifications/get', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (historyResponse.data.success) {
            setNotificationHistory(historyResponse.data.notifications);
          } else {
            throw new Error('Failed to fetch notification history');
          }
        }
      } catch (error) {
        console.error('Fetch Error:', error.response || error.message);
        setFetchError(error.response?.data?.error || error.message || 'Error fetching data');
        toast.error(error.response?.data?.error || 'Error fetching data');
      } finally {
        setIsFetching(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user, activeTab]);

  const handleEdit = (user) => {
    setEditingUser({ ...user, dueDates: user.dueDates || [] });
  };

  const handleUpdate = async () => {
    if (!editingUser.name || !editingUser.email) {
      toast.error('Name and email are required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/auth/users/update',
        {
          userId: editingUser._id,
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
          studentId: editingUser.studentId,
          university: editingUser.university?._id || editingUser.university,
          program: editingUser.program?._id || editingUser.program,
          year: editingUser.year,
          dueDates: editingUser.dueDates,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUsers(users.map((u) => (u._id === editingUser._id ? response.data.user : u)));
        setEditingUser(null);
        toast.success('User updated successfully');
      }
    } catch (error) {
      console.error('Update Error:', error);
      toast.error(error.response?.data?.error || 'Error updating user');
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete('http://localhost:5000/api/auth/users/delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId },
      });

      if (response.data.success) {
        setUsers(users.filter((u) => u._id !== userId));
        toast.success('User deleted successfully');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      toast.error(error.response?.data?.error || 'Error deleting user');
    }
  };

  const handleSendNotification = async () => {
    if (!notificationMessage.trim()) {
      toast.error('Notification message is required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/notifications/send-fee-reminder',
        {
          message: notificationMessage,
          recipients: users.filter((u) => u.role === 'student').map((u) => u._id),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setNotificationStatus('Notification sent successfully!');
        toast.success('Notification sent successfully');
        const historyResponse = await axios.get('http://localhost:5000/api/notifications/get', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (historyResponse.data.success) {
          setNotificationHistory(historyResponse.data.notifications);
        }
      } else {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      console.error('Notification Error:', error);
      setNotificationStatus(error.response?.data?.error || 'Error sending notification');
      toast.error(error.response?.data?.error || 'Error sending notification');
    }
  };

  const handleTriggerCron = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/notifications/trigger-cron',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setNotificationStatus('Cron job triggered successfully!');
        toast.success('Cron job triggered successfully');
        const historyResponse = await axios.get('http://localhost:5000/api/notifications/get', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (historyResponse.data.success) {
          setNotificationHistory(historyResponse.data.notifications);
        }
      }
    } catch (error) {
      setNotificationStatus(error.response?.data?.error || 'Error triggering cron job');
      toast.error(error.response?.data?.error || 'Error triggering cron job');
    }
  };

  const handleGenerateFeeReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/reports/fee-collection', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setReportData(response.data.report);
        toast.success('Fee collection report generated');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error generating report');
    }
  };

  const handleGenerateActivityReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/reports/user-activity', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setReportData(response.data.report);
        toast.success('User activity report generated');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error generating report');
    }
  };

  const handleExportReport = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ...Object.entries(reportData).map(([key, value]) => [key, value]),
    ]
      .map((row) => row.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'report.csv';
    link.click();
    toast.success('Report exported as CSV');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Both current and new passwords are required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/auth/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setPasswordStatus('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        toast.success('Password updated successfully');
      }
    } catch (error) {
      setPasswordStatus(error.response?.data?.error || 'Error updating password');
      toast.error(error.response?.data?.error || 'Error updating password');
    }
  };

  const handleAddUniversity = async (e) => {
    e.preventDefault();
    if (!newUniversity.trim()) {
      toast.error('University name is required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/universities/add',
        { name: newUniversity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setUniversities([...universities, response.data.university]);
        setNewUniversity('');
        toast.success('University added successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error adding university');
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.code || !newCourse.duration || !newCourse.university) {
      toast.error('All course fields are required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const yearlyFees = {};
      for (let i = 1; i <= newCourse.duration; i++) {
        const yearLabel = `${i}${i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th'} Year`;
        yearlyFees[yearLabel] = newCourse.yearlyFees[yearLabel] || 0;
      }
      const response = await axios.post(
        'http://localhost:5000/api/courses/add',
        { ...newCourse, yearlyFees },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setCourses([...courses, response.data.course]);
        setNewCourse({
          name: '',
          code: '',
          duration: '',
          university: '',
          yearlyFees: {},
        });
        toast.success('Course added successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error adding course');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Chart Data for Dashboard
  const roleChartData = {
    labels: ['Students', 'Admins'],
    datasets: [
      {
        label: 'User Roles',
        data: [
          users.filter((u) => u.role === 'student').length,
          users.filter((u) => u.role === 'admin').length,
        ],
        backgroundColor: ['#FBBF24', '#4B5563'],
        borderColor: ['#FBBF24', '#4B5563'],
        borderWidth: 1,
      },
    ],
  };

  const universityChartData = {
    labels: [...new Set(users.map((u) => u.university?.name || 'Unknown'))],
    datasets: [
      {
        label: 'Users by University',
        data: [...new Set(users.map((u) => u.university?.name || 'Unknown'))].map(
          (uni) =>
            users.filter((u) => u.university?.name === uni || (!u.university && uni === 'Unknown'))
              .length
        ),
        backgroundColor: ['#FBBF24', '#9CA3AF', '#E5E7EB'],
        hoverBackgroundColor: ['#F59E0B', '#6B7280', '#D1D5DB'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, family: 'Inter, sans-serif' },
          color: '#1F2937',
        },
      },
      title: {
        display: true,
        font: { size: 18, family: 'Inter, sans-serif', weight: 'bold' },
        color: '#1F2937',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#1F2937', font: { family: 'Inter, sans-serif' } },
        grid: { color: '#E5E7EB' },
      },
      x: {
        ticks: { color: '#1F2937', font: { family: 'Inter, sans-serif' } },
        grid: { display: false },
      },
    },
  };

  // Pagination for transactions
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex min-h-[calc(100vh-80px)] gap-6">
        {/* Fixed Sidebar */}
        <div className="fixed top-20 left-0 w-72 md:w-80 lg:w-96 bg-white shadow-lg rounded-lg p-6 z-10 min-h-[calc(100vh-80px)]">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center text-lg font-semibold mr-4">
              {user?.name
                ? user.name
                    .split(' ')
                    .map((n) => n.charAt(0))
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'A'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{user?.name || 'Admin'}</h3>
              <p className="text-sm text-gray-600">{user?.email || 'admin@example.com'}</p>
            </div>
          </div>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeTab === 'dashboard'
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } font-medium`}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeTab === 'profile'
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } font-medium`}
              >
                Profile Details
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeTab === 'users'
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } font-medium`}
              >
                Users
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeTab === 'notifications'
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } font-medium`}
              >
                Notifications
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('fees')}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeTab === 'fees'
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } font-medium`}
              >
                Fee Management
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeTab === 'reports'
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } font-medium`}
              >
                Reports
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeTab === 'settings'
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } font-medium`}
              >
                Settings
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-4 rounded text-gray-700 hover:bg-gray-100 font-medium"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="ml-72 md:ml-80 lg:ml-96 w-full max-w-6xl p-6">
          {activeTab === 'dashboard' && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>
              <p className="text-gray-700 mb-6">Overview of user statistics and system metrics.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">User Role Distribution</h3>
                  <Bar
                    data={roleChartData}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: { ...chartOptions.plugins.title, text: 'Users by Role' },
                      },
                    }}
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Users by University</h3>
                  <Pie
                    data={universityChartData}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: { ...chartOptions.plugins.title, text: 'Users by University' },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Details</h2>
              {isFetching && <p className="text-gray-600 mb-4">Loading user details...</p>}
              {fetchError && <p className="text-red-500 mb-4">Error: {fetchError}</p>}
              {!isFetching && !fetchError && users.length === 0 && (
                <p className="text-gray-600 mb-4">No users found</p>
              )}
              {users.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">University</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Program</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-base text-gray-700">{user.name}</td>
                          <td className="px-6 py-4 text-base text-gray-700">{user.email}</td>
                          <td className="px-6 py-4 text-base capitalize text-gray-700">{user.role}</td>
                          <td className="px-6 py-4 text-base text-gray-700">
                            {user.university?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-base text-gray-700">{user.program?.name || 'N/A'}</td>
                          <td className="px-6 py-4 text-base text-gray-700">{user.year || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>
              {isFetching && <p className="text-gray-600 mb-4">Loading users...</p>}
              {fetchError && <p className="text-red-500 mb-4">Error: {fetchError}</p>}
              {!isFetching && !fetchError && users.length === 0 && (
                <p className="text-gray-600 mb-4">No users found</p>
              )}
              {users.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">University</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Program</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Year</th>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-base text-gray-700">{user.name}</td>
                          <td className="px-6 py-4 text-base text-gray-700">{user.email}</td>
                          <td className="px-6 py-4 text-base capitalize text-gray-700">{user.role}</td>
                          <td className="px-6 py-4 text-base text-gray-700">
                            {user.university?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-base text-gray-700">{user.program?.name || 'N/A'}</td>
                          <td className="px-6 py-4 text-base text-gray-700">{user.year || 'N/A'}</td>
                          <td className="px-8 py-4">
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => handleEdit(user)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-base"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-base"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Fee Payment Reminders</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Manual Notification</h3>
                  <p className="text-gray-700 mb-4">Send a reminder to all students.</p>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notification Message
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Reminder: Your fee payment is due soon."
                    rows="3"
                  />
                  <button
                    onClick={handleSendNotification}
                    className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Send Notification
                  </button>
                  {notificationStatus && (
                    <p
                      className={`mt-4 ${
                        notificationStatus.includes('Error') ? 'text-red-500' : 'text-green-600'
                      }`}
                    >
                      {notificationStatus}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Automatic Reminders</h3>
                  <p className="text-gray-700 mb-4">View and manage scheduled reminders.</p>
                  <button
                    onClick={handleTriggerCron}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Trigger Cron Job (Test)
                  </button>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Notification History</h4>
                    {notificationHistory.length === 0 && (
                      <p className="text-gray-600">No notifications sent.</p>
                    )}
                    {notificationHistory.length > 0 && (
                      <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                              Message
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                              Sent At
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                              Recipient
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {notificationHistory.map((notif) => (
                            <tr key={notif._id} className="border-b hover:bg-gray-50">
                              <td className="px-6 py-4 text-base text-gray-700">{notif.message}</td>
                              <td className="px-6 py-4 text-base text-gray-700">
                                {new Date(notif.createdAt).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-base text-gray-700">
                                {notif.userId?.name || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Fee Management</h2>
              {isFetching && <p className="text-gray-600 mb-4">Loading transactions...</p>}
              {fetchError && <p className="text-red-500 mb-4">Error: {fetchError}</p>}
              {!isFetching && !fetchError && transactions.length === 0 && (
                <p className="text-gray-600 mb-4">No transactions found</p>
              )}
              {transactions.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          Student
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Year</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTransactions.map((transaction) => (
                        <tr key={transaction._id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-base text-gray-700">
                            {transaction.user_id?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-base text-gray-700">
                            NPR {transaction.amount}
                          </td>
                          <td className="px-6 py-4 text-base text-gray-700">{transaction.year}</td>
                          <td className="px-6 py-4 text-base text-gray-700 capitalize">
                            {transaction.status.toLowerCase()}
                          </td>
                          <td className="px-6 py-4 text-base text-gray-700">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {transactions.length > transactionsPerPage && (
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-gray-300"
                      >
                        Previous
                      </button>
                      <span className="text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-gray-300"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Reports</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Fee Collection Report</h3>
                  <button
                    onClick={handleGenerateFeeReport}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Generate Report
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">User Activity Report</h3>
                  <button
                    onClick={handleGenerateActivityReport}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Generate Report
                  </button>
                </div>
              </div>
              {reportData && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Results</h3>
                  <table className="w-full table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          Metric
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(reportData).map(([key, value]) => (
                        <tr key={key} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-base text-gray-700">{key}</td>
                          <td className="px-6 py-4 text-base text-gray-700">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    onClick={handleExportReport}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Export as CSV
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Change Password</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Update Password
                    </button>
                  </form>
                  {passwordStatus && (
                    <p
                      className={`mt-4 ${
                        passwordStatus.includes('Error') ? 'text-red-500' : 'text-green-600'
                      }`}
                    >
                      {passwordStatus}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Manage Universities</h3>
                  <form onSubmit={handleAddUniversity} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        University Name
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={newUniversity}
                        onChange={(e) => setNewUniversity(e.target.value)}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Add University
                    </button>
                  </form>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Manage Courses</h3>
                  <form onSubmit={handleAddCourse} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course Name
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={newCourse.name}
                        onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course Code
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={newCourse.code}
                        onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (Years)
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={newCourse.duration}
                        onChange={(e) => {
                          const duration = parseInt(e.target.value) || '';
                          setNewCourse({ ...newCourse, duration });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        University
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={newCourse.university}
                        onChange={(e) => setNewCourse({ ...newCourse, university: e.target.value })}
                      >
                        <option value="">Select University</option>
                        {universities.map((uni) => (
                          <option key={uni._id} value={uni._id}>
                            {uni.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {newCourse.duration && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Yearly Fees (NPR)
                        </label>
                        {Array.from({ length: parseInt(newCourse.duration) || 0 }, (_, i) => {
                          const yearLabel = `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Year`;
                          return (
                            <div key={yearLabel} className="mb-2">
                              <label className="block text-sm text-gray-600">{yearLabel}</label>
                              <input
                                type="number"
                                min="0"
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                value={newCourse.yearlyFees[yearLabel] || ''}
                                onChange={(e) =>
                                  setNewCourse({
                                    ...newCourse,
                                    yearlyFees: {
                                      ...newCourse.yearlyFees,
                                      [yearLabel]: parseInt(e.target.value) || 0,
                                    },
                                  })
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Add Course
                    </button>
                  </form>
                </div>
              </div>
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
                          <option key={uni._id} value={uni._id}>
                            {uni.name}
                          </option>
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
                          <option key={course._id} value={course._id}>
                            {course.name}
                          </option>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Due Dates</label>
                      {editingUser.dueDates.map((dueDate, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            className="w-1/2 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            value={dueDate.year}
                            onChange={(e) => {
                              const newDueDates = [...editingUser.dueDates];
                              newDueDates[index].year = e.target.value;
                              setEditingUser({ ...editingUser, dueDates: newDueDates });
                            }}
                            placeholder="Year (e.g., 1st Year)"
                          />
                          <input
                            type="date"
                            className="w-1/2 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            value={new Date(dueDate.dueDate).toISOString().split('T')[0]}
                            onChange={(e) => {
                              const newDueDates = [...editingUser.dueDates];
                              newDueDates[index].dueDate = new Date(e.target.value);
                              setEditingUser({ ...editingUser, dueDates: newDueDates });
                            }}
                          />
                        </div>
                      ))}
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