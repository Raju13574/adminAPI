import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      className={`mb-6 ${index % 2 === 0 ? 'lg:mr-4' : 'lg:ml-4'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <button
        className="flex justify-between items-center w-full text-left p-6 bg-white rounded-t-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl font-bold" style={{ color: '#694F8E' }}>{question}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-6 h-6"
          style={{ color: '#694F8E' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 rounded-b-2xl shadow-md"
            style={{ backgroundColor: 'rgba(105, 79, 142, 0.1)' }}
          >
            <p className="text-gray-700 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQs = () => {
  const faqData = [
    {
      question: "What is NeXterChat API?",
      answer: "NeXterChat API is a powerful compiler API service that provides developers with tools for code execution, optimization, and analysis across multiple programming languages."
    },
    {
      question: "Which programming languages does NeXterChat API support?",
      answer: "NeXterChat API supports a wide range of popular programming languages including but not limited to Python, JavaScript, Java, C++, and Ruby. We're constantly adding support for more languages."
    },
    {
      question: "How can I get started with NeXterChat API?",
      answer: "You can get started by signing up for a free account on our website. Once registered, you'll receive an API key that you can use to make requests to our service."
    },
    {
      question: "What are the pricing options for NeXterChat API?",
      answer: "We offer flexible pricing tiers based on usage, including a free tier for small projects and hobbyists. For detailed pricing information, please visit our Pricing page."
    },
    {
      question: "Is NeXterChat API secure?",
      answer: "Yes, security is our top priority. We use industry-standard encryption for all API calls and implement strict sandboxing for code execution to ensure the safety and privacy of your code."
    },
    {
      question: "Can I use NeXterChat API for commercial projects?",
      answer: "Absolutely! Our service is designed to scale from personal projects to enterprise-level applications. We offer business plans with additional features and support for commercial use."
    },
    {
      question: "Do you offer custom solutions or integrations?",
      answer: "Yes, we provide custom solutions and integrations for businesses with specific needs. Please contact our sales team for more information on tailored services."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We offer comprehensive documentation, code samples, and community forums for all users. Paid plans include email support, and our enterprise plans come with dedicated account managers and priority support."
    },
    {
      question: "How does NeXterChat API handle rate limiting?",
      answer: "Rate limits vary by plan. We provide clear documentation on rate limits for each tier and offer options to increase these limits for high-volume users."
    },
    {
      question: "Can I test NeXterChat API before committing to a paid plan?",
      answer: "Yes, we offer a free tier that allows you to explore our API's capabilities. Additionally, we provide a sandbox environment for testing and development purposes."
    }
  ];

  return (
    <div className="bg-gradient-to-br from-teal-100 to-blue-200 min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          Find answers to common questions about NeXterChat API and discover how we can help power your communication needs.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-xl text-gray-700 mb-6">Still have questions?</p>
          <a 
            href="/contact" 
            className="inline-block bg-teal-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-teal-600 transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
