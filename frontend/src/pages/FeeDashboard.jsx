import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle, FaArrowRight } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const FeeDashboard = () => {
  const { user, loading } = useAuth();
  const [feeSummary, setFeeSummary] = useState([]);
  const [error, setError] = useState(null);
  const [totalFees, setTotalFees] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });

    const fetchFeeSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/fee-summary', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFeeSummary(response.data.summary);
        
        // Calculate totals
        const totalFees = response.data.summary.reduce((sum, item) => sum + item.totalFee, 0);
        const totalPaid = response.data.summary.reduce((sum, item) => sum + item.paidAmount, 0);
        const totalRemaining = response.data.summary.reduce((sum, item) => sum + item.remainingAmount, 0);
        
        setTotalFees(totalFees);
        setTotalPaid(totalPaid);
        setTotalRemaining(totalRemaining);
      } catch (err) {
        console.error("Fetch Fee Summary Error:", err);
        setError("Failed to load fee summary. Please try again.");
      }
    };

    if (!loading && user) {
      fetchFeeSummary();
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your details...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">User data not available</h2>
          <p className="text-gray-600 mb-4">Please log in again to access your fee information.</p>
          <Link to="/login" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto p-8 mt-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800">Fee Overview Dashboard</h2>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}</p>
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
                <p className="text-2xl font-bold text-gray-800">NPR {totalFees.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-gray-800">NPR {totalPaid.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-gray-800">NPR {totalRemaining.toLocaleString()}</p>
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
    </div>
  );
};

export default FeeDashboard;