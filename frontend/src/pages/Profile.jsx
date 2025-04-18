import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { useAuth } from "../context/authContext";

const Profile = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [feeSummary, setFeeSummary] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchFeeSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/fee-summary', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFeeSummary(response.data.summary || []);
      } catch (err) {
        console.error("Fetch Fee Summary Error:", err);
        setError("Failed to load fee summary. Please try again.");
      }
    };

    if (!loading && user) {
      fetchFeeSummary();
    }
  }, [loading, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading your profile...</div>;
  }

  if (!user) {
    return <div className="text-center mt-10 text-gray-600">Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 mt-8 flex gap-6">
        {/* Sidebar */}
        <div className="w-1/4 bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center text-lg font-semibold mr-4">
              {user.name ? user.name.split(" ").map(n => n.charAt(0)).join("").slice(0, 2).toUpperCase() : "U"}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeTab === "profile"
                    ? "bg-yellow-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Profile Details
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("fees")}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeTab === "fees"
                    ? "bg-yellow-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Fee Overview
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
          {activeTab === "profile" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Details</h2>
              <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-700">
                <div>
                  <p><span className="font-semibold">Name:</span> {user.name}</p>
                  <p><span className="font-semibold">Email:</span> {user.email}</p>
                  <p><span className="font-semibold">Student ID:</span> {user.studentId}</p>
                </div>
                <div>
                  <p><span className="font-semibold">Program:</span> {user.program?.name || "N/A"}</p>
                  <p><span className="font-semibold">Year:</span> {user.year}</p>
                  <p><span className="font-semibold">University:</span> {user.university?.name || "N/A"}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "fees" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Fee Overview</h2>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div className="grid gap-6">
                {feeSummary.map((yearData) => (
                  <div key={yearData.year} className="bg-gray-100 rounded-lg p-4 hover:bg-gray-50 transition">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;