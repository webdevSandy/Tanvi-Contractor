import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Partners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/partners`);
                const data = await response.json();
                setPartners(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching partners:', error);
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

  if (loading) {
    return (
        <div id="partners" className="py-20 bg-white flex justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B0000]"></div>
        </div>
    );
  }

  return (
    <div id="partners" className="py-20 bg-white">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[#002D5B] mb-6">Partners</h2>
        <p className="mb-12 text-gray-600 max-w-4xl mx-auto text-base md:text-lg">
            At Tanvi Contractor, we provide reliable and cost-effective contract-based services to meet your personal, business, and organizational needs. Whether you are looking for vehicles, manpower, or specialized support - we've got you covered.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {partners.map((partner, index) => (
                <motion.div 
                    key={partner._id} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full flex flex-col items-center"
                >
                    <div className="bg-white h-32 w-full max-w-[200px] border border-gray-100 shadow-sm rounded-lg flex items-center justify-center p-4 hover:shadow-md transition-shadow">
                        {partner.logo ? (
                            <img src={partner.logo} alt={partner.name} className="max-h-full max-w-full object-contain" />
                        ) : (
                            <span className="text-gray-700 font-bold text-lg">{partner.name}</span>
                        )}
                    </div>
                    <span className="mt-2 text-sm font-medium text-gray-700">{partner.name}</span>
                </motion.div>
            ))}
        </div>
        
        {partners.length === 0 && !loading && (
             <div className="text-center text-gray-500">No partners found. Please add them from the Admin Panel.</div>
        )}
      </motion.div>
    </div>
  );
};

export default Partners;
