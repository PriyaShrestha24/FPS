import { Link } from 'react-router-dom';
import React from "react";
import uniImage from '../assets/uni.jpg';
import { FaSearch, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';
import featuresBg from '../assets/features.jpg';
import quickImg from '../assets/quick.jpg';
import transparentImg from '../assets/transparency.jpg';
import confirmImg from '../assets/confirmation.jpg';
import supportImg from '../assets/support.jpg';
import { FaRegEnvelope, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';



export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white shadow-md">
        <div className="text-2xl font-bold text-yellow-600">FeeStream</div>
        <ul className="flex gap-8 text-gray-700 font-medium">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Features</a></li>
          <li><a href="#">Help</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <Link to="/login">
            <button className="bg-yellow-500 text-white px-5 py-2 rounded">Login</button>
        </Link>

      </nav>

      
      {/* Hero Section */}
      <div>
        <section
          className="relative h-[70vh] bg-cover bg-center"
          style={{ backgroundImage: `url(${uniImage})` }}
        >
          <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center text-white text-center px-4">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3">
              Safest Online <span className="text-yellow-400">Fee Payment</span> App!
            </h1>
          </div>
        </section>

        <div className="text-center px-6 py-10 max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 mb-4">
            Find the easiest and the safest fee payment app for universities in Nepal.
          </p>
          <p className="text-base text-gray-600 mb-8">
            A simple and secure way to manage your university fees online. Save time, avoid queues, and stay on top of your payment deadlines with ease.
          </p>
          <Link to="/signup">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* Features Icons */}
      <section className="py-16 bg-gray-100 text-center"
      style={{ backgroundImage: `url(${featuresBg})` }}>
  <h2 className="text-3xl font-semibold mb-10">What We Offer</h2>
  <div className="flex justify-center gap-8 flex-wrap px-4">
    {/* Card 1 */}
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 w-full sm:w-[300px] text-left">
      <FaSearch className="text-yellow-500 text-3xl mb-4" />
      <h3 className="font-semibold text-gray-800 text-lg mb-2">Seamless Payment Process</h3>
      <p className="text-sm text-gray-600 mb-3">Pay your tuition and other fees in just a few clicks.</p>
      <Link to="/signup" className="text-yellow-600 font-semibold text-sm hover:underline">
        GET STARTED →
      </Link>
    </div>

    {/* Card 2 */}
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 w-full sm:w-[300px] text-left">
      <FaCalendarAlt className="text-yellow-500 text-3xl mb-4" />
      <h3 className="font-semibold text-gray-800 text-lg mb-2">Track Your Payments</h3>
      <p className="text-sm text-gray-600 mb-3">Keep track of past payments, due dates, and receipts.</p>
      <Link to="/signup" className="text-yellow-600 font-semibold text-sm hover:underline">
        GET STARTED →
      </Link>
    </div>

    {/* Card 3 */}
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 w-full sm:w-[300px] text-left">
      <FaShieldAlt className="text-yellow-500 text-3xl mb-4" />
      <h3 className="font-semibold text-gray-800 text-lg mb-2">Secure Transactions</h3>
      <p className="text-sm text-gray-600 mb-3">Your data is protected with the highest security standards.</p>
      <Link to="/signup" className="text-yellow-600 font-semibold text-sm hover:underline">
        GET STARTED →
      </Link>
    </div>
  </div>
</section>


      {/* Why Choose Us */}
      <section className="py-16 text-center">
  <h2 className="text-3xl font-semibold mb-3">Why Choose Us?</h2>
  <div className="w-24 h-1 bg-yellow-400 mx-auto mb-12 rounded-full"></div>

  <div className="flex justify-center gap-16 flex-wrap px-6">
    {/* Card 1 */}
    <div className="max-w-xs text-left">
      <img src={quickImg} alt="Quick" className="w-full h-48 object-cover rounded-md mb-4" />
      <h3 className="text-lg font-semibold mb-1">Quick and Convenient</h3>
      <p className="text-yellow-600 font-medium text-sm">SEE UNIVERSITY →</p>
    </div>

    {/* Card 2 */}
    <div className="max-w-xs text-left">
      <img src={transparentImg} alt="Transparency" className="w-full h-48 object-cover rounded-md mb-4" />
      <h3 className="text-lg font-semibold mb-1">Transparency</h3>
      <p className="text-yellow-600 font-medium text-sm">SEE UNIVERSITY →</p>
    </div>

    {/* Card 3 */}
    <div className="max-w-xs text-left">
      <img src={confirmImg} alt="Confirmation" className="w-full h-48 object-cover rounded-md mb-4" />
      <h3 className="text-lg font-semibold mb-1">Instant Confirmation</h3>
      <p className="text-yellow-600 font-medium text-sm">SEE UNIVERSITY →</p>
    </div>
  </div>

  <div className="mt-10">
    <button className="border border-yellow-500 text-yellow-500 px-6 py-2 rounded font-medium hover:bg-yellow-500 hover:text-white transition">
      SEE ALL →
    </button>
  </div>
</section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 bg-white">
  <h2 className="text-2xl font-semibold text-center mb-12">Connect with Us</h2>

  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch gap-10">
    {/* Left Gradient Text Block */}
    <div className="bg-gradient-to-br from-pink-400 to-yellow-400 flex items-center justify-center rounded-2xl w-full md:w-1/2 shadow-lg">
      <div className="text-white text-3xl md:text-4xl font-extrabold text-center leading-snug p-10">
        No<br />
        fees.<br />
        Not even<br />
        hidden ones.
      </div>
    </div>

    {/* Right Form Block */}
    <form className="bg-gradient-to-br from-pink-400 to-yellow-400 p-1 rounded-2xl w-full md:w-1/2 shadow-lg">
      <div className="bg-white p-6 md:p-8 rounded-xl h-full flex flex-col justify-center space-y-4">
        <input type="text" placeholder="Name" className="w-full border border-gray-300 p-3 rounded text-sm" />
        <input type="text" placeholder="Surname" className="w-full border border-gray-300 p-3 rounded text-sm" />
        <input type="email" placeholder="Email" className="w-full border border-gray-300 p-3 rounded text-sm" />
        <textarea placeholder="Message" className="w-full border border-gray-300 p-3 rounded h-28 text-sm" />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800 transition">
          Submit
        </button>
      </div>
    </form>
  </div>

  <div className="mt-10 text-center">
    <button className="border border-yellow-500 text-yellow-500 px-6 py-2 rounded font-medium hover:bg-yellow-500 hover:text-white transition">
      See more →
    </button>
  </div>
</section>



      {/* Support Section */}
      <section className="py-16 bg-white">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 px-4">
    {/* Left Image */}
    <div className="w-full md:w-1/2">
      <img
        src={supportImg}
        alt="Support"
        className="w-full h-full object-cover rounded-md shadow"
      />
    </div>

    {/* Right Content */}
    <div className="w-full md:w-1/2">
      <h3 className="text-2xl font-semibold mb-4">We’re here to help</h3>
      <p className="text-gray-700 mb-6">
        Read through our FAQs and, if you can’t find what you’re looking for, our experts will be happy to answer your questions.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <button className="bg-yellow-500 text-white px-5 py-2 rounded hover:bg-yellow-600 transition">
          READ FAQS
        </button>
        <button className="flex items-center gap-2 text-yellow-600 font-semibold border border-yellow-500 px-4 py-2 rounded hover:bg-yellow-100 transition">
          <FaRegEnvelope className="text-base" />
          ASK A QUESTION
        </button>
      </div>
    </div>
  </div>
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
}
