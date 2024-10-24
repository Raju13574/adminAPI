import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare } from 'react-feather';
import contactImage from '../assets/contact.jpg';
import API from '../api/config';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await API.post('/contact', { name, email, message });
      setSubmitStatus({ 
        type: 'success', 
        message: response.data.message || 'Thank you for your message! We will get back to you soon.' 
      });
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'An error occurred while processing your request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 min-h-screen flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300"></div>
        
        <motion.div 
          className="w-full lg:w-1/2 p-4 lg:p-6 flex flex-col justify-center items-start"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-[#4338CA] mb-2">Let's Connect</h2>
          <p className="text-gray-600 mb-4 text-xs lg:text-sm">We're excited to hear from you! Fill out the form and we'll be in touch soon.</p>
          <img 
            src={contactImage}
            alt="Contact illustration" 
            className="w-full h-auto object-contain rounded-lg shadow-md"
          />
        </motion.div>

        <motion.div 
          className="w-full lg:w-1/2 bg-[#F3F4F6] p-4 lg:p-6 flex flex-col justify-center items-center relative overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-sm relative z-10">
            <Input icon={<User size={16} />} placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input icon={<Mail size={16} />} placeholder="Your Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="relative">
              <MessageSquare className="absolute top-2 left-2 text-[#4338CA]" size={16} />
              <textarea
                className="w-full pl-8 pr-2 py-2 rounded-lg bg-white border border-[#4338CA] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] text-gray-700 transition duration-300 resize-none text-sm"
                placeholder="Your Message"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <motion.button
              className="w-full bg-[#4338CA] hover:bg-[#3730A3] text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center text-sm"
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="animate-spin mr-2">&#9696;</span>
              ) : (
                <Send size={16} className="mr-2" />
              )}
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
          </form>
          
          {submitStatus && (
            <motion.div 
              className={`mt-3 p-2 rounded-lg text-xs w-full max-w-sm ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {submitStatus.message}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

const Input = ({ icon, placeholder, type = 'text', value, onChange }) => (
  <div className="relative">
    <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-[#4338CA]">
      {icon}
    </div>
    <input
      className="w-full pl-8 pr-2 py-2 rounded-lg bg-white border border-[#4338CA] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] text-gray-700 transition duration-300 text-sm"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export default Contact;
