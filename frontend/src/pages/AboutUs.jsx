import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import aboutus from '../assets/about.jpg';
import featuresabout from '../assets/features.jpg';
import { FaRegEnvelope, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaHome, FaBolt, FaHeadset, FaFileAlt, FaShieldAlt, FaArrowUp } from 'react-icons/fa';
import Navbar from './Navbar';

const AboutUs = () => {
  // State to manage visibility of the "Go to Top" button
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Show/hide the button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll to the top
  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  // Animation for cards
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    hover: { scale: 1.03, y: -5, transition: { type: 'spring', stiffness: 300 } },
  };

  return (
    <div className="text-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-cover bg-center bg-no-repeat py-32 text-center text-white"
        style={{ backgroundImage: `url(${aboutus})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
          >
            About FeeStream
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto text-xl md:text-2xl"
          >
            Simplifying fee payments for universities and students across Nepal.
          </motion.p>
        </div>
      </motion.section>

      {/* Our Mission and Vision */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 text-center"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Our Vision & Mission</h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-10 rounded-full"></div>
          <div className="grid md:grid-cols-2 gap-10 text-left">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            >
              <h3 className="text-2xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
                🎯 Vision
              </h3>
              <p className="text-gray-600 text-lg">
                To be Nepal’s most trusted digital platform for secure and transparent university fee payments.
              </p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            >
              <h3 className="text-2xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
                🚀 Mission
              </h3>
              <p className="text-gray-600 text-lg">
                We aim to simplify the fee payment process for students, guardians, and institutions with a user-friendly, fast, and transparent system.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Why FeeStream */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-gray-100 py-20 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-2 text-center text-gray-800">Why FeeStream?</h2>
          <div className="w-20 h-1 bg-yellow-500 mb-12 mx-auto rounded-full"></div>
          <div className="flex flex-col md:flex-row items-stretch gap-12">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <div className="h-full bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center border border-gray-100">
                <p className="text-xl mb-6 text-gray-700 font-medium">
                  In Nepal, fee payment is often manual, time-consuming, and confusing. FeeStream was born to fix that.
                </p>
                <ul className="space-y-4 text-gray-800">
                  <li className="flex items-center gap-3">
                    <FaHome className="text-yellow-500 text-2xl" />
                    <span className="text-lg">Pay tuition, hostel, and exam fees from home</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaBolt className="text-yellow-500 text-2xl" />
                    <span className="text-lg">Real-time transaction confirmations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaHeadset className="text-yellow-500 text-2xl" />
                    <span className="text-lg">24/7 support for students and universities</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaFileAlt className="text-yellow-500 text-2xl" />
                    <span className="text-lg">Complete payment history & receipts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaShieldAlt className="text-yellow-500 text-2xl" />
                    <span className="text-lg">Secure with eSewa, Khalti & more</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 300 } }}
              className="w-full md:w-1/2"
            >
              <div className="h-full overflow-hidden rounded-xl shadow-lg border border-gray-100">
                <img
                  src={featuresabout}
                  alt="Why FeeStream"
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-6 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white text-center"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-6"
            >
              <h3 className="text-5xl font-bold mb-2">50K+</h3>
              <p className="text-lg">Students Served</p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-6"
            >
              <h3 className="text-5xl font-bold mb-2">10M+</h3>
              <p className="text-lg">Transactions Processed</p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-6"
            >
              <h3 className="text-5xl font-bold mb-2">100+</h3>
              <p className="text-lg">Partner Universities</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-6 bg-white text-center"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Meet Our Team</h2>
          <div className="w-20 h-1 bg-yellow-500 mb-12 mx-auto rounded-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="w-24 h-24 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                AK
              </div>
              <h3 className="text-xl font-semibold mb-2">Priya Shrestha</h3>
              <p className="text-gray-600">Founder & CEO</p>
              <p className="text-gray-500 mt-2 text-sm">
                Passionate about simplifying education payments with technology.
              </p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="w-24 h-24 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                SR
              </div>
              <h3 className="text-xl font-semibold mb-2">Tenzing Sherpa</h3>
              <p className="text-gray-600">CTO</p>
              <p className="text-gray-500 mt-2 text-sm">
                Expert in building secure and scalable payment systems.
              </p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="w-24 h-24 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                RP
              </div>
              <h3 className="text-xl font-semibold mb-2">Aayushree Dahal</h3>
              <p className="text-gray-600">Head of Support</p>
              <p className="text-gray-500 mt-2 text-sm">
                Dedicated to ensuring a seamless experience for all users.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-6 bg-gray-100 text-center"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">What Our Users Say</h2>
          <div className="w-20 h-1 bg-yellow-500 mb-12 mx-auto rounded-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <p className="text-gray-600 italic mb-4">
                "FeeStream made paying my university fees so easy! I no longer have to stand in long queues."
              </p>
              <h3 className="text-lg font-semibold text-gray-800">Riya Shrestha</h3>
              <p className="text-gray-500 text-sm">Student, Tribhuvan University</p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <p className="text-gray-600 italic mb-4">
                "Managing fee payments for our university has never been smoother. FeeStream is a game-changer!"
              </p>
              <h3 className="text-lg font-semibold text-gray-800">Pritu Kumar</h3>
              <p className="text-gray-500 text-sm">Admin, Kathmandu University</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Call To Action */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 text-center bg-white"
      >
        <h2 className="text-4xl font-bold mb-4 text-gray-800">Join Us on the Journey</h2>
        <p className="mb-6 text-gray-600 text-lg max-w-xl mx-auto">
          Whether you're a student or a university admin, FeeStream is built to serve you better.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/signup">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-colors duration-300">
              Get Started
            </button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-[#2d2e3d] text-white pt-16 pb-8 px-6 text-center"
      >
        <h4 className="text-3xl font-semibold mb-3">Subscribe to Our Newsletter</h4>
        <p className="text-gray-300 max-w-xl mx-auto mb-6 text-base">
          Get expert advice for your journey to university delivered to your inbox each month. It's short, and worthwhile – we promise!
        </p>
        <div className="max-w-xl mx-auto flex flex-col items-start sm:flex-row sm:items-center gap-4 mb-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full sm:flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            Subscribe
          </motion.button>
        </div>
        <div className="flex items-start justify-center mb-6">
          <label className="text-sm text-gray-300 flex items-start gap-2 max-w-md">
            <input type="checkbox" className="mt-1" />
            I confirm I am over 16 and I agree to the Terms and Conditions and Privacy Notice.
          </label>
        </div>
        <hr className="border-gray-600 mb-8" />
        <div className="flex justify-center gap-6 mb-6 text-2xl">
          <motion.a whileHover={{ scale: 1.2, color: '#fbbf24' }} href="#"><FaFacebookF /></motion.a>
          <motion.a whileHover={{ scale: 1.2, color: '#fbbf24' }} href="#"><FaInstagram /></motion.a>
          <motion.a whileHover={{ scale: 1.2, color: '#fbbf24' }} href="#"><FaTwitter /></motion.a>
          <motion.a whileHover={{ scale: 1.2, color: '#fbbf24' }} href="#"><FaLinkedinIn /></motion.a>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300 mb-6">
          <a href="#" className="hover:text-yellow-500 transition-colors duration-300">About</a>
          <a href="#" className="hover:text-yellow-500 transition-colors duration-300">Contact Us</a>
          <a href="#" className="hover:text-yellow-500 transition-colors duration-300">FAQs</a>
          <a href="#" className="hover:text-yellow-500 transition-colors duration-300">Terms and Conditions</a>
          <a href="#" className="hover:text-yellow-500 transition-colors duration-300">Cookie Policy</a>
          <a href="#" className="hover:text-yellow-500 transition-colors duration-300">Privacy</a>
        </div>
        <div className="text-sm text-gray-500">
          © 2025 – FeeStream
        </div>
      </motion.footer>

      {/* Go to Top Button */}
      {showTopBtn && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToTop}
          className="fixed bottom-8 right-8 bg-yellow-500 text-white p-4 rounded-full shadow-lg hover:bg-yellow-600 transition-colors duration-300 z-50"
        >
          <FaArrowUp className="text-xl" />
        </motion.button>
      )}
    </div>
  );
};

export default AboutUs;