import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { InvoiceProvider } from './context/InvoiceContext';
import FormPage from './pages/FormPage';
import InvoicePage from './pages/InvoicePage';
import './index.css';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';

import AdminLayout from './layouts/AdminLayout';
import InvoiceList from './pages/InvoiceList';

import ServicesManager from './pages/admin/ServicesManager';
import PartnersManager from './pages/admin/PartnersManager';
import BannersManager from './pages/admin/BannersManager';
import AboutManager from './pages/admin/AboutManager';
import CompanyContactManager from './pages/admin/CompanyContactManager';
import FooterManager from './pages/admin/FooterManager';
import ContactManager from './pages/admin/ContactManager';
import Dashboard from './pages/admin/Dashboard';
import ActivityLogs from './pages/admin/ActivityLogs';
import AdminProfile from './pages/admin/AdminProfile';
import AccountantDashboard from './pages/admin/AccountantDashboard';
import QuotationList from './pages/admin/QuotationList';
import CreateQuotation from './pages/admin/CreateQuotation';

// New Global UI Components
import CustomCursor from './components/CustomCursor';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  return (
    <HelmetProvider>
      <InvoiceProvider>
      <Router>
        <CustomCursor />
        <AnimatedBackground />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
             <Route path="dashboard" element={<Dashboard />} />
             <Route path="create-invoice" element={<FormPage />} />
             <Route path="invoices" element={<InvoiceList />} />
             <Route path="services" element={<ServicesManager />} />
             <Route path="partners" element={<PartnersManager />} />
             <Route path="banners" element={<BannersManager />} />
             <Route path="about" element={<AboutManager />} />
             <Route path="company-info" element={<CompanyContactManager />} />
             <Route path="footer" element={<FooterManager />} />
             <Route path="contacts" element={<ContactManager />} />
             <Route path="activity-logs" element={<ActivityLogs />} />
             <Route path="account" element={<AccountantDashboard />} />
             <Route path="quotations" element={<QuotationList />} />
             <Route path="create-quotation" element={<CreateQuotation />} />
             <Route index element={<Dashboard />} />
          </Route>
          
          <Route path="/invoice" element={<InvoicePage />} />
        </Routes>
      </Router>
    </InvoiceProvider>
    </HelmetProvider>
  );
}

export default App;
