import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Loader from './Loader';

const ContactUs = () => {
    const [contactInfo, setContactInfo] = useState({
        phone: '',
        email: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
        
    // Fetch contact info
    React.useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/company-contact`);
                if (res.data) {
                    setContactInfo({
                        phone: res.data.phone || '',
                        email: res.data.email || '',
                        address: res.data.address || '',
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching contact info:', error);
                // Don't set error on UI for contact info, just log it. 
                // We show form even if contact info fails.
                setLoading(false); 
            }
        };
        fetchContactInfo();
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '', // Added mobile
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/contacts`, formData);
            alert('Thank you for contacting us! We will get back to you soon.');
            setFormData({ name: '', email: '', mobile: '', message: '' }); // Reset mobile
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="relative py-20 bg-gray-50/70 backdrop-blur-md">
            {loading ? (
                 <div className="flex justify-center items-center h-64">
                    <Loader />
                 </div>
            ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ... Header and Info section unchanged ... */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[#002D5B] mb-4">Contact <span className="text-[#8B0000]">Us</span></h2>
                    <p className="text-gray-600 max-w-4xl mx-auto text-base md:text-lg">
                        Get in touch with us for any inquiries or assistance. We are here to help!
                    </p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-12">
                     {/* Contact Info (Abbreviated for replacement context, using existing structure) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="md:w-1/3 space-y-8"
                    >
                         {/* ... Info Content ... */}
                         <div>
                            <h3 className="text-xl font-bold text-[#333] mb-4">Contact Information</h3>
                            <div className="space-y-4 text-gray-600">
                                <p className="flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-[#002D5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    {contactInfo.email}
                                </p>
                                <p className="flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-[#002D5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    {contactInfo.phone}
                                </p>
                                <p className="flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-[#002D5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {contactInfo.address}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="md:w-2/3 bg-white p-8 rounded-xl shadow-lg"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002D5B] focus:border-transparent" 
                                        placeholder="Your Name"
                                    />
                                </div>
                                {/* Mobile Field Moved Here */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                    <input 
                                        type="tel" 
                                        name="mobile" 
                                        value={formData.mobile} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002D5B] focus:border-transparent" 
                                        placeholder="Your Mobile Number"
                                    />
                                </div>
                            </div>
                            
                            {/* Email Field Moved Below */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002D5B] focus:border-transparent" 
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea 
                                    name="message" 
                                    value={formData.message} 
                                    onChange={handleChange} 
                                    required
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002D5B] focus:border-transparent" 
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-[#8B0000] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#660000] transition duration-300 transform hover:-translate-y-1"
                            >
                                Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
            )}
        </section>
    );
};

export default ContactUs;
