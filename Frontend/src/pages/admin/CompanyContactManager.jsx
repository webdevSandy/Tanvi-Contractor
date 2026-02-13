import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/Loader';

const CompanyContactManager = () => {
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        address: '',
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        branch: ''
    });
    const [loading, setLoading] = useState(false);
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
            alert('Company contact & Bank info updated successfully!');
            fetchContactInfo();
        } catch (error) {
            console.error('Error updating contact info:', error);
            alert('Failed to update. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Company Info</h2>
            {initialLoading ? (
                <Loader />
            ) : (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-bold mb-4 text-gray-700">Bank Details (For Invoicing)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                                <input type="text" name="accountName" value={formData.accountName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                                <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                                <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                                <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                                <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                </form>
            </div>
            )}
        </div>
    );
};

export default CompanyContactManager;
