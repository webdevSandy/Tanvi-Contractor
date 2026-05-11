import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // 1. Scrolled state for navbar styling
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Scrollspy logic to highlight active section
      if (isHomePage) {
        const sections = [
          { name: 'Home', id: 'home' },
          { name: 'Services', id: 'services' },
          { name: 'Partners', id: 'partners' },
          { name: 'About Us', id: 'about' },
          { name: 'Contact', id: 'contact' },
        ];

        const scrollPosition = window.scrollY + 150; // Offset for navbar height

        let currentActive = activeSection;
        for (const section of sections) {
          const element = document.getElementById(section.id);
          if (element) {
            const top = element.offsetTop;
            const height = element.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              currentActive = section.name;
            }
          }
        }
        
        // Ensure "Home" is selected if at the very top
        if (window.scrollY < 50) currentActive = 'Home';
        
        if (currentActive !== activeSection) {
          setActiveSection(currentActive);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage, activeSection]);

  // Handle active state on page load or route change
  useEffect(() => {
    if (!isHomePage) {
      if (location.pathname === '/about') setActiveSection('About Us');
      else if (location.pathname === '/contact') setActiveSection('Contact');
      else setActiveSection('');
    } else {
      // If we land on home page with a hash, e.g. /#services
      if (location.hash === '#services') setActiveSection('Services');
      else if (location.hash === '#partners') setActiveSection('Partners');
      else if (location.hash === '#about') setActiveSection('About Us');
      else if (location.hash === '#contact') setActiveSection('Contact');
      else if (!location.hash) setActiveSection('Home');
    }
  }, [location.pathname, location.hash, isHomePage]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'Partners', href: '/#partners' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const getLinkHref = (link) => {
    if (link.name === 'Home') return '/';
    if (link.name === 'Services') return isHomePage ? '#services' : '/#services';
    if (link.name === 'Partners') return isHomePage ? '#partners' : '/#partners';
    if (link.name === 'About Us') return isHomePage ? '#about' : '/#about';
    if (link.name === 'Contact') return isHomePage ? '#contact' : '/#contact';
    return link.href;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 bg-white shadow-md py-4 border-b border-gray-100 text-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-3xl font-bold tracking-wider flex items-center gap-1 group">
              <span className={`transition-colors duration-300 text-[#8B0000]`}>
                Tanvi
              </span>
              <span className={`transition-colors duration-300 text-slate-900`}>
                Contractor
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={getLinkHref(link)}
                onClick={() => setActiveSection(link.name)}
                className={`text-lg font-medium transition-all duration-300 relative group py-1 ${
                  activeSection === link.name ? 'text-[#8B0000]' : 'text-gray-700 hover:text-[#8B0000]'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#8B0000] transition-all duration-300 ${
                  activeSection === link.name ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </a>
            ))}
            
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full text-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg bg-[#8B0000] text-white hover:bg-[#660000]`}
              >
                Admin Login
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md focus:outline-none transition-colors duration-300 text-gray-800`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 right-0 w-64 h-full bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold text-[#8B0000]">Menu</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-red-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={getLinkHref(link)}
                      className={`text-lg font-medium transition-colors py-2 border-b border-gray-100 ${
                        activeSection === link.name ? 'text-[#8B0000] border-[#8B0000]' : 'text-gray-800 hover:text-[#8B0000]'
                      }`}
                      onClick={() => {
                        setActiveSection(link.name);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {link.name}
                    </a>
                  ))}
                  <Link
                    to="/login"
                    className="mt-6 bg-[#8B0000] text-white px-5 py-3 rounded-lg text-center font-semibold shadow hover:bg-[#660000] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Login
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
