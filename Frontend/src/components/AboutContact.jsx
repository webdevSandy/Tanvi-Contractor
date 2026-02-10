import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AboutContact = () => {
  const [data, setData] = useState({
    title: 'About us',
    description: 'At Tanvi Contractor, we provide reliable and cost-effective contract-based services to meet your personal, business, and organizational needs.',
    image: null
  });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/about`);
        if (res.data) {
          setData(res.data);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };
    fetchAbout();
  }, []);

  return (
    <div id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* About Us Section */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-32"
        >
            {/* Standard Section Heading */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#002D5B]">About Us</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Image Side (Left) */}
                <div className="order-1 md:order-1 flex justify-center">
                    {data.image ? (
                        <div className="relative w-full max-w-md aspect-square">
                            <div className="absolute inset-0 bg-blue-100 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] animate-pulse opacity-50 blur-xl"></div>
                            <img 
                                src={data.image} 
                                alt="About Us" 
                                className="relative w-full h-full object-cover shadow-xl z-10 transition-all duration-500 hover:scale-105"
                                style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
                            />
                        </div>
                    ) : (
                        <div className="bg-gray-100 w-full h-[400px] flex items-center justify-center text-gray-500" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}>
                            No Image Available
                        </div>
                    )}
                </div>

                {/* Content Side (Right) */}
                <div className="order-2 md:order-2 text-left space-y-6">
                    <h2 className="text-4xl font-bold text-[#002D5B] leading-tight">
                        {data.title}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                        {data.description}
                    </p>
                    <div className="pt-4">
                        <button 
                            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-[#8B0000] text-white px-8 py-3 rounded-lg hover:bg-[#660000] transition-all transform hover:-translate-y-1 shadow-md"
                        >
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutContact;
