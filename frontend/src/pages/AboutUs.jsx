import React from 'react';
import { Link } from 'react-router-dom';
import aboutus from '../assets/about.jpg';
import featuresabout from '../assets/features.jpg';
import { FaRegEnvelope, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="text-gray-800">
        {/* Navbar */}
              <nav className="bg-white shadow-md px-6 md:px-12 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-semibold text-gray-800">
            Fee<span className="text-yellow-500">Stream</span>
          </div>
        
          {/* Center Nav Links */}
          <ul className="hidden md:flex gap-10 text-sm font-medium text-gray-800">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/make-payment">Make Payment</Link></li>
            <li><Link to="/statement">Statement</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        
          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link to="/login">
              <span className="font-bold text-sm text-black hover:underline">LOGIN</span>
            </Link>
            <Link to="/signup">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded">
                SIGN UP
              </button>
            </Link>
          </div>
        </nav>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat py-28 text-center text-white"
        style={{ backgroundImage: `url(${aboutus})` }}
        >
        <div className="absolute inset-0 bg-black/40"></div> {/* overlay for contrast */}
        <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About FeeStream</h1>
            <p className="max-w-2xl mx-auto text-lg">
            Simplifying fee payments for universities and students across Nepal.
            </p>
        </div>
</section>


      {/* Our Mission and Vision */}
<section className="py-20 px-6 bg-white text-center">
  <div className="max-w-5xl mx-auto">
    {/* Heading with underline */}
    <h2 className="text-3xl font-semibold mb-4">Our Vision & Mission</h2>
    <div className="w-24 h-1 bg-yellow-400 mx-auto mb-10 rounded-full"></div>

    {/* Cards */}
    <div className="grid md:grid-cols-2 gap-10 text-left">
      <div className="bg-gray-50 p-6 rounded shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300">
        <h3 className="text-xl font-semibold mb-2">🎯 Vision</h3>
        <p>
          To be Nepal’s most trusted digital platform for secure and transparent university fee payments.
        </p>
      </div>
      <div className="bg-gray-50 p-6 rounded shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300">
        <h3 className="text-xl font-semibold mb-2">🚀 Mission</h3>
        <p>
          We aim to simplify the fee payment process for students, guardians, and institutions with a user-friendly, fast, and transparent system.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Why FeeStream */}
      <section className="bg-gray-100 py-20 px-6">
  <div className="max-w-6xl mx-auto">

    {/* Section Title */}
    <h2 className="text-3xl font-semibold mb-2 text-center">Why FeeStream?</h2>
    <div className="w-20 h-1 bg-yellow-400 mb-12 mx-auto rounded-full"></div>

    {/* Content Row */}
    <div className="flex flex-col md:flex-row items-stretch gap-12">
      
      {/* Text Card */}
      <div className="w-full md:w-1/2">
        <div className="h-full bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 flex flex-col justify-center">
          <p className="text-lg mb-6 text-gray-700">
            In Nepal, fee payment is often manual, time-consuming, and confusing. FeeStream was born to fix that.
          </p>
          <ul className="list-disc list-inside space-y-3 text-gray-800">
            <li>🏠 Pay tuition, hostel, and exam fees from home</li>
            <li>⚡ Real-time transaction confirmations</li>
            <li>💬 24/7 support for students and universities</li>
            <li>📄 Complete payment history & receipts</li>
            <li>🔐 Secure with eSewa, Khalti & more</li>
          </ul>
        </div>
      </div>

      {/* Image Card */}
      <div className="w-full md:w-1/2">
        <div className="h-full overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1">
          <img
            src={featuresabout}
            alt="Why FeeStream"
            className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
          />
        </div>
      </div>

      

    </div>
  </div>
</section>



      {/* Call To Action */}
      <section className="py-20 text-center bg-white">
        <h2 className="text-3xl font-semibold mb-4">Join Us on the Journey</h2>
        <p className="mb-6 text-gray-600">Whether you're a student or a university admin, FeeStream is built to serve you better.</p>
        <Link to="/signup">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded font-semibold">
            Get Started
          </button>
        </Link>
      </section>

            {/* Footer */}
            <footer className="bg-[#2d2e3d] text-white pt-16 pb-8 px-6 text-center">
        <h4 className="text-2xl font-semibold mb-3">Subscribe to our newsletter</h4>
        <p className="text-gray-300 max-w-xl mx-auto mb-6 text-sm">
          Get expert advice for your journey to university delivered to your inbox each month. It's short, and worthwhile – we promise!
        </p>
      
        {/* Email input */}
        <div className="max-w-xl mx-auto flex flex-col items-start sm:flex-row sm:items-center gap-4 mb-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full sm:flex-1 px-4 py-2 rounded text-black"
          />
        </div>
      
        {/* Checkbox */}
        <div className="flex items-start justify-center mb-6">
          <label className="text-sm text-gray-300 flex items-start gap-2 max-w-md">
            <input type="checkbox" className="mt-1" />
            I confirm I am over 16 and I agree to the Terms and Conditions and Privacy Notice.
          </label>
        </div>
      
        <button className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-white transition mb-10">
          SUBSCRIBE NOW
        </button>
      
        <hr className="border-gray-600 mb-8" />
      
        {/* Social icons */}
        <div className="flex justify-center gap-6 mb-6 text-2xl">
          <FaFacebookF className="hover:text-white cursor-pointer" />
          <FaInstagram className="hover:text-white cursor-pointer" />
          <FaTwitter className="hover:text-white cursor-pointer" />
          <FaLinkedinIn className="hover:text-white cursor-pointer" />
        </div>
      
        {/* Footer links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300 mb-6">
          <a href="#">About</a>
          <a href="#">Contact us</a>
          <a href="#">FAQs</a>
          <a href="#">Terms and conditions</a>
          <a href="#">Cookie policy</a>
          <a href="#">Privacy</a>
        </div>
      
        {/* Copyright */}
        <div className="text-sm text-gray-500">
          © 2025 – FeeStream
        </div>
      </footer>
      
    </div>
  );
};

export default AboutUs;
