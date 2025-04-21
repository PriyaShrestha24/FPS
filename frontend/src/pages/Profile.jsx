import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { useAuth } from "../context/authContext";
import { FaUser, FaGraduationCap, FaMoneyBillWave, FaCog, FaSignOutAlt, FaUniversity, FaCalendarAlt, FaIdCard, FaCalendarCheck, FaExclamationCircle, FaChartLine, FaChartPie, FaChartBar, FaDownload, FaReceipt, FaCheckCircle, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';
import { motion } from "framer-motion";
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Profile = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [feeSummary, setFeeSummary] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        // Fetch fee summary
        const feeResponse = await axios.get('http://localhost:5000/api/auth/fee-summary', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeeSummary(feeResponse.data.summary || []);

        // Fetch transactions
        const txResponse = await axios.get('http://localhost:5000/api/auth/transactions?type=all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(txResponse.data.transactions || []);

        // Generate notifications based on user data
        const newNotifications = [];
        if (feeResponse.data.summary) {
          feeResponse.data.summary.forEach(yearData => {
            if (yearData.remainingAmount > 0) {
              newNotifications.push({
                type: 'warning',
                message: `You have NPR ${yearData.remainingAmount.toLocaleString()} remaining for ${yearData.year}`,
                date: new Date()
              });
            }
          });
        }
        setNotifications(newNotifications);
      } catch (err) {
        console.error("Fetch Data Error:", err);
        setError("Failed to load data. Please try again.");
        toast.error("Failed to load your data. Please try again later.");
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading && user) {
      fetchData();
    }
  }, [loading, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading your profile...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaExclamationCircle className="text-yellow-500 text-5xl mx-auto mb-4" />
          <p className="text-gray-600">Please log in to view your profile.</p>
          <Link to="/login" className="text-yellow-500 hover:text-yellow-600 font-medium mt-2 inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Prepare data for charts based on transactions
  const prepareFeeChartData = () => {
    if (!transactions.length) return null;

    // Group transactions by year
    const yearData = {};
    transactions.forEach(tx => {
      if (!yearData[tx.year]) {
        yearData[tx.year] = {
          total: 0,
          paid: 0
        };
      }
      yearData[tx.year].total += tx.amount;
      if (tx.status === 'COMPLETE') {
        yearData[tx.year].paid += tx.amount;
      }
    });

    const years = Object.keys(yearData).sort();
    
    return {
      labels: years.map(year => `Year ${year}`),
      datasets: [
        {
          label: 'Total Fee',
          data: years.map(year => yearData[year].total),
          borderColor: 'rgb(234, 179, 8)',
          backgroundColor: 'rgba(234, 179, 8, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Paid Amount',
          data: years.map(year => yearData[year].paid),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Remaining Amount',
          data: years.map(year => yearData[year].total - yearData[year].paid),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
        },
      ],
    };
  };

  const preparePieChartData = () => {
    if (!transactions.length) return null;

    const totalPaid = transactions
      .filter(tx => tx.status === 'COMPLETE')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const totalRemaining = transactions
      .reduce((sum, tx) => sum + tx.amount, 0) - totalPaid;

    return {
      labels: ['Paid', 'Remaining'],
      datasets: [
        {
          data: [totalPaid, totalRemaining],
          backgroundColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
          borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareYearlyComparisonData = () => {
    if (!transactions.length) return null;

    // Group transactions by year
    const yearData = {};
    transactions.forEach(tx => {
      if (!yearData[tx.year]) {
        yearData[tx.year] = {
          total: 0,
          paid: 0
        };
      }
      yearData[tx.year].total += tx.amount;
      if (tx.status === 'COMPLETE') {
        yearData[tx.year].paid += tx.amount;
      }
    });

    const years = Object.keys(yearData).sort();
    
    return {
      labels: years.map(year => `Year ${year}`),
      datasets: [
        {
          label: 'Payment Completion %',
          data: years.map(year => 
            yearData[year].total > 0 
              ? ((yearData[year].paid / yearData[year].total) * 100).toFixed(1) 
              : 0
          ),
          backgroundColor: 'rgba(234, 179, 8, 0.8)',
          borderColor: 'rgb(234, 179, 8)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Fee Payment Trends'
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Overall Payment Status'
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-80 bg-white shadow-lg h-screen fixed top-16"
        >
          <div className="p-6 border-b border-gray-200">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-4"
            >
              <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center">
                <span className="text-white font-semibold text-3xl">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
            </div>
            <div>
                <p className="text-lg font-semibold text-gray-800">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-500">{user?.email || ''}</p>
                {user?.year && (
                  <p className="text-sm text-yellow-600 font-medium">Year {user.year} Student</p>
                )}
            </div>
            </motion.div>
          </div>

          <nav className="p-6">
            <ul className="space-y-3">
            <li>
              <button
                onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center space-x-3 py-3 px-4 rounded ${
                  activeTab === "profile"
                    ? "bg-yellow-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                  <FaUser className="w-5 h-5" />
                  <span className="text-lg">Profile Details</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("courses")}
                  className={`w-full flex items-center space-x-3 py-3 px-4 rounded ${
                    activeTab === "courses"
                      ? "bg-yellow-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaGraduationCap className="w-5 h-5" />
                  <span className="text-lg">Course Information</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("fees")}
                  className={`w-full flex items-center space-x-3 py-3 px-4 rounded ${
                  activeTab === "fees"
                    ? "bg-yellow-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                  <FaMoneyBillWave className="w-5 h-5" />
                  <span className="text-lg">Fee Overview</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`w-full flex items-center space-x-3 py-3 px-4 rounded ${
                    activeTab === "analytics"
                      ? "bg-yellow-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaChartLine className="w-5 h-5" />
                  <span className="text-lg">Analytics</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center space-x-3 py-3 px-4 rounded ${
                    activeTab === "settings"
                      ? "bg-yellow-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaCog className="w-5 h-5" />
                  <span className="text-lg">Settings</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                  className="w-full flex items-center space-x-3 py-3 px-4 rounded text-gray-700 hover:bg-gray-100"
              >
                  <FaSignOutAlt className="w-5 h-5" />
                  <span className="text-lg">Logout</span>
              </button>
            </li>
          </ul>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="ml-80 flex-1 p-8"
        >
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-6 mb-8 shadow-lg"
          >
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Student'}!</h1>
            <p className="text-yellow-100">
              {user?.program ? `You're currently enrolled in ${user.program.name} at ${user.university?.name}` : 'Complete your profile to get started'}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Fees</p>
                  <p className="text-2xl font-bold text-gray-800">
                    NPR {feeSummary.reduce((acc, curr) => acc + curr.totalFee, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaMoneyBillWave className="text-blue-500 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Paid Amount</p>
                  <p className="text-2xl font-bold text-gray-800">
                    NPR {feeSummary.reduce((acc, curr) => acc + curr.paidAmount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-green-500 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Remaining Amount</p>
                  <p className="text-2xl font-bold text-gray-800">
                    NPR {feeSummary.reduce((acc, curr) => acc + curr.remainingAmount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <FaExclamationCircle className="text-yellow-500 text-xl" />
                </div>
              </div>
            </div>
          </motion.div>

          {activeTab === "profile" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                    <div className="space-y-2">
                  <p><span className="font-semibold">Name:</span> {user.name}</p>
                  <p><span className="font-semibold">Email:</span> {user.email}</p>
                      <p><span className="font-semibold">Phone:</span> {user.phone || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-semibold">University:</span> {user.university?.name || "N/A"}</p>
                  <p><span className="font-semibold">Program:</span> {user.program?.name || "N/A"}</p>
                      <p><span className="font-semibold">Year:</span> {user.year || "N/A"}</p>
                      <p><span className="font-semibold">Student ID:</span> {user.studentId || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Course Information</h2>
              {user.program ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Course Details Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mr-4">
                        <FaGraduationCap className="text-white text-xl" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">Course Details</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <span className="font-medium text-gray-700">Course Name</span>
                        <span className="text-gray-800 font-semibold">{user.program.name}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <span className="font-medium text-gray-700">Course Code</span>
                        <span className="text-gray-800 font-semibold">{user.program.code}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <span className="font-medium text-gray-700">Duration</span>
                        <span className="text-gray-800 font-semibold">{user.program.duration} years</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Fee Structure Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                        <FaMoneyBillWave className="text-white text-xl" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">Fee Structure</h3>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(user.program.yearlyFees || {}).map(([year, fee]) => (
                        <div key={year} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                          <span className="font-medium text-gray-700">Year {year}</span>
                          <span className="text-gray-800 font-semibold">NPR {fee.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Program Overview Card */}
                  <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-green-100 md:col-span-2">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mr-4">
                        <FaUser className="text-white text-xl" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">Program Overview</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <FaUniversity className="mr-2 text-green-500" />
                          University
                        </h4>
                        <p className="text-gray-800 font-medium">{user.university?.name || "N/A"}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <FaCalendarAlt className="mr-2 text-green-500" />
                          Current Year
                        </h4>
                        <p className="text-gray-800 font-medium">{user.year || "N/A"}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <FaIdCard className="mr-2 text-green-500" />
                          Student ID
                        </h4>
                        <p className="text-gray-800 font-medium">{user.studentId || "N/A"}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <FaCalendarCheck className="mr-2 text-green-500" />
                          Enrollment Date
                        </h4>
                        <p className="text-gray-800 font-medium">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <FaExclamationCircle className="text-gray-400 text-4xl mx-auto mb-3" />
                  <p className="text-gray-600">No course details available.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "fees" && (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
              {/* Fee Dashboard Content */}
              <div className="max-w-6xl mx-auto p-8 mt-12">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <h2 className="text-3xl font-bold text-gray-800">Fee Overview Dashboard</h2>
                  <p className="text-gray-600 mt-2">Track your fee payments and due dates</p>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
                  >
                    <p>{error}</p>
                  </motion.div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500"
                    data-aos="fade-up"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Fees</p>
                        <p className="text-2xl font-bold text-gray-800">
                          NPR {feeSummary.reduce((acc, curr) => acc + curr.totalFee, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <FaMoneyBillWave className="text-blue-500 text-xl" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Paid Amount</p>
                        <p className="text-2xl font-bold text-gray-800">
                          NPR {feeSummary.reduce((acc, curr) => acc + curr.paidAmount, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <FaCheckCircle className="text-green-500 text-xl" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-500"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Remaining Amount</p>
                        <p className="text-2xl font-bold text-gray-800">
                          NPR {feeSummary.reduce((acc, curr) => acc + curr.remainingAmount, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-full">
                        <FaExclamationTriangle className="text-yellow-500 text-xl" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Yearly Fee Cards */}
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Yearly Fee Breakdown</h3>
                <div className="grid gap-6">
                  {feeSummary.map((yearData, index) => (
                    <motion.div
                      key={yearData.year}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="bg-white rounded-xl shadow-md overflow-hidden"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 text-white">
                        <h3 className="text-xl font-semibold">{yearData.year}</h3>
                      </div>
                      <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <FaMoneyBillWave className="text-yellow-500 mr-3" />
                                <span className="font-medium text-gray-700">Total Fee</span>
                              </div>
                              <span className="font-semibold text-gray-800">NPR {yearData.totalFee.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <FaCheckCircle className="text-green-500 mr-3" />
                                <span className="font-medium text-gray-700">Paid Amount</span>
                              </div>
                              <span className="font-semibold text-gray-800">NPR {yearData.paidAmount.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <FaExclamationTriangle className="text-yellow-500 mr-3" />
                                <span className="font-medium text-gray-700">Remaining Fee</span>
                              </div>
                              <span className="font-semibold text-gray-800">NPR {yearData.remainingAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <FaCalendarAlt className="text-blue-500 mr-3" />
                                <span className="font-medium text-gray-700">Due Date</span>
                              </div>
                              <span className="font-semibold text-gray-800">{new Date(yearData.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-6">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Payment Progress</span>
                            <span className="text-sm font-medium text-gray-700">
                              {Math.round((yearData.paidAmount / yearData.totalFee) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-yellow-500 h-2.5 rounded-full" 
                              style={{ width: `${Math.min(100, (yearData.paidAmount / yearData.totalFee) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {yearData.remainingAmount > 0 && (
                          <Link to="/make-payment">
                            <motion.button 
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition duration-300"
                            >
                              Pay Now
                              <FaArrowRight className="ml-2" />
                            </motion.button>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="max-w-5xl mx-auto p-8 mt-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Fee Overview Dashboard</h2>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div className="grid gap-6">
                {feeSummary.map((yearData) => (
                    <div key={yearData.year} className="bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{yearData.year}</h3>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div>
                        <p><span className="font-semibold">Total Fee:</span> NPR {yearData.totalFee.toLocaleString()}</p>
                        <p><span className="font-semibold">Paid Amount:</span> NPR {yearData.paidAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p><span className="font-semibold">Remaining Fee:</span> NPR {yearData.remainingAmount.toLocaleString()}</p>
                        <p><span className="font-semibold">Due Date:</span> {new Date(yearData.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {yearData.remainingAmount > 0 && (
                      <Link to="/make-payment">
                        <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded">
                          Pay Now
                        </button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Payment Analytics</h2>
              {transactions && transactions.length > 0 ? (
                <div className="grid gap-6">
                  {/* Line Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaChartLine className="mr-2 text-blue-500" />
                      Fee Payment Trends
                    </h3>
                    <div className="h-80">
                      {prepareFeeChartData() && (
                        <Line data={prepareFeeChartData()} options={chartOptions} />
                      )}
                    </div>
                  </motion.div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-white p-6 rounded-lg shadow-md"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaChartPie className="mr-2 text-purple-500" />
                        Overall Payment Status
                      </h3>
                      <div className="h-64">
                        {preparePieChartData() && (
                          <Pie data={preparePieChartData()} options={pieChartOptions} />
                        )}
                      </div>
                    </motion.div>
                    
                    {/* Bar Chart */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="bg-white p-6 rounded-lg shadow-md"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaChartBar className="mr-2 text-green-500" />
                        Yearly Payment Completion
                      </h3>
                      <div className="h-64">
                        {prepareYearlyComparisonData() && (
                          <Bar data={prepareYearlyComparisonData()} options={chartOptions} />
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Transaction History */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaReceipt className="mr-2 text-yellow-500" />
                      Recent Transactions
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Transaction ID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Year</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Amount (NPR)</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.slice(0, 5).map((tx, index) => (
                            <motion.tr
                              key={tx.product_id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 text-gray-700">{tx.product_id}</td>
                              <td className="px-4 py-3 text-gray-700">{tx.year}</td>
                              <td className="px-4 py-3 text-gray-700">{tx.amount.toLocaleString()}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 rounded text-sm ${
                                    tx.status === 'COMPLETE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                  }`}
                                >
                                  {tx.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-700">{new Date(tx.createdAt).toLocaleDateString()}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {transactions.length > 5 && (
                      <div className="mt-4 text-center">
                        <Link to="/statement">
                          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition">
                            View All Transactions
                          </button>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <FaExclamationCircle className="text-gray-400 text-4xl mx-auto mb-3" />
                  <p className="text-gray-600">No payment data available for analytics.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Settings</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Notifications</label>
                      <select className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                        <option value="all">All Notifications</option>
                        <option value="important">Important Only</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <select className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                        <option value="en">English</option>
                        <option value="ne">नेपाली</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                      <select className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
        </div>
          )}
        </motion.main>
      </div>
    </div>
  );
};

export default Profile;