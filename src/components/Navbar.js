import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaBars, FaTimes } from 'react-icons/fa'; // Import the user icon
import logo from '../assets/logo.png';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeSection, setActiveSection] = useState('home');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    const handleScroll = () => {
      if (location.pathname !== '/') return; // Only update active section on home page

      const sections = ['home', 'pricing', 'about', 'faqs'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial active section
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <nav className="bg-gradient-to-r from-[#A5F3FC] to-[#FFE4E6] text-[#181F32] fixed top-0 left-0 right-0 z-50">
        <div className="w-11/12 mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo and brand name */}
            <div className="flex-shrink-0 flex items-center">
              <img src={logo} alt="NeXterChat API Logo" className="w-12 h-10 mr-2" />
              <span className="font-bold text-xl">NeXTerChat API</span>
            </div>
            
            {/* Desktop navigation links */}
            <div className="hidden md:flex items-center justify-center space-x-4">
              <NavLinks currentPath={location.pathname} activeSection={activeSection} mobile={false} />
            </div>
            
            {/* Desktop auth buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <AuthButtons user={user} handleLogout={handleLogout} />
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center justify-center p-2 rounded-md text-[#181F32] hover:text-[#A52259] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#A52259]"
              >
                <span className="sr-only">Open main menu</span>
                {isSidebarOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
          <div className="h-full flex flex-col py-6">
            <div className="px-4 flex items-center justify-between">
              <div className="flex-shrink-0">
                <img src={logo} alt="NeXterChat API Logo" className="h-8 w-auto" />
              </div>
              <button
                onClick={toggleSidebar}
                className="ml-4 inline-flex items-center justify-center p-2 rounded-full bg-white text-[#181F32] hover:text-[#A52259] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#A52259]"
              >
                <span className="sr-only">Close menu</span>
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-5 flex-1 px-2 space-y-1">
              <NavLinks mobile toggleSidebar={toggleSidebar} currentPath={location.pathname} activeSection={activeSection} />
              <div className="pt-4 border-t border-gray-200">
                <AuthButtons user={user} handleLogout={handleLogout} mobile toggleSidebar={toggleSidebar} />
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-16"></div> {/* Spacer */}
    </>
  );
};

const NavLinks = ({ mobile, toggleSidebar, currentPath, activeSection }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const links = [
    { to: "/", label: "Home", section: "home" },
    { to: "/pricing", label: "Pricing", section: "pricing" },
    { to: "/about", label: "About Us", section: "about" },
    { to: "/faqs", label: "FAQs", section: "faqs" },
  ];

  // Add Dashboard link only for non-admin users
  if (user && !user.isAdmin) {
    links.push({ to: "/dashboard", label: "Dashboard", section: "dashboard" });
  }

  const linkClasses = (isActive, isMobile) => 
    `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
    ${isActive && !isMobile ? 'text-[#A52259] border-b-2 border-[#A52259]' : 'text-[#181F32] hover:text-[#A52259]'}`;

  const handleClick = (e, to, section) => {
    e.preventDefault();
    if (mobile) {
      toggleSidebar();
    }
    if (to === '/') {
      navigate(to);
      if (section !== 'home') {
        setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      navigate(to);
    }
  };

  return (
    <>
      {links.map((link) => {
        const isActive = currentPath === link.to || (currentPath === '/' && activeSection === link.section);
        return (
          <a
            key={link.to}
            href={link.to}
            className={linkClasses(isActive, mobile)}
            onClick={(e) => handleClick(e, link.to, link.section)}
          >
            {link.label}
          </a>
        );
      })}
    </>
  );
};

const AuthButtons = ({ user, handleLogout, mobile, toggleSidebar }) => {
  const buttonClasses = "text-center px-3 py-1.5 rounded-md text-sm font-medium";
  const primaryButtonClasses = `${buttonClasses} bg-[#A52259] text-white hover:bg-[#8E1C4A]`;
  const secondaryButtonClasses = `${buttonClasses} bg-[#D3BC48] text-[#181F32] hover:bg-[#B9A53E]`;

  if (user) {
    return (
      <div className={`${mobile ? 'space-y-2' : 'flex space-x-2'}`}>
        {user.isAdmin ? (
          <Link to="/admin/dashboard" className={primaryButtonClasses} onClick={mobile ? toggleSidebar : undefined}>
            Admin Dashboard
          </Link>
        ) : (
          <Link to="/dashboard" className={primaryButtonClasses} onClick={mobile ? toggleSidebar : undefined}>
            <FaUser className="inline mr-1" />Dashboard
          </Link>
        )}
        <button onClick={handleLogout} className={secondaryButtonClasses}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link 
      to="/signup" 
      className={primaryButtonClasses}
      onClick={mobile ? toggleSidebar : undefined}
    >
      Sign Up
    </Link>
  );
};

export default Navbar;
