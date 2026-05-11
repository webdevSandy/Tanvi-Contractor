import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Loader from './Loader';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/services`);
        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services.');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="services" className="relative py-20 bg-white/70 backdrop-blur-md flex justify-center">
         <Loader />
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="relative py-20 bg-white/70 backdrop-blur-md flex justify-center text-red-500">
        {error}
      </section>
    );
  }

  return (
    <section id="services" className="relative py-20 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#002D5B]">Our <span className="text-[#8B0000]">Services</span></h2>
          <p className="mt-4 text-gray-600 max-w-4xl mx-auto text-base md:text-lg">
            Quality craftsmanship and expert management for every project.
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
    </section>
  );
};

export default Services;
