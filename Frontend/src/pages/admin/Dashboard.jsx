import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InvoiceDetailModal from '../../components/InvoiceDetailModal';
import Loader from '../../components/Loader';

const Dashboard = () => {
    const [stats, setStats] = useState({
        invoices: 0,
        services: 0,
        partners: 0,
        banners: 0,
        recentContacts: [],
        recentInvoices: [],
        revenueData: []
    });
    const [user, setUser] = useState({ username: 'Admin' });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch Profile for Greeting
                try {
                    const profileRes = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, { headers });
                    setUser(profileRes.data);
                } catch (e) { console.error("Profile fetch error", e); }

                // Helper for data fetching
                const getData = async (url) => {
                    try {
                        const res = await axios.get(url, { headers });
                        return res.data;
                    } catch (error) {
                        console.error(`Error fetching ${url}:`, error);
                        return [];
                    }
                };

                const [invoicesData, servicesData, partnersData, bannersData, contactsData] = await Promise.all([
                    getData(`${process.env.REACT_APP_API_URL}/invoices`),
                    getData(`${process.env.REACT_APP_API_URL}/services`),
                    getData(`${process.env.REACT_APP_API_URL}/partners`),
                    getData(`${process.env.REACT_APP_API_URL}/banners`),
                    getData(`${process.env.REACT_APP_API_URL}/contacts`)
                ]);

                // Process Revenue Data (Monthly)
                const monthlyRevenue = Array(12).fill(0);
                invoicesData.forEach(inv => {
                    const date = new Date(inv.date);
                    const month = date.getMonth(); // 0-11
                    monthlyRevenue[month] += (inv.totalAmount || 0);
                });

                const chartData = monthlyRevenue.map((amount, index) => ({
                    name: new Date(0, index).toLocaleString('default', { month: 'short' }),
                    Revenue: amount
                }));

                // Process Data
                setStats({
                    invoices: invoicesData.length,
                    services: servicesData.length,
                    partners: partnersData.length,
                    banners: bannersData.length,
                    recentInvoices: invoicesData.slice(-5).reverse(),
                    recentContacts: contactsData.slice(-5).reverse(),
                    revenueData: chartData
                });

            } catch (error) {
                console.error("Dashboard Data Error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleRowClick = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const handleInvoiceUpdate = (updatedInvoice) => {
        setStats(prevStats => {
            const updatedRecentInvoices = prevStats.recentInvoices.map(inv => 
                inv._id === updatedInvoice._id ? updatedInvoice : inv
            );
            return { ...prevStats, recentInvoices: updatedRecentInvoices };
        });
        setSelectedInvoice(updatedInvoice);
        // Optionally refetch all data if needed, but local update is faster for UX
    };

    const modules = [
        { title: 'Total Invoices', count: stats.invoices, link: '/admin/invoices', color: 'from-blue-500 to-blue-700', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { title: 'Active Services', count: stats.services, link: '/admin/services', color: 'from-green-500 to-green-700', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { title: 'Partners', count: stats.partners, link: '/admin/partners', color: 'from-purple-500 to-purple-700', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { title: 'Banners', count: stats.banners, link: '/admin/banners', color: 'from-orange-500 to-orange-700', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    ];

    if (isLoading) {
        return <div className="p-10 flex justify-center"><Loader /></div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-end md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#002D5B]">Good Morning, {user.username} Sir!</h1>
                    <p className="text-gray-500 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="mt-4 md:mt-0">
                     <Link to="/admin/create-invoice" className="bg-[#8B0000] text-white px-6 py-3 rounded-lg hover:bg-red-800 transition shadow-md flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Create Invoice
                    </Link>
                </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {modules.map((mod, index) => (
                    <Link key={index} to={mod.link} className={`relative overflow-hidden block p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 bg-gradient-to-br ${mod.color} text-white`}>
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium opacity-80 uppercase tracking-wider">{mod.title}</p>
                                <h3 className="text-4xl font-extrabold mt-2">{mod.count}</h3>
                            </div>
                            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mod.icon} />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center text-sm font-medium opacity-90 group">
                            <span>View Details</span>
                            <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </div>
                        {/* Decorative Circle */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Recent Invoices Widget */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </span>
                            Recent Invoices
                        </h3>
                        <Link to="/admin/invoices" className="text-sm text-blue-600 hover:underline font-medium">View All</Link>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                                    <th className="pb-3 pl-2">Client</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3 text-right">Amount</th>
                                    <th className="pb-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.recentInvoices.length > 0 ? (
                                    stats.recentInvoices.map((inv) => (
                                        <tr 
                                            key={inv._id} 
                                            onClick={() => handleRowClick(inv)}
                                            className="group hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <td className="py-3 pl-2 text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                                {inv.clientName || 'Unknown Client'}
                                            </td>
                                            <td className="py-3 text-sm text-gray-500">
                                                {new Date(inv.date).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 text-sm text-gray-900 font-bold text-right">
                                                ₹{inv.grandTotal?.toLocaleString()}
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    inv.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                                                    inv.status === 'Overdue' ? 'bg-red-100 text-red-800' : 
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {inv.status || 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-gray-500">No recent invoices found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Queries Widget */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                             <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            </span>
                            Recent Queries
                        </h3>
                        <Link to="/admin/contacts" className="text-sm text-indigo-600 hover:underline font-medium">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {stats.recentContacts.length > 0 ? (
                            stats.recentContacts.map((contact) => (
                                <div key={contact._id} className="flex items-start p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
                                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                        {contact.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-3 flex-1 overflow-hidden">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <p className="text-sm font-bold text-gray-900 truncate">{contact.name}</p>
                                            <span className="text-xs text-gray-400">{new Date(contact.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 truncate group-hover:text-gray-900 transition-colors">{contact.message}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-gray-500">No recent queries.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Revenue Chart Section */}
            <div className="mb-10 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                     <span className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                    </span>
                    Monthly Revenue (Current Year)
                </h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(value) => `₹${value / 1000}k`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1F2937', color: '#fff', borderRadius: '8px', border: 'none' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                cursor={{fill: '#F3F4F6'}}
                            />
                            <Bar dataKey="Revenue" fill="#002D5B" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Invoice Detail Modal */}
            <InvoiceDetailModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                invoice={selectedInvoice}
                onUpdate={handleInvoiceUpdate}
            />
        </div>
    );
};

export default Dashboard;
