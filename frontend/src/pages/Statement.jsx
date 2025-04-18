import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const Statement = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [statementType, setStatementType] = useState('current');
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  // Handle query parameter to determine statement type
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type') || 'current';
    setStatementType(type);
  }, [location]);

  // Fetch transactions based on statement type
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in again.');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/auth/transactions?type=${statementType}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTransactions(response.data.transactions || []);
      } catch (err) {
        console.error('Fetch Transactions Error:', err);
        setError('Failed to load transactions.');
      }
    };

    if (!loading && user) {
      fetchTransactions();
    }
  }, [loading, user, statementType]);

  // Generate PDF receipt for a transaction
  const generateReceiptPDF = (transaction) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const lineHeight = 10;
    let yPos = margin;

    const yellowColor = [245, 158, 11]; // Tailwind's yellow-500
    const grayColor = [55, 65, 81]; // Tailwind's gray-800

    doc.setFontSize(20);
    doc.setTextColor(...grayColor);
    doc.text('FeeStream Payment Receipt', pageWidth / 2, yPos, { align: 'center' });
    yPos += lineHeight * 2;

    doc.setDrawColor(...yellowColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += lineHeight;

    doc.setFontSize(12);
    doc.setTextColor(...grayColor);
    doc.text(`Transaction ID: ${transaction.product_id}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Student Name: ${user.name}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Student ID: ${user.studentId}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Program: ${user.program?.name || 'N/A'}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Year: ${transaction.year}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Amount: NPR ${transaction.amount.toLocaleString()}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Status: ${transaction.status}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Date: ${new Date(transaction.createdAt).toLocaleDateString()}`, margin, yPos);
    yPos += lineHeight * 2;

    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.text('Thank you for using FeeStream!', pageWidth / 2, doc.internal.pageSize.getHeight() - margin, {
      align: 'center',
    });

    doc.save(`FeeStream_Receipt_${transaction.product_id}.pdf`);
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading transactions...</div>;
  }

  if (!user) {
    return <div className="text-center mt-10 text-gray-600">Please log in to view your payment statement.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-7xl mx-auto p-6 mt-8"
      >
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {statementType === 'current' ? 'Current Statement' : 'Payment History'}
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {transactions.length === 0 ? (
            <p className="text-gray-600">
              No {statementType === 'current' ? 'current statements' : 'payment history'} found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Transaction ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Year</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Amount (NPR)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
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
                      <td className="px-4 py-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => generateReceiptPDF(tx)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                        >
                          Download Receipt
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Statement;