import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion
import uniImage from '../assets/uni.jpg';
import { FaSearch, FaCalendarAlt, FaShieldAlt, FaArrowUp } from 'react-icons/fa';
import featuresBg from '../assets/features.jpg';
import quickImg from '../assets/quick.jpg';
import transparentImg from '../assets/transparency.jpg';
import confirmImg from '../assets/confirmation.jpg';
import supportImg from '../assets/support.jpg';
import { FaRegEnvelope, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import Navbar from './Navbar';

// Testimonial data (new feature)
const testimonials = [
  {
    name: 'Aayushree Shrestha',
    role: 'Student, TU',
    quote: 'FeeStream made paying my tuition so easy! I love the instant confirmation and secure process.',
    image: 'https://via.placeholder.com/100', // Replace with actual image
  },
  {
    name: 'Tenzing Sherpa',
    role: 'Student, KU',
    quote: 'Tracking my payments has never been this simple. Highly recommend FeeStream!',
    image: 'https://via.placeholder.com/100', // Replace with actual image
  },
  {
    name: 'Priya Shrestha',
    role: 'Admin, PU',
    quote: 'Managing student payments is now a breeze with FeeStream. Great support team!',
    image: 'https://via.placeholder.com/100', // Replace with actual image
  },
];

export default function HomePage() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Handle Back to Top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Parallax and Fade-In Animation */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative h-[70vh] bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${uniImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent flex flex-col justify-center items-center text-white text-center px-4">
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-5xl font-extrabold leading-tight mb-3"
          >
            Safest Online <span className="text-yellow-400">Fee Payment</span> App!
          </motion.h1>
        </div>
      </motion.section>

      <div className="text-center px-6 py-10 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg text-gray-700 mb-4"
        >
          Find the easiest and the safest fee payment app for universities in Nepal.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base text-gray-600 mb-8"
        >
          A simple and secure way to manage your university fees online. Save time, avoid queues, and stay on top of your payment deadlines with ease.
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/signup">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded shadow-lg">
              Get Started
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Features Icons with Slide-In Animation */}
      <section
        className="py-16 bg-gradient-to-r from-gray-100 to-gray-200 text-center"
        style={{ backgroundImage: `url(${featuresBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-semibold mb-10"
        >
          What We Offer
        </motion.h2>
        <div className="flex justify-center gap-8 flex-wrap px-4">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform w-full sm:w-[300px] text-left"
          >
            <FaSearch className="text-yellow-500 text-3xl mb-4" />
            <h3 className="font-semibold text-gray-800 text-lg mb-2">Seamless Payment Process</h3>
            <p className="text-sm text-gray-600 mb-3">Pay your tuition and other fees in just a few clicks.</p>
            <Link to="/signup" className="text-yellow-600 font-semibold text-sm hover:underline">
              GET STARTED →
            </Link>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform w-full sm:w-[300px] text-left"
          >
            <FaCalendarAlt className="text-yellow-500 text-3xl mb-4" />
            <h3 className="font-semibold text-gray-800 text-lg mb-2">Track Your Payments</h3>
            <p className="text-sm text-gray-600 mb-3">Keep track of past payments, due dates, and receipts.</p>
            <Link to="/signup" className="text-yellow-600 font-semibold text-sm hover:underline">
              GET STARTED →
            </Link>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform w-full sm:w-[300px] text-left"
          >
            <FaShieldAlt className="text-yellow-500 text-3xl mb-4" />
            <h3 className="font-semibold text-gray-800 text-lg mb-2">Secure Transactions</h3>
            <p className="text-sm text-gray-600 mb-3">Your data is protected with the highest security standards.</p>
            <Link to="/signup" className="text-yellow-600 font-semibold text-sm hover:underline">
              GET STARTED →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us with Carousel Effect */}
      <section className="py-16 text-center bg-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-semibold mb-3"
        >
          Why Choose Us?
        </motion.h2>
        <div className="w-24 h-1 bg-yellow-400 mx-auto mb-12 rounded-full"></div>

        <div className="flex justify-center gap-16 flex-wrap px-6">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="max-w-xs text-left"
          >
            <img src={quickImg} alt="Quick" className="w-full h-48 object-cover rounded-md mb-4 shadow-md" />
            <h3 className="text-lg font-semibold mb-1">Quick and Convenient</h3>
            <p className="text-yellow-600 font-medium text-sm">SEE UNIVERSITY →</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="max-w-xs text-left"
          >
            <img src={transparentImg} alt="Transparency" className="w-full h-48 object-cover rounded-md mb-4 shadow-md" />
            <h3 className="text-lg font-semibold mb-1">Transparency</h3>
            <p className="text-yellow-600 font-medium text-sm">SEE UNIVERSITY →</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="max-w-xs text-left"
          >
            <img src={confirmImg} alt="Confirmation" className="w-full h-48 object-cover rounded-md mb-4 shadow-md" />
            <h3 className="text-lg font-semibold mb-1">Instant Confirmation</h3>
            <p className="text-yellow-600 font-medium text-sm">SEE UNIVERSITY →</p>
          </motion.div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10"
        >
          <button className="border border-yellow-500 text-yellow-500 px-6 py-2 rounded font-medium hover:bg-yellow-500 hover:text-white transition">
            SEE ALL →
          </button>
        </motion.div>
      </section>

      {/* Testimonial Slider (New Feature) */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-semibold mb-10"
        >
          What Our Users Say
        </motion.h2>
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4"
            >
              <img
                src={testimonials[currentTestimonial].image}
                alt={testimonials[currentTestimonial].name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="text-gray-600 italic mb-2">"{testimonials[currentTestimonial].quote}"</p>
                <p className="text-sm font-semibold text-gray-800">{testimonials[currentTestimonial].name}</p>
                <p className="text-xs text-gray-500">{testimonials[currentTestimonial].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentTestimonial ? 'bg-yellow-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 bg-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-2xl font-semibold text-center mb-12"
        >
          Connect with Us
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch gap-10"
        >
          {/* Left Gradient Text Block */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-pink-400 to-yellow-400 flex items-center justify-center rounded-2xl w-full md:w-1/2 shadow-lg"
          >
            <div className="text-white text-3xl md:text-4xl font-extrabold text-center leading-snug p-10">
              No<br />
              fees.<br />
              Not even<br />
              hidden ones.
            </div>
          </motion.div>

          {/* Right Form Block */}
          <form className="bg-gradient-to-br from-pink-400 to-yellow-400 p-1 rounded-2xl w-full md:w-1/2 shadow-lg">
            <div className="bg-white p-6 md:p-8 rounded-xl h-full flex flex-col justify-center space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-gray-300 p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                placeholder="Surname"
                className="w-full border border-gray-300 p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <textarea
                placeholder="Message"
                className="w-full border border-gray-300 p-3 rounded h-28 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800 transition"
              >
                Submit
              </motion.button>
            </div>
          </form>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 text-center"
        >
          <button className="border border-yellow-500 text-yellow-500 px-6 py-2 rounded font-medium hover:bg-yellow-500 hover:text-white transition">
            See more →
          </button>
        </motion.div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 px-4"
        >
          {/* Left Image */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="w-full md:w-1/2"
          >
            <img
              src={supportImg}
              alt="Support"
              className="w-full h-full object-cover rounded-md shadow"
            />
          </motion.div>

          {/* Right Content */}
          <div className="w-full md:w-1/2">
            <motion.h3
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl font-semibold mb-4"
            >
              We’re here to help
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-700 mb-6"
            >
              Read through our FAQs and, if you can’t find what you’re looking for, our experts will be happy to answer your questions.
            </motion.p>
            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-500 text-white px-5 py-2 rounded hover:bg-yellow-600 transition"
              >
                READ FAQS
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-yellow-600 font-semibold border border-yellow-500 px-4 py-2 rounded hover:bg-yellow-100 transition"
              >
                <FaRegEnvelope className="text-base" />
                ASK A QUESTION
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2d2e3d] text-white pt-16 pb-8 px-6 text-center">
        <motion.h4
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-2xl font-semibold mb-3"
        >
          Subscribe to our newsletter
        </motion.h4>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-300 max-w-xl mx-auto mb-6 text-sm"
        >
          Get expert advice for your journey to university delivered to your inbox each month. It's short, and worthwhile – we promise!
        </motion.p>

        {/* Email input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto flex flex-col items-start sm:flex-row sm:items-center gap-4 mb-4"
        >
          <input
            type="email"
            placeholder="Email address"
            className="w-full sm:flex-1 px-4 py-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </motion.div>

        {/* Checkbox */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex items-start justify-center mb-6"
        >
          <label className="text-sm text-gray-300 flex items-start gap-2 max-w-md">
            <input type="checkbox" className="mt-1" />
            I confirm I am over 16 and I agree to the Terms and Conditions and Privacy Notice.
          </label>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-white transition mb-10"
        >
          SUBSCRIBE NOW
        </motion.button>

        <hr className="border-gray-600 mb-8" />

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center gap-6 mb-6 text-2xl"
        >
          <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
            <FaFacebookF className="hover:text-white" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
            <FaInstagram className="hover:text-white" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
            <FaTwitter className="hover:text-white" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
            <FaLinkedinIn className="hover:text-white" />
          </motion.div>
        </motion.div>

        {/* Footer links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 text-sm text-gray-300 mb-6"
        >
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Contact us</a>
          <a href="#" className="hover:underline">FAQs</a>
          <a href="#" className="hover:underline">Terms and conditions</a>
          <a href="#" className="hover:underline">Cookie policy</a>
          <a href="#" className="hover:underline">Privacy</a>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-sm text-gray-500"
        >
          © 2025 – FeeStream
        </motion.div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-yellow-500 text-white p-4 rounded-full shadow-lg hover:bg-yellow-600 transition"
        >
          <FaArrowUp />
        </motion.button>
      )}
    </div>
  );
}