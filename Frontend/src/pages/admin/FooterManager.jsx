import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/Loader';

const FooterManager = () => {
    const [formData, setFormData] = useState({
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        privacyPolicy: '',
        termsConditions: '',
        refundPolicy: ''
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        fetchFooter();
    }, []);

    const fetchFooter = async () => {
        try {
            setInitialLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/footer`);
            setFormData({
                facebook: res.data.facebook || '',
                instagram: res.data.instagram || '',
                twitter: res.data.twitter || '',
                linkedin: res.data.linkedin || '',
                privacyPolicy: res.data.privacyPolicy || '',
                termsConditions: res.data.termsConditions || '',
                refundPolicy: res.data.refundPolicy || ''
            });
        } catch (error) {
            console.error('Error fetching footer data:', error);
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
            await axios.put(`${process.env.REACT_APP_API_URL}/footer`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Footer social links updated successfully!');
            fetchFooter();
        } catch (error) {
            console.error('Error updating footer:', error);
            alert('Failed to update. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Footer & Social Links</h2>
            {initialLoading ? (
                <Loader />
            ) : (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                        <input
                            type="url"
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleChange}
                            placeholder="https://facebook.com/..."
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                        <input
                            type="url"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                            placeholder="https://instagram.com/..."
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter (X) URL</label>
                        <input
                            type="url"
                            name="twitter"
                            value={formData.twitter}
                            onChange={handleChange}
                            placeholder="https://twitter.com/..."
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                        <input
                            type="url"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/..."
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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

export default FooterManager;
