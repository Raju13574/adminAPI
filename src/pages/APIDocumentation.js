import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaBook, FaKey, FaExclamationTriangle } from 'react-icons/fa';

const APIDocumentation = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaBook /> },
    { id: 'authentication', label: 'Authentication', icon: <FaKey /> },
    { id: 'endpoints', label: 'Endpoints', icon: <FaCode /> },
    { id: 'errors', label: 'Error Handling', icon: <FaExclamationTriangle /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">API Overview</h2>
            <p className="mb-4">
              The NeXterChat Compiler API allows you to compile and execute code in various programming languages.
              Our RESTful API endpoints accept code submissions and return compilation results and execution output.
            </p>
            <h3 className="text-xl font-bold mb-2">Base URL</h3>
            <code className="bg-gray-100 p-2 rounded block mb-4">
              https://api.nexterchat.com/v1
            </code>
            <h3 className="text-xl font-bold mb-2">Supported Languages</h3>
            <ul className="list-disc list-inside mb-4">
              <li>Python</li>
              <li>JavaScript</li>
              <li>Java</li>
              <li>C++</li>
              <li>Ruby</li>
            </ul>
          </div>
        );
      case 'authentication':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Authentication</h2>
            <p className="mb-4">
              All API requests must be authenticated using an API key. Include your API key in the header of each request:
            </p>
            <code className="bg-gray-100 p-2 rounded block mb-4">
              Authorization: Bearer YOUR_API_KEY
            </code>
            <p className="mb-4">
              To obtain an API key, please sign up for an account and visit your dashboard.
            </p>
          </div>
        );
      case 'endpoints':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">API Endpoints</h2>
            <h3 className="text-xl font-bold mb-2">Compile and Execute Code</h3>
            <code className="bg-gray-100 p-2 rounded block mb-4">
              POST /compile
            </code>
            <p className="mb-4">Request Body:</p>
            <pre className="bg-gray-100 p-2 rounded block mb-4">
{`{
  "language": "python",
  "code": "print('Hello, World!')",
  "input": "" // optional
}`}
            </pre>
            <p className="mb-4">Response:</p>
            <pre className="bg-gray-100 p-2 rounded block mb-4">
{`{
  "output": "Hello, World!",
  "errors": null,
  "executionTime": 0.005
}`}
            </pre>
          </div>
        );
      case 'errors':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Error Handling</h2>
            <p className="mb-4">
              The API uses conventional HTTP response codes to indicate the success or failure of an API request.
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>2xx: Success</li>
              <li>4xx: Client errors</li>
              <li>5xx: Server errors</li>
            </ul>
            <p className="mb-4">Error Response Format:</p>
            <pre className="bg-gray-100 p-2 rounded block mb-4">
{`{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid or cannot be served."
  }
}`}
            </pre>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <motion.h1 
        className="text-4xl font-bold text-center text-indigo-800 mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        API Documentation
      </motion.h1>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center mr-4 px-4 py-2 rounded-full ${
                activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default APIDocumentation;
