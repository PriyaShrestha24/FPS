import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [status, setStatus] = useState('Verifying...');
  const [transactionDetails, setTransactionDetails] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const data = params.get('data');
    
        if (!data) {
          setStatus('Error: Transaction data not found in URL');
          return;
        }
    
        const decodedData = atob(data);
        const transactionInfo = JSON.parse(decodedData);
        const productId = transactionInfo.transaction_uuid;
    
        if (!productId) {
          setStatus('Error: Product ID not found in transaction data');
          return;
        }
    
        console.log("Sending Product ID to Backend:", productId); // Add this log
        console.log("Decoded Transaction Info:", transactionInfo); // Add this log
    
        const token = localStorage.getItem('token');
        if (!token) {
          setStatus('Error: No token found. Please log in again.');
          return;
        }
    
        const response = await axios.post(
          'http://localhost:5000/api/auth/payment-status',
          { product_id: productId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        setTransactionDetails({
          productId: productId,
          amount: transactionInfo.total_amount,
          status: response.data.status,
        });
        setStatus('Payment verified successfully!');
      } catch (error) {
        console.error('Payment Verification Error:', error);
        setStatus('Error verifying payment: ' + (error.response?.data?.message || error.message));
      }
    };

    verifyPayment();

    
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Payment Status</h2>
        <p className="text-gray-600 mb-4">{status}</p>
        {transactionDetails && (
          <div className="text-left text-gray-700 mb-6">
            <p><span className="font-semibold">Transaction ID:</span> {transactionDetails.productId}</p>
            <p><span className="font-semibold">Amount:</span> NPR {transactionDetails.amount}</p>
            <p><span className="font-semibold">Status:</span> {transactionDetails.status}</p>
          </div>
        )}
        <Link to="/make-payment">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded">
            Make Another Payment
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;