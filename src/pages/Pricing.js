import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import API from '../api/config';
import { motion, AnimatePresence, useViewportScroll, useTransform } from 'framer-motion';

const planQuotes = {
  'free-plan': [
    "Start your journey with us!",
    "Try before you commit",
    "Perfect for beginners",
    "Explore our features risk-free",
    "Dip your toes in the water"
  ],
  'monthly-plan': [
    "Perfect for growing businesses",
    "Flexible month-to-month option",
    "Scale at your own pace",
    "Ideal for short-term projects",
    "Stay agile with monthly updates"
  ],
  'three-months-plan': [
    "Boost your productivity quarterly",
    "Commit to a season of growth",
    "Perfect for medium-term goals",
    "Optimize your workflow every quarter",
    "Accelerate your progress in 90 days"
  ],
  'six-months-plan': [
    "Commit to long-term success",
    "Unlock premium features for less",
    "Maximize your ROI over time",
    "Perfect for established businesses",
    "Achieve your goals with extended support"
  ],
  'yearly-plan': [
    "Maximize your savings and benefits",
    "Get the best value for your investment",
    "Enjoy a full year of premium features",
    "Perfect for long-term planning",
    "Unlock the full potential of our API"
  ]
};

const PlanBar = ({ plan, isActive, setActivePlan }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      const intervalId = setInterval(() => {
        setCurrentQuoteIndex((prevIndex) => 
          (prevIndex + 1) % planQuotes[plan.planId].length
        );
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [isActive, plan.planId]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/signup', { state: { redirectPlan: plan.planId } });
    } else {
      // Existing Razorpay integration logic
      // ...
    }
  };

  return (
    <motion.div 
      className={`bg-gradient-to-br from-teal-50 via-blue-50 to-white rounded-lg shadow-md overflow-hidden cursor-pointer ${isActive ? 'ring-2 ring-teal-500' : ''}`}
      whileHover={{ scale: 1.05 }}
      onClick={() => setActivePlan(plan.planId)}
    >
      <div className="p-4 h-80 flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-teal-600">{plan.name}</h3>
        <div className="mb-2">
          <span className="text-3xl font-bold text-gray-800">₹{plan.price.toLocaleString('en-IN')}</span>
          <span className="text-gray-500">/{plan.duration}</span>
        </div>
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-grow flex flex-col justify-between"
            >
              <div>
                <p className="text-gray-600 mb-4">{plan.credits}</p>
                <ul className="mb-4 text-sm text-gray-600">
                  <li className="flex items-center mb-2">
                    <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {plan.price === 0 ? 'Basic support' : 'Priority support'}
                  </li>
                  <li className="flex items-center mb-2">
                    <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {plan.price === 0 ? 'Basic features' : 'Advanced features'}
                  </li>
                </ul>
              </div>
              <button 
                onClick={handleClick}
                className="w-full bg-teal-500 text-white py-2 rounded-md font-semibold hover:bg-teal-600 transition duration-300"
              >
                {plan.ctaText}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="inactive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-grow flex items-center justify-center"
            >
              <p className="text-gray-600 italic text-center">
                {planQuotes[plan.planId][currentQuoteIndex]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Pricing = () => {
  const [activePlan, setActivePlan] = useState('monthly-plan');
  const { scrollY } = useViewportScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  const pricingPlans = [
    { name: 'Free Plan', price: 0, credits: '50 credits/day', duration: 'forever', ctaText: 'Start for free', planId: 'free-plan' },
    { name: 'Monthly', price: 419, credits: '45,000 credits/month', duration: 'month', ctaText: 'Get Monthly', planId: 'monthly-plan' },
    { name: '3 Months', price: 1092, credits: '2,000 credits/day', duration: 'quarter', ctaText: 'Get 3M Plan', planId: 'three-months-plan' },
    { name: '6 Months', price: 1680, credits: '3,000 credits/day', duration: '6 months', ctaText: 'Get 6M Plan', planId: 'six-months-plan' },
    { name: 'Yearly', price: 3025, credits: 'Unlimited credits', duration: 'year', ctaText: 'Get Yearly Plan', planId: 'yearly-plan' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.5
      }
    }
  };

  const planVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.5
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-100 to-blue-200">
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: y1, scale: 1.1 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-teal-200 to-blue-300 opacity-50" />
      </motion.div>
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: y2, scale: 1.1 }}
      >
        <div className="w-full h-full bg-gradient-to-tl from-blue-200 to-teal-300 opacity-50" />
      </motion.div>
      <motion.div 
        className="relative z-10 py-16 px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h1 
            className="text-4xl font-bold text-center mb-4 text-gray-800"
            variants={headerVariants}
          >
            Discover Our API Plans and Pricing
          </motion.h1>
          <motion.p 
            className="text-xl text-center text-gray-600 mb-12"
            variants={headerVariants}
          >
            Select the perfect plan for your needs
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div 
                key={plan.planId} 
                variants={planVariants}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 }
                }}
              >
                <PlanBar
                  plan={plan}
                  isActive={activePlan === plan.planId}
                  setActivePlan={setActivePlan}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Pricing;
