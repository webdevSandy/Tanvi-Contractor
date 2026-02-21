import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import InvoiceTemplate from '../../components/InvoiceTemplate';
import Loader from '../../components/Loader';

const CompanyContactManager = () => {
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        address: '',
        gstin: '',
        pan: '',
        activeTemplate: 'premium',
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        branch: ''
    });

    // Mock invoice data for the template preview
    const mockInvoice = {
        invoiceNumber: 'INV-DEMO-001',
        date: new Date().toISOString(),
        clientName: 'Sample Client',
        clientAddress: '123 Business Road, City',
        consignee: {
            name: 'Sample Consignee',
            address: '456 Warehouse Ave, City',
            gstin: '09XXXXX0000X0Z0'
        },
        items: [
            { description: 'Professional Services', quantity: 1, unit: 'LUMPSUM', rate: 25000, amount: 25000 },
            { description: 'Consultation Fee', quantity: 2, unit: 'HOURS', rate: 2500, amount: 5000 }
        ],
        totalAmount: 30000,
        grandTotal: 35400,
        vendorCode: '9999999',
        orderNo: 'ORD-555',
        contractNo: 'CTR-777',
        diNo: 'DI-888'
    };

    const containerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [templateLoading, setTemplateLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            setInitialLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/company-contact`);
            setFormData({
                phone: res.data.phone || '',
                email: res.data.email || '',
                address: res.data.address || '',
                gstin: res.data.gstin || '',
                pan: res.data.pan || '',
                activeTemplate: res.data.activeTemplate || 'premium',
                accountName: res.data.accountName || '',
                accountNumber: res.data.accountNumber || '',
                ifscCode: res.data.ifscCode || '',
                bankName: res.data.bankName || '',
                branch: res.data.branch || ''
            });
        } catch (error) {
            console.error('Error fetching contact info:', error);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.REACT_APP_API_URL}/company-contact`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Company contact, Tax & Bank info updated successfully!');
            fetchContactInfo();
        } catch (error) {
            console.error('Error updating contact info:', error);
            alert('Failed to update. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateSubmit = async (e) => {
        e.preventDefault();
        setTemplateLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.REACT_APP_API_URL}/company-contact`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Invoice template preference updated successfully!');
            fetchContactInfo();
        } catch (error) {
            console.error('Error updating template info:', error);
            alert('Failed to update template. Please try again.');
        } finally {
            setTemplateLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Company Info</h2>
            {initialLoading ? (
                <Loader />
            ) : (
            <div className="flex flex-col xl:flex-row gap-6 items-start">
                {/* Left Column: Main Form Data */}
                <div className="bg-white p-6 rounded-lg shadow-md w-full xl:w-2/3">
                    <form id="company-contact-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="text" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h3 className="text-lg font-bold mb-4 text-gray-700">Tax Information (For Invoicing)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN</label>
                                    <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} placeholder="09ELJPK..." className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN No.</label>
                                    <input type="text" name="pan" value={formData.pan} onChange={handleChange} placeholder="ELJPK..." className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h3 className="text-lg font-bold mb-4 text-gray-700">Bank Details (For Invoicing)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                                    <input type="text" name="accountName" value={formData.accountName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                                    <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                                    <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                                    <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                                    <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Right Column: Invoice Customization (Preview side-by-side) */}
                <div className="bg-white p-6 rounded-lg shadow-md w-full xl:w-1/3">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Invoice Customization</h3>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Active Invoice Template</label>
                        <select 
                            name="activeTemplate"
                            value={formData.activeTemplate}
                            onChange={handleChange}
                            form="company-contact-form"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="classic">Classic (Standard B&W)</option>
                            <option value="premium">Premium (Brand Colors, Red)</option>
                            <option value="modern">Modern (Dark Slate, Minimal)</option>
                        </select>
                    </div>
                    
                    {/* Live Preview Container */}
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Live Preview</label>
                        <div className="border border-gray-200 rounded-lg bg-gray-50 flex justify-center overflow-hidden relative shadow-inner" style={{ height: '400px' }}>
                            {/* The scale container */}
                            <div style={{
                                position: 'absolute',
                                top: '0',
                                left: '50%',
                                transform: 'translateX(-50%) scale(0.35)',
                                transformOrigin: 'top center',
                                pointerEvents: 'none',
                                width: '210mm',
                                height: '297mm',
                                marginTop: '20px'
                            }}>
                                <div className="shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)]">
                                    <InvoiceTemplate 
                                        invoice={mockInvoice} 
                                        contact={formData}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Template Button */}
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleTemplateSubmit}
                            disabled={templateLoading}
                            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors ${templateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {templateLoading ? 'Saving...' : 'Save Template Selection'}
                        </button>
                    </div>

                </div>
            </div>
            )}
        </div>
    );
};

export default CompanyContactManager;
