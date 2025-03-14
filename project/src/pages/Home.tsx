import { Link } from 'react-router-dom';
import { Users, Briefcase, Calendar, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Cursor styles
const cursorStyles = `
  .cursor-tracker {
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(79, 70, 229, 0.3); /* indigo-600 with opacity */
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease-out;
  }
  
  .cursor-tracker.hover {
    transform: scale(1.5);
    background: rgba(79, 70, 229, 0.5);
  }
`;

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [logoutMessage, setLogoutMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [, setIsHovering] = useState(false);

  useEffect(() => {
    // Cursor tracker setup
    const styleSheet = document.createElement('style');
    styleSheet.textContent = cursorStyles;
    document.head.appendChild(styleSheet);

    const cursor = document.createElement('div');
    cursor.classList.add('cursor-tracker');
    document.body.appendChild(cursor);

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX - 10}px`;
      cursor.style.top = `${e.clientY - 10}px`;
    };

    const handleMouseEnter = () => {
      cursor.classList.add('hover');
      setIsHovering(true);
    };
    
    const handleMouseLeave = () => {
      cursor.classList.remove('hover');
      setIsHovering(false);
    };

    window.addEventListener('mousemove', moveCursor);

    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    // Authentication check
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") || " ";
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    }

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
      document.body.removeChild(cursor);
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleLogout = () => {
    setIsLoading(true); // Start loading
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole('');
    setLogoutMessage('Logout successful');

    setTimeout(() => {
      setLogoutMessage('');
      setIsLoading(false); // Stop loading
    }, 3000);
  };

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Alumni Network',
      description: 'Connect with fellow alumni and build meaningful professional relationships.',
      link: '/alumni',
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: 'Job Opportunities',
      description: 'Explore career opportunities or post jobs for fellow alumni.',
      link: '/jobs',
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Events & Reunions',
      description: 'Stay updated with upcoming events and alumni gatherings.',
      link: '/events',
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Give Back',
      description: 'Support your alma mater through donations and mentorship.',
      link: '/donate',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <div className="relative">
          <img
            className="w-full h-[500px] object-cover"
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
            alt="University campus"
          />
          <motion.div
            className="absolute inset-0 bg-indigo-700 mix-blend-multiply"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <motion.h1
              className="text-5xl font-extrabold text-white sm:text-6xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Welcome to Alumni Connect
            </motion.h1>
            <motion.p
              className="mt-6 text-xl text-indigo-100 max-w-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Join our vibrant community of graduates, stay connected, and unlock opportunities for
              growth and collaboration.
            </motion.p>

            {/* Profile Icon (Only for Alumni) */}
            {isLoggedIn && userRole === 'alumni' && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="mt-8"
              >
                <Link to="/profile">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="text-white hover:text-indigo-300"
                  >
                    <User className="h-8 w-8" />
                  </motion.div>
                </Link>
              </motion.div>
            )}

            {/* Login/Logout Button */}
            {!isLoggedIn ? (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="mt-8"
              >
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="mt-8"
              >
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isLoading
                      ? 'cursor-not-allowed opacity-70'
                      : 'hover:bg-indigo-700 hover:text-white'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Logging out...
                    </>
                  ) : (
                    'Logout'
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Centered Logout Message */}
        {logoutMessage && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg text-center">
              🎉 {logoutMessage} 🎉
            </div>
          </motion.div>
        )}

        {/* Features Section */}
        <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={feature.link} className="flex flex-col items-center text-center">
                  <div className="text-indigo-600 mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}