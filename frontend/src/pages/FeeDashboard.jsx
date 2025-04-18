import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const FeeDashboard = () => {
  const { user, loading } = useAuth();
  const [feeSummary, setFeeSummary] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    return <div className="text-center mt-10 text-gray-600">Loading your details...</div>;
  }

  if (!user || !user.program) {
    return <div className="text-center mt-10 text-gray-600">User data not available. Please log in again.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Content */}
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
  );
};

export default FeeDashboard;