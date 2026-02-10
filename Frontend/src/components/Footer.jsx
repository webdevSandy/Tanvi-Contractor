import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsConditions from '../pages/TermsConditions';
import RefundPolicy from '../pages/RefundPolicy';

const Footer = () => {
  const [contactInfo, setContactInfo] = useState({
      phone: '',
      email: '',
      address: '123, Main Street, City, Country'
  });
  const [socials, setSocials] = useState({
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      privacyPolicy: '',
      termsConditions: '',
      refundPolicy: ''
  });
  
  const [activeModal, setActiveModal] = useState(null); // 'privacy', 'terms', 'refund', or null

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch Company Info
            const contactRes = await axios.get(`${process.env.REACT_APP_API_URL}/company-contact`);
            if (contactRes.data) {
                setContactInfo(contactRes.data);
            }

            // Fetch Social Links
            const socialRes = await axios.get(`${process.env.REACT_APP_API_URL}/footer`);
            if (socialRes.data) {
                setSocials(socialRes.data);
            }
        } catch (error) {
            console.error('Error fetching footer data:', error);
        }
    };
    fetchData();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#002D5B] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                {/* Company Info */}
                <div>
                    <h3 className="text-2xl font-bold mb-6">Tanvi Contractor</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        Providing reliable contract-based services for all your needs. Vehicles, manpower, and more.
                    </p>
                    <div className="space-y-3">
                        {contactInfo.phone && (
                            <p className="flex items-center text-gray-300">
                                <span className="mr-3">📞</span> {contactInfo.phone}
                            </p>
                        )}
                        {contactInfo.email && (
                            <p className="flex items-center text-gray-300">
                                <span className="mr-3">✉️</span> {contactInfo.email}
                            </p>
                        )}
                        {contactInfo.address && (
                            <p className="flex items-center text-gray-300">
                                <span className="mr-3">📍</span> {contactInfo.address}
                            </p>
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-bold mb-6">Quick Links</h3>
                    <ul className="space-y-4">
                        <li>
                            <button onClick={() => scrollToSection('home')} className="text-gray-300 hover:text-white hover:translate-x-2 transition-transform">
                                Home
                            </button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-white hover:translate-x-2 transition-transform">
                                About Us
                            </button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-white hover:translate-x-2 transition-transform">
                                Services
                            </button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('partners')} className="text-gray-300 hover:text-white hover:translate-x-2 transition-transform">
                                Partners
                            </button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-white hover:translate-x-2 transition-transform">
                                Contact
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="text-xl font-bold mb-6">Connect With Us</h3>
                    <div className="flex space-x-4 mb-8">
                        {socials.facebook && (
                            <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-[#8B0000] transition-colors">
                                {/* Facebook Icon */}
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </a>
                        )}
                        {socials.instagram && (
                            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-[#8B0000] transition-colors">
                                {/* Instagram Icon */}
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                            </a>
                        )}
                        {socials.twitter && (
                            <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-[#8B0000] transition-colors">
                                {/* X (Twitter) Icon */}
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            </a>
                        )}
                        {socials.linkedin && (
                            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-[#8B0000] transition-colors">
                                {/* LinkedIn Icon */}
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                            </a>
                        )}
                    </div>

                    <div className="flex flex-col items-start space-y-2 text-sm text-gray-400">
                        <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors text-left">Privacy Policy</button>
                        <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors text-left">Terms & Conditions</button>
                        <button onClick={() => setActiveModal('refund')} className="hover:text-white transition-colors text-left">Refund Policy</button>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                <p>&copy; {new Date().getFullYear()} Tanvi Contractor. All rights reserved.</p>
            </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-1 shadow-md"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              {activeModal === 'privacy' && <PrivacyPolicy />}
              {activeModal === 'terms' && <TermsConditions />}
              {activeModal === 'refund' && <RefundPolicy />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
