import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailure = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Payment Failed</h2>
        <p className="text-gray-600 mb-6">There was an issue processing your payment. Please try again.</p>
        <Link to="/make-payment">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded">
            Try Again
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailure;