import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import Navbar from "./Navbar";

const MakePayment = () => {
  const { user,loading } = useAuth();
  const [paymentOption, setPaymentOption] = useState("full");
  const [remainingAmount, setRemainingAmount] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  console.log("User in MakePayment:", user, "Loading:", loading);
  const yearMap = {
    "1": "1st Year",
    "2": "2nd Year",
    "3": "3rd Year",
    "4": "4th Year",
  };

const handleOptionChange = (e) => {
  setPaymentOption(e.target.value);
};

useEffect(() => {
  
  console.log("useEffect triggered with location:", location.pathname);
  if (!loading && user) {
    fetchRemainingAmount();
  }
  }, [loading, user, location.pathname]);

  const fetchRemainingAmount = async () => {
    if (!user || !user.year || !user.program) return;

    console.log("User Year Before Mapping:", user.year);
    const mappedYear = yearMap[user.year] || user.year;
    console.log("Mapped Year:", mappedYear);
    
    const yearlyFees = user.program.yearlyFees instanceof Map
      ? Object.fromEntries(user.program.yearlyFees.entries())
      : user.program.yearlyFees;

    const requiredFee = yearlyFees[mappedYear];
    if (!requiredFee) {
      setRemainingAmount("N/A");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/transactions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched Transactions:", response.data.transactions); // Add this log for debugging
      const completedTransactions = response.data.transactions.filter(
        (tx) => tx.year === mappedYear && tx.status === "COMPLETE"
      );
      const totalPaid = completedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      console.log("Total Paid:", totalPaid);
      setRemainingAmount(requiredFee - totalPaid);
    } catch (error) {
      console.error("Fetch Remaining Amount Error:", error);
      setRemainingAmount("Error");
    }
  };

if (loading) {
  return <div className="text-center mt-10 text-gray-600">Loading your details...</div>;
}

if (!user || !user.program) {
  console.log("Loading triggered - User:", user);
    return <div className="text-center mt-10 text-gray-600">User data not available. Please log in again.</div>;
  }

// Convert Map to plain object if needed
const yearlyFees = user.program.yearlyFees instanceof Map
  ? Object.fromEntries(user.program.yearlyFees.entries())
  : user.program.yearlyFees;

  
const mappedYear = yearMap[user.year] || user.year;
console.log("User Year:", user.year, "Mapped Year:", mappedYear);

const calculateAmount = () => {
  const fullFee = yearlyFees?.[mappedYear]; // Use mappedYear
  console.log("Full Fee for Mapped Year:", mappedYear, "is:", fullFee);
  if (!fullFee) return "N/A";
  return paymentOption === "full" ? fullFee : Math.round(fullFee / 3);
};

const [customAmount, setCustomAmount] = useState('');

const handleCustomAmountChange = (e) => {
  const value = e.target.value;
  if (value === '' || (Number(value) > 0 && Number(value) <= remainingAmount)) {
    setCustomAmount(value);
  }
};

const handleEsewaPayment = async () => {
  console.log('Initiating eSewa Payment - User:', JSON.stringify(user, null, 2));
  const amount = customAmount ? Number(customAmount) : calculateAmount();
  console.log('Calculated Amount (NPR):', amount);
  if (!amount || amount === "N/A") {
    alert('Cannot process payment: Fee amount is not available.');
    return;
  }

  if (remainingAmount <= 0) {
    alert(`You have already paid the full fee for ${mappedYear}.`);
    return;
  }

  if (amount > remainingAmount) {
    alert(`You can only pay up to NPR ${remainingAmount} more for ${mappedYear}. Please adjust the payment amount.`);
    return;
  }

  if (amount > 200) {
    alert('For testing, please use an amount under NPR 200 due to sandbox limits.');
    return;
  }

  const token = localStorage.getItem('token');
  console.log('Token:', token);
  if (!token) {
    alert('No token found. Please log in again.');
    navigate('/login');
    return;
  }
  
  const productId =`TXN${uuidv4().replace(/-/g, '')}`;

  try {
    const response = await axios.post(
      'http://localhost:5000/api/auth/initiate-esewa',
      { amount, productId, year: mappedYear },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    console.log('eSewa Response:', response.data);

    if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No payment URL received from the server');
      }
    } catch (error) {
      console.error('eSewa Payment Initiation Error:', error);
      alert('Error initiating payment: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Payment Card */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Student Payment Portal</h2>

        <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-700 mb-6">
          <div>
            <p><span className="font-semibold">Name:</span> {user.name}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Student ID:</span> {user.studentId}</p>
          </div>
          <div>
            <p><span className="font-semibold">Program:</span> {user.program.name}</p>
            <p><span className="font-semibold">Year:</span> {user.year}</p>
            <p><span className="font-semibold">Total Fee:</span> Rs. {yearlyFees[mappedYear]?.toLocaleString()}</p>
            <p><span className="font-semibold">Remaining Fee:</span> Rs. {remainingAmount !== null ? remainingAmount.toLocaleString() : 'Calculating...'}</p>
          </div>
        </div>

        <div className="mb-6">
  <p className="font-medium mb-2 text-gray-800">Select Payment Option:</p>
  <div className="flex gap-8 text-sm">
    <label className="flex items-center gap-2">
      <input
        type="radio"
        value="full"
        name="paymentOption"
        checked={paymentOption === "full"}
        onChange={handleOptionChange}
      />
      Full Payment
    </label>
    <label className="flex items-center gap-2">
      <input
        type="radio"
        value="installment"
        name="paymentOption"
        checked={paymentOption === "installment"}
        onChange={handleOptionChange}
      />
      Pay in Installments
    </label>
  </div>
</div>


        <div className="bg-yellow-100 p-4 rounded-md border-l-4 border-yellow-500 mb-6">
          <p className="text-yellow-800 font-medium">
            Please confirm the above details before proceeding to payment.
          </p>
        </div>

        <button onClick={handleEsewaPayment} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition">
          Pay with Esewa
        </button>
      </div>
    </div>
  );
};

export default MakePayment;
