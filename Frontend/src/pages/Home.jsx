import React from 'react';
import { Helmet } from 'react-helmet-async';
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
      <Helmet>
        <title>Tanvi Contractor | Premium Construction & Maintenance Services</title>
        <meta name="description" content="Tanvi Contractor provides reliable, high-quality contract-based construction, electrical, and maintenance services for residential and commercial needs." />
        <meta name="keywords" content="construction, electrical work, maintenance, reliable contractor, home repair, commercial contractors" />
        <meta property="og:title" content="Tanvi Contractor | Premium Construction Services" />
        <meta property="og:description" content="Professional contract-based construction and maintenance services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tanvicontractor.vercel.app/" />
        <link rel="canonical" href="https://tanvicontractor.vercel.app/" />
      </Helmet>
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
