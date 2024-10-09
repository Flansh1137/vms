import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Replace with the correct path to your logo
import { Button, Box } from '@mui/material';

function NavBar() {
  const handleLogin = () => {
    window.open('/login-options', '_blank'); // Opens the login-options page in a new tab
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center flex-shrink-0">
            {/* Logo */}
            <a href="/">
              <img className="block lg:hidden h-8 w-auto" src={logo} alt="Logo" />
              <img className="hidden lg:block h-12 w-auto" src={logo} alt="Logo" />
            </a>
          </div>

          <div className="hidden sm:block sm:ml-6">
            <div className="flex space-x-4">
              {/* Links */}
              <Link
                to="/services"
                className="text-blue-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-300"
              >
                Services
              </Link>
              <Link
                to="/industry"
                className="text-blue-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-300"
              >
                Industry
              </Link>
              <Link
                to="/testimonials"
                className="text-blue-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-300"
              >
                Testimonials
              </Link>
              <Link
                to="/about"
                className="text-blue-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-300"
              >
                About
              </Link>
              <Link
                to="/blog"
                className="text-blue-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-300"
              >
                Blog
              </Link>
              <Link
                to="/contact"
                className="text-blue-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-300"
              >
                Contact
              </Link>
              <Link
                to="/partners"
                className="text-blue-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-300"
              >
                Partners
              </Link>
              <Link
                to="/book-meeting"
                className="text-blue-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-300"
              >
                Book a Meeting
              </Link>
              {/* Login Button */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                className="bg-blue-900 text-white px-3 py-2 rounded-md text-sm font-medium transform hover:scale-105 transition-transform duration-300"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
