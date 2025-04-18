import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaArrowUp, FaChevronDown } from 'react-icons/fa';
import Navbar from './Navbar';

const Contact = () => {
  // State for FAQ toggles
  const [faqOpen, setFaqOpen] = useState(null);

  // State for "Go to Top" button visibility
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Show/hide "Go to Top" button based on scroll position
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

  // Animation for form fields
  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: i * 0.2, ease: 'easeOut' },
    }),
  };

  // FAQ data
  const faqs = [
    {
      question: "How can I pay my university fees?",
      answer: "You can pay your fees through FeeStream using eSewa, Khalti, or other secure payment methods. Simply log in, select your fees, and follow the payment process.",
    },
    {
      question: "What should I do if my payment fails?",
      answer: "If your payment fails, check your internet connection and payment method details. If the issue persists, contact our support team at support@feestream.com.",
    },
    {
      question: "Can universities track payments?",
      answer: "Yes, universities can track all payments through their admin dashboard on FeeStream, ensuring transparency and real-time updates.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero Section with Contact Form */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="py-20 px-6 text-center"
      >
        <h1 className="text-5xl font-bold mb-6 text-gray-800 tracking-tight">Contact Us</h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12">
          Have questions or need support? Reach out to us, and we’ll get back to you as soon as possible.
        </p>
        <form className="max-w-lg mx-auto space-y-5 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <motion.input
            custom={0}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            type="text"
            placeholder="Name"
            className="w-full border border-gray-300 p-4 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors duration-300"
          />
          <motion.input
            custom={1}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-4 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors duration-300"
          />
          <motion.textarea
            custom={2}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            placeholder="Your Message"
            className="w-full border border-gray-300 p-4 rounded-lg h-40 text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors duration-300"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-300 shadow-md"
          >
            Send Message
          </motion.button>
        </form>
      </motion.section>

      {/* Contact Information Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-6 bg-white text-center"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Get in Touch</h2>
          <div className="w-20 h-1 bg-yellow-500 mb-12 mx-auto rounded-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.03, y: -5, transition: { type: 'spring', stiffness: 300 } }}
              className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow-lg border border-gray-100"
            >
              <FaPhone className="text-yellow-500 text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Phone</h3>
              <p className="text-gray-600">+977 1-2345678</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03, y: -5, transition: { type: 'spring', stiffness: 300 } }}
              className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow-lg border border-gray-100"
            >
              <FaEnvelope className="text-yellow-500 text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Email</h3>
              <p className="text-gray-600">support@feestream.com</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03, y: -5, transition: { type: 'spring', stiffness: 300 } }}
              className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow-lg border border-gray-100"
            >
              <FaMapMarkerAlt className="text-yellow-500 text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Address</h3>
              <p className="text-gray-600">Kathmandu, Nepal</p>
            </motion.div>
          </div>
          <div className="flex justify-center gap-6 mt-12 text-3xl">
            <motion.a whileHover={{ scale: 1.2, color: '#fbbf24' }} href="#"><FaFacebookF className="text-gray-800" /></motion.a>
            <motion.a whileHover={{ scale: 1.2, color: '#fbbf24' }} href="#"><FaInstagram className="text-gray-800" /></motion.a>
            <motion.a whileHover={{ scale: 1.2, color: '#fbbf24' }} href="#"><FaTwitter className="text-gray-800" /></motion.a>
            <motion.a whileHover={{ scale: 1.2, color: '#fbbf24' }} href="#"><FaLinkedinIn className="text-gray-800" /></motion.a>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-6 bg-gray-100 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
          <div className="w-20 h-1 bg-yellow-500 mb-12 mx-auto rounded-full"></div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  className="w-full flex justify-between items-center p-6 text-left text-lg font-semibold text-gray-800 hover:bg-gray-50 transition-colors duration-300"
                >
                  <span>{faq.question}</span>
                  <motion.div
                    animate={{ rotate: faqOpen === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown className="text-yellow-500" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {faqOpen === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-gray-600"
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Location Map Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-6 bg-white text-center"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Our Location</h2>
          <div className="w-20 h-1 bg-yellow-500 mb-12 mx-auto rounded-full"></div>
          <div className="relative h-96 bg-gray-200 rounded-xl shadow-lg overflow-hidden">
            {/* Placeholder for map (replace with real map using Google Maps API if needed) */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <p className="text-xl">Map Placeholder - Kathmandu, Nepal</p>
            </div>
          </div>
        </div>
      </motion.section>

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

export default Contact;