import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Loader from './Loader';

const Partners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/partners`);
                const data = await response.json();
                setPartners(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching partners:', error);
                setError('Failed to load partners.');
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

    if (loading) {
        return (
            <section id="partners" className="py-24 bg-white flex justify-center items-center min-h-[400px]">
                 <Loader />
            </section>
        );
    }

    if (error) {
        return (
            <section id="partners" className="py-24 bg-white flex justify-center items-center min-h-[400px]">
                <div className="bg-red-50 text-red-500 px-6 py-4 rounded-2xl font-medium">
                    {error}
                </div>
            </section>
        );
    }

    return (
        <section id="partners" className="relative py-20 lg:py-32 bg-slate-50/70 backdrop-blur-md overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-red-100 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10"
            >
                {/* Modern Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-semibold mb-6 shadow-sm">
                    <svg className="w-4 h-4 text-[#8B0000]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Trusted Network
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-[#002D5B] mb-6">
                    Our Strategic <span className="text-[#8B0000]">Partners</span>
                </h2>
                
                <p className="mb-16 text-slate-600 max-w-2xl mx-auto text-lg md:text-xl font-light">
                    We collaborate with industry leaders and top brands to deliver uncompromising quality and excellence in every project.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 items-center justify-items-center">
                    {partners.map((partner, index) => (
                        <motion.div 
                            key={partner._id} 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
                            className="w-full group"
                        >
                            <div className="bg-white h-32 sm:h-40 w-full max-w-[240px] mx-auto border border-slate-100 rounded-[2rem] flex flex-col items-center justify-center p-6 shadow-md hover:shadow-2xl hover:border-red-100 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                                {/* Subtle hover gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {partner.logo ? (
                                    <img 
                                        src={partner.logo} 
                                        alt={partner.name} 
                                        className="relative z-10 max-h-full max-w-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" 
                                    />
                                ) : (
                                    <span className="relative z-10 text-slate-800 font-bold text-xl group-hover:text-[#8B0000] transition-colors duration-300 text-center">
                                        {partner.name}
                                    </span>
                                )}
                            </div>
                            <span className="block mt-4 text-sm font-semibold text-slate-500 group-hover:text-slate-900 transition-colors duration-300">
                                {partner.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
                
                {partners.length === 0 && !loading && (
                     <div className="mt-12 p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-300 text-center text-slate-500 font-medium">
                         Partners directory is currently empty. Please add them from the Admin Panel.
                     </div>
                )}
            </motion.div>
        </section>
    );
};

export default Partners;
