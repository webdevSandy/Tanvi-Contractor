import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Loader from './Loader';

const Hero = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
             <div className="min-h-[80vh] w-full flex items-center justify-center bg-slate-50">
                <Loader />
             </div>
        );
    }

    const currentBanner = banners.length > 0 ? banners[currentIndex] : {
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop",
        title: "Building Dreams, Creating Reality",
        subtitle: "Professional construction services tailored to your exact needs. Experience excellence and reliability in every project we deliver."
    };

    const isDefault = banners.length === 0;

    return (
        <section id="home" className="relative w-full bg-slate-50 pt-20 pb-36 lg:pt-32 lg:pb-40 overflow-x-hidden min-h-screen flex flex-col justify-center">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-red-100/50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-100/50 blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-4 lg:gap-20">
                {/* Left Content Column */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="flex flex-col"
                        >
                            {/* Modern Pill Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-[#8B0000] text-sm font-semibold mb-3 lg:mb-6 w-max shadow-sm">
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8B0000]"></span>
                                </span>
                                Premium Services
                            </div>

                            {currentBanner.title && (
                                <h1 className="text-3xl md:text-5xl font-bold text-[#002D5B] mb-3 lg:mb-6 leading-[1.2]">
                                    {currentBanner.title.split(' ').map((word, i, arr) => (
                                        i === arr.length - 1 ? <span key={i} className="text-[#8B0000]">{word}</span> : <span key={i}>{word} </span>
                                    ))}
                                </h1>
                            )}
                            
                            {currentBanner.subtitle && (
                                <p className="text-base sm:text-xl text-slate-600 mb-4 lg:mb-10 leading-relaxed font-light max-w-lg line-clamp-2 lg:line-clamp-none">
                                    {currentBanner.subtitle}
                                </p>
                            )}

                            {/* Call to Action Buttons */}
                            <div className="flex flex-wrap gap-3 mb-4 lg:mb-12">
                                <a href="#services" className="px-8 py-4 bg-[#8B0000] hover:bg-red-800 text-white rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-red-900/20 flex items-center gap-2">
                                    Explore Services
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </a>
                                <a href="#contact" className="px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md">
                                    Get a Quote
                                </a>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Pagination Controls - Modern Dots */}
                    {!isDefault && banners.length > 1 && (
                        <div className="flex items-center space-x-2">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDotClick(index)}
                                    className={`relative transition-all duration-500 overflow-hidden rounded-full ${
                                        index === currentIndex 
                                            ? 'w-10 h-2 bg-[#8B0000]' 
                                            : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Dynamic Graphic Column */}
                <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center">
                    <div className="relative w-full max-w-lg flex items-center justify-center">

                        {/* Uploaded Graphic - Image or Lottie */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative z-10 w-full flex items-center justify-center"
                            >
                                {currentBanner.image ? (
                                    currentBanner.mediaType === 'lottie' ? (
                                        <DotLottieReact
                                            src={currentBanner.image}
                                            autoplay
                                            loop
                                            style={{ height: 'clamp(180px, 40vw, 450px)', width: '100%' }}
                                        />
                                    ) : (
                                        <img
                                            src={currentBanner.image}
                                            alt={currentBanner.title || "Hero Graphic"}
                                            className="max-w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)] max-h-[200px] lg:max-h-[450px]"
                                        />
                                    )
                                ) : (
                                    <div className="w-full h-72 bg-slate-100/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 font-medium text-sm">
                                        Upload a graphic or Lottie from Admin Panel
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                    </div>
                </div>
            </div>

            {/* ── Scroll Down Indicator ── */}
            <motion.a
                href="#services"
                aria-label="Scroll to services"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.7, ease: 'easeOut' }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 group z-20 select-none"
            >
                {/* Glowing outer pulse ring */}
                <div className="relative flex items-center justify-center">
                    <motion.span
                        className="absolute w-14 h-14 rounded-full bg-[#8B0000]/15"
                        animate={{ scale: [1, 1.55, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.span
                        className="absolute w-14 h-14 rounded-full bg-[#8B0000]/10"
                        animate={{ scale: [1, 1.9, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                    />

                    {/* Main bordered circle */}
                    <div className="relative w-11 h-11 rounded-full border-2 border-[#8B0000]/40 group-hover:border-[#8B0000] bg-white/80 backdrop-blur-sm shadow-md transition-colors duration-300 flex items-center justify-center">
                        {/* Animated arrow bouncing inside */}
                        <motion.svg
                            className="w-5 h-5 text-[#8B0000]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                    </div>
                </div>

                {/* Fading label */}
                <motion.span
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-[#8B0000] transition-colors duration-300"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    Scroll
                </motion.span>
            </motion.a>
        </section>
    );
};

export default Hero;
