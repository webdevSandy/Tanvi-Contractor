import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/services`);
        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div id="services" className="py-20 bg-white flex justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000]"></div>
      </div>
    );
  }

  return (
    <div id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#002D5B]">Our Services</h2>
          <p className="mt-4 text-gray-600 max-w-4xl mx-auto text-base md:text-lg">
            At Tanvi Contractor, we provide reliable and cost-effective contract-based services to meet your personal, business, and organizational needs. Whether you are looking for vehicles, manpower, or specialized support - we've got you covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
                key={service._id} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="bg-[#FAF9F6] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-40 w-full mb-6 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                 {service.image ? (
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                 ) : (
                    <span className="text-6xl">🛠️</span>
                 )}
              </div>
              <h3 className="text-xl font-bold text-[#002D5B] mb-2 flex items-center">
                 {service.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {service.description}
              </p>
              {service.points && service.points.length > 0 && (
                  <ul className="text-gray-600 text-sm list-none space-y-2 mt-4 text-left">
                     {service.points.map((point, i) => (
                         <li key={i} className="flex items-start">
                             <span className="mr-2 text-[#8B0000]">•</span>
                             {point}
                         </li>
                     ))}
                  </ul>
              )}
            </motion.div>
          ))}
        </div>
        
        {services.length === 0 && !loading && (
             <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-center text-gray-500"
             >
                No services found. Please add them from the Admin Panel.
             </motion.div>
        )}
      </div>
    </div>
  );
};

export default Services;
