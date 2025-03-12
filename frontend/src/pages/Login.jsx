// pages/Login.jsx
import axios from 'axios';
import React, { useState } from 'react';
import backgroundImage from '../assets/uni.jpg';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] =  useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting: ", { email, password }); // Debugging log
    try{
        const response =  await axios.post(
          "http://localhost:5000/api/auth/login",
         {email,password}
        );
        console.log("Response: ", response.data); // Debugging log

        if (response.data.success){
          alert("Login Sucessfull")
        }
    }catch(error) {
      console.error("Error Response: ", error.response); // Debugging log
      // if (error.response && error.response.data.success){
      //   setError(error.response.data.error)
      // } else{
      //   setError("Server Error")
      // }
      setError(error.response.data.error)
    }
  }

  return (
    <div className="flex min-h-screen overflow-hidden relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-50"
        style={{ backgroundImage: `url(${backgroundImage})` }} // Corrected template literal syntax
      ></div>

      {/* Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 z-10">
        <div className="bg-white bg-opacity-90 p-8 rounded-lg max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">FeeStream</h2>
          <p className="text-gray-600 mb-6">Login into your account</p>
          {error && <p className='text-red-500'>{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Email Id:</label>
              <input
                type="email"
                placeholder="Enter Email Address"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <span className="absolute left-3 top-10 text-gray-600">✉️</span>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <span className="absolute left-3 top-10 text-gray-600">🔒</span>
            </div>
            <a href="#" className="block text-right text-sm text-blue-600 hover:underline mt-1">
              Forgot password?
            </a>
            <button
              type="submit"
              className="w-full py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
            >
              Login now
            </button>
            <div className="text-center mt-4">
              <span className="text-gray-600">OR</span>
              <button
                type="button"
                className="mt-2 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Sign up now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;