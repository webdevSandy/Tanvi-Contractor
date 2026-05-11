import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SearchBar, ViewToggle } from '../../components/AdminComponents';
import Loader from '../../components/Loader';

const QuotationList = () => {
    const navigate = useNavigate();
    const [quotations, setQuotations] = useState([]);
    const [filteredQuotations, setFilteredQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState(window.innerWidth < 768 ? 'card' : 'list');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchQuotations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/quotations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuotations(response.data);
            setFilteredQuotations(response.data);
        } catch (error) {
            console.error('Error fetching quotations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotations();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        setFilteredQuotations(quotations.filter(q => 
            q.quotationNumber?.toLowerCase().includes(lowerTerm) ||
            q.clientName.toLowerCase().includes(lowerTerm)
        ));
    }, [searchTerm, quotations]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quotation?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API_URL}/quotations/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchQuotations();
        } catch (error) {
            console.error(error);
            alert('Failed to delete quotation');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.REACT_APP_API_URL}/quotations/${id}`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuotations(quotations.map(q => q._id === id ? { ...q, status: newStatus } : q));
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        }
    };

    const handleGenerateInvoice = (quotation) => {
        navigate('/admin/create-invoice', { state: { quotation } });
    };

    const StatusBadge = ({ status, id }) => {
        const colors = {
            Accepted: 'bg-green-100 text-green-800 border-green-200',
            Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            Rejected: 'bg-red-100 text-red-800 border-red-200'
        };

        return (
            <select
                value={status || 'Pending'}
                onChange={(e) => handleStatusUpdate(id, e.target.value)}
                className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${colors[status] || colors.Pending}`}
                onClick={(e) => e.stopPropagation()}
            >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
            </select>
        );
    };

    if (loading) return <div className="flex justify-center p-10"><Loader /></div>;

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 self-start md:self-auto">Quotations</h2>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search QTN # or Client..." />
                    <div className="flex gap-4 w-full sm:w-auto justify-between sm:justify-start">
                        <ViewToggle view={view} setView={setView} />
                        <button 
                            onClick={() => navigate('/admin/create-quotation')}
                            className="bg-[#002D5B] text-white px-4 py-2 rounded hover:bg-[#001f3f] transition whitespace-nowrap font-medium"
                        >
                            + Create Quotation
                        </button>
                    </div>
                </div>
            </div>

            {view === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuotations.map((quotation) => (
                         <div 
                            key={quotation._id} 
                            className="bg-white p-5 rounded-lg shadow border border-gray-100 hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{quotation.quotationNumber}</h3>
                                    <p className="text-sm text-gray-500">{new Date(quotation.date).toLocaleDateString()}</p>
                                </div>
                                <StatusBadge status={quotation.status} id={quotation._id} />
                            </div>
                            <p className="text-gray-700 font-medium mb-1">{quotation.clientName}</p>
                            <p className="text-2xl font-bold text-[#8B0000] mb-4">₹{quotation.grandTotal?.toFixed(2)}</p>
                            
                            <div className="flex gap-2 border-t pt-3" onClick={(e) => e.stopPropagation()}>
                                {quotation.status === 'Accepted' && (
                                    <button 
                                        onClick={() => handleGenerateInvoice(quotation)}
                                        className="flex-1 bg-green-50 text-green-700 py-2 rounded text-sm font-medium hover:bg-green-100 transition whitespace-nowrap"
                                    >
                                        Gen Invoice
                                    </button>
                                )}
                                <div className="flex-1" />
                                <button 
                                    onClick={() => handleDelete(quotation._id)}
                                    className="px-3 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                                >
                                    Delete
                                </button>
                            </div>
                         </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QTN #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredQuotations.map((quotation) => (
                                <tr key={quotation._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quotation.quotationNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quotation.clientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(quotation.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={quotation.status} id={quotation._id} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#8B0000]">₹{quotation.grandTotal?.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3 items-center">
                                        {quotation.status === 'Accepted' && (
                                            <button 
                                                onClick={() => handleGenerateInvoice(quotation)}
                                                className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded hover:bg-green-100 transition font-bold"
                                            >
                                                Generate Invoice
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDelete(quotation._id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Delete"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredQuotations.length === 0 && (
                         <div className="p-6 text-center text-gray-500">No quotations found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuotationList;
