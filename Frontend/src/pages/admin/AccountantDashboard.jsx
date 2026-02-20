import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/Loader';

const AccountantDashboard = () => {
    const [stats, setStats] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'expenses'

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams(dateRange).toString();
            
            const [statsRes, expensesRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/invoices/date-stats?${queryParams}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${process.env.REACT_APP_API_URL}/expenses?${queryParams}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setStats(statsRes.data);
            setExpenses(expensesRes.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadCSV = () => {
        if (!stats || !expenses) return;

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Type,Date,Description/Client,Amount,Status/Category\n";

        // Add Invoices
        stats.recentInvoices.forEach(inv => {
            csvContent += `Invoice,${new Date(inv.date).toLocaleDateString()},${inv.clientName},${inv.grandTotal},${inv.status}\n`;
        });

        // Add Expenses
        expenses.forEach(exp => {
            csvContent += `Expense,${new Date(exp.date).toLocaleDateString()},${exp.title},${exp.amount},${exp.category}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "financial_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const netProfit = stats ? (stats.financials.totalReceived - totalExpenses) : 0;

    if (loading) return <Loader />;
    if (error) return <div className="p-6 text-red-600">{error}</div>;
    if (!stats) return null;

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002D5B] tracking-tight">Accountant Dashboard</h1>
                    <p className="text-gray-500 mt-1 text-sm">Financial overview, expenses, and profit tracking.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                     <input 
                        type="date" 
                        value={dateRange.startDate} 
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <span className="text-gray-400">to</span>
                    <input 
                        type="date" 
                        value={dateRange.endDate} 
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <button 
                        onClick={handleDownloadCSV}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'overview' ? 'border-[#002D5B] text-[#002D5B]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Overview & Invoices
                    </button>
                    <button
                        onClick={() => setActiveTab('expenses')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'expenses' ? 'border-[#002D5B] text-[#002D5B]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Expense Tracker
                    </button>
                </nav>
            </div>

            {activeTab === 'overview' ? (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard 
                            title="Total Revenue" 
                            value={`₹${stats.financials.totalInvoiced.toLocaleString()}`} 
                            subtext="Total Billed"
                            color="bg-blue-50 text-blue-700 border-blue-200"
                        />
                         <StatCard 
                            title="Total Received" 
                            value={`₹${stats.financials.totalReceived.toLocaleString()}`} 
                            subtext="Actual Inflow"
                            color="bg-green-50 text-green-700 border-green-200"
                        />
                         <StatCard 
                            title="Total Expenses" 
                            value={`₹${totalExpenses.toLocaleString()}`} 
                            subtext="Total Outflow"
                            color="bg-red-50 text-red-700 border-red-200"
                        />
                         <StatCard 
                            title="Net Profit" 
                            value={`₹${netProfit.toLocaleString()}`} 
                            subtext="Received - Expenses"
                            color={`${netProfit >= 0 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         {/* Monthly Revenue Chart */}
                         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-1">
                            <h3 className="font-bold text-gray-800 mb-4">Revenue Trend (Last 6 Months)</h3>
                            <div className="space-y-4">
                                {stats.monthlyRevenue.length > 0 ? stats.monthlyRevenue.map((month, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">{month.name}</span>
                                        <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-[#002D5B] rounded-full" 
                                                style={{ width: `${(month.total / (Math.max(...stats.monthlyRevenue.map(m => m.total)) || 1)) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-800">₹{month.total.toLocaleString()}</span>
                                    </div>
                                )) : <p className="text-sm text-gray-400">No trend data available for selected filter.</p>}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                            <h3 className="font-bold text-gray-800 mb-4">Recent Invoices</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {stats.recentInvoices.map((inv) => (
                                            <tr key={inv._id}>
                                                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-blue-600">{inv.invoiceNumber}</td>
                                                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{inv.clientName}</td>
                                                <td className="px-3 py-3 whitespace-nowrap text-sm text-right font-bold text-gray-800">₹{inv.grandTotal?.toLocaleString()}</td>
                                                <td className="px-3 py-3 whitespace-nowrap text-center">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${inv.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                                                          inv.status === 'Overdue' ? 'bg-red-100 text-red-800' : 
                                                          'bg-yellow-100 text-yellow-800'}`}>
                                                        {inv.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <ExpenseManager expenses={expenses} refresh={fetchData} />
            )}
        </div>
    );
};

const ExpenseManager = ({ expenses, refresh }) => {
    const [formData, setFormData] = useState({ title: '', amount: '', category: 'Office', description: '', date: new Date().toISOString().split('T')[0] });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.amount) return alert('Please fill required fields');

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${process.env.REACT_APP_API_URL}/expenses`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({ title: '', amount: '', category: 'Office', description: '', date: new Date().toISOString().split('T')[0] });
            refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to add expense');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this expense?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API_URL}/expenses/${id}`, {
                 headers: { Authorization: `Bearer ${token}` }
            });
            refresh();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                <h3 className="font-bold text-gray-800 mb-4">Add New Expense</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg p-2 text-sm" placeholder="e.g. Office Rent" required />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Amount (₹)</label>
                        <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border rounded-lg p-2 text-sm" placeholder="0.00" required />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border rounded-lg p-2 text-sm">
                            <option>Office</option>
                            <option>Salary</option>
                            <option>Rent</option>
                            <option>Equipment</option>
                            <option>Travel</option>
                            <option>Marketing</option>
                            <option>Tax</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border rounded-lg p-2 text-sm" />
                    </div>
                    <button type="submit" className="w-full bg-[#002D5B] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#001f3f] transition">Add Expense</button>
                </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-800">Expense History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {expenses.length > 0 ? expenses.map((exp) => (
                                <tr key={exp._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(exp.date).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{exp.title}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{exp.category}</span></td>
                                    <td className="px-4 py-3 text-sm text-right font-bold text-red-600">-₹{exp.amount.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => handleDelete(exp._id)} className="text-red-500 hover:text-red-700">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colspan="5" className="px-4 py-8 text-center text-gray-500">No expenses recorded for this period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, subtext, color }) => (
    <div className={`p-6 rounded-xl border ${color} shadow-sm backdrop-blur-sm bg-opacity-60`}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase opacity-80 tracking-wider">{title}</h3>
        </div>
        <div className="text-2xl font-extrabold mb-1">{value}</div>
        <div className="text-xs font-medium opacity-80">{subtext}</div>
    </div>
);

export default AccountantDashboard;
