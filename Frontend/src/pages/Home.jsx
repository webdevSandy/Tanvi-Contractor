import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Partners from '../components/Partners';
import AboutContact from '../components/AboutContact';
import ContactUs from '../components/ContactUs';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="font-sans">
      <Navbar />
      <Hero />
      <Services />
      <Partners />
      <AboutContact />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Home;
