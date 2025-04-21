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
    yearlyFees: {}
  });
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [notificationTitle, setNotificationTitle] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [editingUniversityData, setEditingUniversityData] = useState({
    name: '',
    code: '',
    location: ''
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingCourseData, setEditingCourseData] = useState({
    name: '',
    code: '',
    duration: '',
    yearlyFees: {}
  });
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);

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

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setNotificationLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in again.');
      setNotificationLoading(false);
      return;
    }

    if (!notificationTitle || !notificationMessage) {
      setError('Please provide both a title and message for the notification.');
      setNotificationLoading(false);
      return;
    }

    if (!selectedStudents || selectedStudents.length === 0) {
      setError('Please select at least one student to send the notification to.');
      setNotificationLoading(false);
      return;
    }

    try {
      console.log('Sending notification with:', {
        title: notificationTitle,
        message: notificationMessage,
        recipients: selectedStudents,
        token: token ? 'Token exists' : 'No token'
      });

      const response = await axios.post(
        'http://localhost:5000/api/notifications/send-fee-reminder',
        {
          message: notificationMessage,
          recipients: selectedStudents
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Notification response:', response.data);

      if (response.data.success) {
        setSuccess(`Notification sent successfully! ${response.data.stats ? `(${response.data.stats.success} sent, ${response.data.stats.failed} failed)` : ''}`);
        setNotificationTitle('');
        setNotificationMessage('');
        setSelectedStudents([]);
        
        // Dispatch event to refresh notifications in navbar
        window.dispatchEvent(new CustomEvent('refreshNotifications'));
      } else {
        setError(response.data.error || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Notification Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      if (error.response?.status === 403) {
        setError('You do not have permission to send notifications.');
      } else if (error.response?.status === 400) {
        setError(error.response.data.error || 'Invalid notification data provided.');
      } else if (error.response?.status === 404) {
        setError('No valid recipients found.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please check the server logs for details.');
      } else if (!error.response) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to send notification. Please try again later.');
      }
    } finally {
      setNotificationLoading(false);
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
    
    // Normalize the university name
    const normalizedName = newUniversity.trim();
    
    // Check if university name already exists in the current list
    const universityExists = universities.some(
      uni => uni.name.toLowerCase() === normalizedName.toLowerCase()
    );
    
    if (universityExists) {
      toast.error(`"${normalizedName}" already exists in the list`);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token being used:', token); // Log the token
      
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        return;
      }
      
      console.log('Sending request to add university:', normalizedName);
      const response = await axios.post(
        'http://localhost:5000/api/universities/add',
        { name: normalizedName },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log('Response from server:', response.data);
      if (response.data.success) {
        setUniversities([...universities, response.data.university]);
        setNewUniversity('');
        toast.success(`University "${normalizedName}" added successfully with code "${response.data.university.code}"`);
      }
    } catch (error) {
      console.error('Error adding university:', error.response || error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        
        // Provide a more user-friendly message for duplicate universities
        if (error.response.data.error.includes('already exists')) {
          toast.error(error.response.data.error);
        } else {
          toast.error(error.response.data.error || 'Error adding university');
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        toast.error('No response from server. Please try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        toast.error('Error setting up request: ' + error.message);
      }
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.code || !newCourse.duration) {
      toast.error('All course fields are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const yearlyFees = {};
      for (let i = 1; i <= parseInt(newCourse.duration); i++) {
        const yearLabel = `${i}${i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th'} Year`;
        yearlyFees[yearLabel] = newCourse.yearlyFees[yearLabel] || 0;
      }

      const response = await axios.post(
        'http://localhost:5000/api/courses/add',
        {
          name: newCourse.name,
          code: newCourse.code,
          duration: parseInt(newCourse.duration),
          yearlyFees,
          university: editingUniversity._id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCourses([...courses, response.data.course]);
        setShowAddCourseForm(false);
        setNewCourse({
          name: '',
          code: '',
          duration: '',
          yearlyFees: {}
        });
        toast.success('Course added successfully');
      }
    } catch (error) {
      console.error('Add Course Error:', error);
      toast.error(error.response?.data?.error || 'Failed to add course');
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

  const handleEditUniversity = (university) => {
    setEditingUniversity(university);
    setEditingUniversityData({
      name: university.name,
      code: university.code || '',
      location: university.location || ''
    });
  };

  const handleCancelEditUniversity = () => {
    setEditingUniversity(null);
    setEditingUniversityData({
      name: '',
      code: '',
      location: ''
    });
  };

  const handleUpdateUniversity = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/universities/update',
        {
          universityId: editingUniversity._id,
          ...editingUniversityData
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUniversities(universities.map(uni => 
          uni._id === editingUniversity._id ? response.data.university : uni
        ));
        setEditingUniversity(null);
        setEditingUniversityData({ name: '', code: '', location: '' });
        toast.success('University updated successfully');
      }
    } catch (error) {
      console.error('Update University Error:', error);
      toast.error(error.response?.data?.error || 'Error updating university');
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setEditingCourseData({
      name: course.name,
      code: course.code,
      duration: course.duration.toString(),
      yearlyFees: course.yearlyFees
    });
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/courses/update',
        {
          courseId: editingCourse._id,
          ...editingCourseData,
          duration: parseInt(editingCourseData.duration),
          university: editingCourse.university._id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCourses(courses.map(course => 
          course._id === editingCourse._id ? response.data.course : course
        ));
        setEditingCourse(null);
        toast.success('Course updated successfully');
      }
    } catch (error) {
      console.error('Update Course Error:', error);
      toast.error(error.response?.data?.error || 'Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!courseId) {
      toast.error('Invalid course ID');
      return;
    }
    
    console.log('Attempting to delete course with ID:', courseId);
    
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication token not found');
          return;
        }

        const url = `http://localhost:5000/api/courses/${courseId}`;
        console.log('Delete request URL:', url);
        
        const response = await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setCourses(courses.filter(course => course._id !== courseId));
          toast.success('Course deleted successfully');
        }
      } catch (error) {
        console.error('Delete Course Error:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          courseId: courseId
        });
        toast.error(error.response?.data?.error || 'Failed to delete course');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg h-screen fixed top-16">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </span>
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-800">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
            </div>
          </div>
          </div>
          <nav className="p-4">
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'users' 
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Users
              </button>
              <button
                onClick={() => setActiveTab('universities')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'universities' 
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Universities
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notifications
              </button>
        </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* User Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Users</h3>
                      <p className="text-3xl font-bold text-yellow-500">{users.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Universities</h3>
                      <p className="text-3xl font-bold text-yellow-500">{universities.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Courses</h3>
                      <p className="text-3xl font-bold text-yellow-500">{courses.length}</p>
                    </div>
                  </div>

                  {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">User Role Distribution</h3>
                      <div className="h-64">
                        <Pie
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
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Users by University</h3>
                      <div className="h-64">
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
            </div>
          )}

              {/* Users Tab */}
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
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-base text-gray-700">{user.name}</td>
                          <td className="px-6 py-4 text-base text-gray-700">{user.email}</td>
                          <td className="px-6 py-4 text-base capitalize text-gray-700">{user.role}</td>
                              <td className="px-6 py-4 text-base text-gray-700">{user.university?.name || 'N/A'}</td>
                          <td className="px-6 py-4 text-base text-gray-700">{user.program?.name || 'N/A'}</td>
                          <td className="px-6 py-4 text-base text-gray-700">{user.year || 'N/A'}</td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="text-blue-600 hover:text-blue-800 mr-4"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(user._id)}
                                  className="text-red-600 hover:text-red-800"
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

              {/* Universities Tab */}
              {activeTab === 'universities' && (
                <div className="space-y-6">
                  {/* Add University Form */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New University</h2>
                    <form onSubmit={handleAddUniversity} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">University Name</label>
                        <input
                          type="text"
                          name="name"
                          value={newUniversity.name}
                          onChange={(e) => setNewUniversity({ ...newUniversity, name: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">University Code</label>
                        <input
                          type="text"
                          name="code"
                          value={newUniversity.code}
                          onChange={(e) => setNewUniversity({ ...newUniversity, code: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={newUniversity.location}
                          onChange={(e) => setNewUniversity({ ...newUniversity, location: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                      >
                        Add University
                      </button>
                    </form>
                  </div>

                  {/* Universities List */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Universities List</h2>
                <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {universities.map((university) => (
                            <tr key={university._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{university.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{university.code}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{university.location}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                  onClick={() => handleEditUniversity(university)}
                                  className="text-yellow-600 hover:text-yellow-900 mr-4"
                              >
                                Edit
                              </button>
                              <button
                                  onClick={() => handleDeleteUniversity(university._id)}
                                  className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                            </div>
                  </div>

                  {/* Edit University Modal */}
                  {editingUniversity && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                      <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit University</h2>
                        <form onSubmit={handleUpdateUniversity} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">University Name</label>
                              <input
                                type="text"
                                name="name"
                                value={editingUniversityData.name}
                                onChange={(e) => setEditingUniversityData({ ...editingUniversityData, name: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">University Code</label>
                              <input
                                type="text"
                                name="code"
                                value={editingUniversityData.code}
                                onChange={(e) => setEditingUniversityData({ ...editingUniversityData, code: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Location</label>
                              <input
                                type="text"
                                name="location"
                                value={editingUniversityData.location}
                                onChange={(e) => setEditingUniversityData({ ...editingUniversityData, location: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                required
                              />
                            </div>
                          </div>

                          {/* Courses Section */}
                          <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-semibold text-gray-800">Courses</h3>
                              <button
                                type="button"
                                onClick={() => setShowAddCourseForm(true)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                              >
                                Add New Course
                              </button>
                            </div>

                            {/* Courses List */}
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yearly Fees</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {courses
                                    .filter(course => course.university._id === editingUniversity._id)
                                    .map((course) => (
                                      <tr key={course._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.duration} years</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                          {Object.entries(course.yearlyFees).map(([year, fee]) => (
                                            <div key={year}>
                                              {year}: NPR {fee.toLocaleString()}
                                            </div>
                                          ))}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                          <button
                                            type="button"
                                            onClick={() => handleEditCourse(course)}
                                            className="text-yellow-600 hover:text-yellow-900 mr-4"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteCourse(course._id)}
                                            className="text-red-600 hover:text-red-900"
                                          >
                                            Delete
                                          </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-4 mt-6">
                            <button
                              type="button"
                              onClick={handleCancelEditUniversity}
                              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                            >
                              Update University
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Add Course Modal */}
                  {showAddCourseForm && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Add New Course</h3>
                        <form onSubmit={handleAddCourse} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">University</label>
                            <select
                              value={newCourse.university}
                              onChange={(e) => setNewCourse({ ...newCourse, university: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                              required
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
                            <label className="block text-sm font-medium text-gray-700">Course Name</label>
                            <input
                              type="text"
                              value={newCourse.name}
                              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Course Code</label>
                            <input
                              type="text"
                              value={newCourse.code}
                              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Duration (Years)</label>
                            <input
                              type="number"
                              min="1"
                              value={newCourse.duration}
                              onChange={(e) => {
                                const duration = parseInt(e.target.value) || '';
                                setNewCourse({ ...newCourse, duration });
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                              required
                            />
                          </div>
                          {newCourse.duration && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Yearly Fees (NPR)</label>
                              {Array.from({ length: parseInt(newCourse.duration) || 0 }, (_, i) => {
                                const yearLabel = `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Year`;
                                return (
                                  <div key={yearLabel} className="mb-2">
                                    <label className="block text-sm text-gray-600">{yearLabel}</label>
                                    <input
                                      type="number"
                                      min="0"
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
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
                          <div className="flex justify-end space-x-4 mt-6">
                            <button
                              type="button"
                              onClick={() => setShowAddCourseForm(false)}
                              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                            >
                              Add Course
                            </button>
                          </div>
                        </form>
                      </div>
                </div>
              )}
            </div>
          )}

              {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Fee Payment Reminders</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Manual Notification</h3>
                      <p className="text-gray-700 mb-4">Send a reminder to selected students.</p>
                      
                      {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                          {error}
                        </div>
                      )}
                      
                      {success && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                          {success}
                        </div>
                      )}
                      
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notification Title
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
                        value={notificationTitle}
                        onChange={(e) => setNotificationTitle(e.target.value)}
                        placeholder="Fee Payment Reminder"
                      />
                      
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
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Students
                        </label>
                        <div className="flex justify-between items-center mb-2">
                          <button
                            type="button"
                            onClick={() => {
                              const allStudentIds = users
                                .filter(user => user.role === 'student')
                                .map(student => student._id);
                              setSelectedStudents(allStudentIds);
                            }}
                            className="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
                          >
                            Select All Students
                          </button>
                          {selectedStudents.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setSelectedStudents([])}
                              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                            >
                              Clear Selection
                            </button>
                          )}
                        </div>
                        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded px-4 py-2">
                          {users.filter(user => user.role === 'student').map(student => (
                            <div key={student._id} className="flex items-center py-2">
                              <input
                                type="checkbox"
                                id={student._id}
                                checked={selectedStudents.includes(student._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedStudents([...selectedStudents, student._id]);
                                  } else {
                                    setSelectedStudents(selectedStudents.filter(id => id !== student._id));
                                  }
                                }}
                                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                              />
                              <label htmlFor={student._id} className="ml-2 text-sm text-gray-700">
                                {student.name} ({student.email})
                              </label>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Select one or more students to send the reminder
                        </p>
                      </div>
                      
                  <button
                    onClick={(e) => handleSendNotification(e)}
                        disabled={notificationLoading}
                        className={`mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 ${
                          notificationLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {notificationLoading ? 'Sending...' : 'Send Notification'}
                      </button>
                </div>
                    
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Automatic Reminders</h3>
                  <p className="text-gray-700 mb-4">View and manage scheduled reminders.</p>
                  <button
                    onClick={handleTriggerCron}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                        Trigger Automatic Reminders
                  </button>
                </div>
              </div>
            </div>
          )}

              {/* Fees Tab */}
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
                            {transaction.user?.name || 'N/A'}
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

              {/* Reports Tab */}
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

              {/* Edit User Modal */}
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

              {/* Edit Course Modal */}
              {editingCourse && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                    <h3 className="text-lg font-semibold mb-4">Edit Course</h3>
                    <form onSubmit={handleUpdateCourse} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Course Name</label>
                        <input
                          type="text"
                          value={editingCourseData.name}
                          onChange={(e) => setEditingCourseData({ ...editingCourseData, name: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                          required
                        />
        </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Course Code</label>
                        <input
                          type="text"
                          value={editingCourseData.code}
                          onChange={(e) => setEditingCourseData({ ...editingCourseData, code: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                          required
                        />
      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Duration (Years)</label>
                        <input
                          type="number"
                          min="1"
                          value={editingCourseData.duration}
                          onChange={(e) => {
                            const duration = parseInt(e.target.value) || '';
                            setEditingCourseData({ ...editingCourseData, duration });
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                          required
                        />
                      </div>
                      {editingCourseData.duration && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Yearly Fees (NPR)</label>
                          {Array.from({ length: parseInt(editingCourseData.duration) || 0 }, (_, i) => {
                            const yearLabel = `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Year`;
                            return (
                              <div key={yearLabel} className="mb-2">
                                <label className="block text-sm text-gray-600">{yearLabel}</label>
                                <input
                                  type="number"
                                  min="0"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                  value={editingCourseData.yearlyFees[yearLabel] || ''}
                                  onChange={(e) =>
                                    setEditingCourseData({
                                      ...editingCourseData,
                                      yearlyFees: {
                                        ...editingCourseData.yearlyFees,
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
                      <div className="flex justify-end space-x-4 mt-6">
                        <button
                          type="button"
                          onClick={() => setEditingCourse(null)}
                          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                        >
                          Update Course
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminDashboard;