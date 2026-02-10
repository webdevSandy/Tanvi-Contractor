import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch banners from API
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/banners`);
                const data = await response.json();
                if (data && data.length > 0) {
                    setBanners(data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching banners:', error);
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    // Auto-play carousel
    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length]);

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    // Fallback if no banners or loading
    if (loading) {
        return (
             <div className="h-[600px] w-full flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000]"></div>
             </div>
        );
    }

    // Default banner if API returns empty
    const currentBanner = banners.length > 0 ? banners[currentIndex] : {
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop",
        title: "Building Dreams, Creating Reality",
        subtitle: "Professional construction services tailored to your needs."
    };

    const isDefault = banners.length === 0;

    return (
        <div id="home" className="w-full bg-white pt-4">
            <div className="relative h-[600px] mx-4 md:mx-8 rounded-2xl overflow-hidden bg-gray-900 shadow-xl">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        {/* Background Image */}
                        <img
                            src={currentBanner.image}
                            alt={currentBanner.title || "Banner"}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40"></div>

                        {/* Content - Only show if title or subtitle exists */}
                        {(currentBanner.title || currentBanner.subtitle) && (
                            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center pb-12">
                                {currentBanner.title && (
                                    <motion.h1 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                        className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
                                    >
                                        {currentBanner.title}
                                    </motion.h1>
                                )}
                                
                                {currentBanner.subtitle && (
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.7, duration: 0.8 }}
                                        className="text-xl md:text-2xl text-gray-200 max-w-3xl drop-shadow-md"
                                    >
                                        {currentBanner.subtitle}
                                    </motion.p>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Pagination Dots - Outside Image */}
            {!isDefault && banners.length > 1 && (
                <div className="flex justify-center space-x-3 py-6 bg-white">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`h-3 w-3 rounded-full transition-all duration-300 ${
                                index === currentIndex 
                                    ? 'bg-[#8B0000] w-8' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Hero;
