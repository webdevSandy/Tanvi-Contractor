import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SearchBar, ViewToggle, Modal } from '../components/AdminComponents'; // Added Modal import

const InvoiceList = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    // Default to card view on mobile (< 768px), list view on desktop
    const [view, setView] = useState(window.innerWidth < 768 ? 'card' : 'list');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Preview State
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentInvoiceNum, setCurrentInvoiceNum] = useState('');

    const fetchInvoices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/invoices`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInvoices(response.data);
            setFilteredInvoices(response.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        setFilteredInvoices(invoices.filter(inv => 
            inv.invoiceNumber.toLowerCase().includes(lowerTerm) ||
            inv.clientName.toLowerCase().includes(lowerTerm)
        ));
    }, [searchTerm, invoices]);

    const handleDownload = async (id, invoiceNumber) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/invoices/${id}/pdf`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `invoice_${invoiceNumber}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    };

    const handlePreview = async (id, invoiceNumber) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/invoices/${id}/pdf`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                setPreviewUrl(url);
                setCurrentInvoiceNum(invoiceNumber);
                setIsPreviewOpen(true);
            }
        } catch (error) {
            console.error('Error fetching PDF for preview:', error);
            alert('Could not load preview');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this invoice?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API_URL}/invoices/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchInvoices();
        } catch (error) {
            console.error(error);
            alert('Failed to delete invoice');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 self-start md:self-auto">Saved Invoices</h2>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Invoice # or Client..." />
                    <div className="flex gap-4 w-full sm:w-auto justify-between sm:justify-start">
                        <ViewToggle view={view} setView={setView} />
                        <button 
                            onClick={() => navigate('/admin/create-invoice')}
                            className="bg-[#002D5B] text-white px-4 py-2 rounded hover:bg-[#001f3f] transition whitespace-nowrap font-medium"
                        >
                            + Create Invoice
                        </button>
                    </div>
                </div>
            </div>

            {view === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInvoices.map((invoice) => (
                         <div key={invoice._id} className="bg-white p-5 rounded-lg shadow border border-gray-100 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{invoice.invoiceNumber}</h3>
                                    <p className="text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString()}</p>
                                </div>
                                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Paid</span>
                            </div>
                            <p className="text-gray-700 font-medium mb-1">{invoice.clientName}</p>
                            <p className="text-2xl font-bold text-[#8B0000] mb-4">₹{invoice.grandTotal.toFixed(2)}</p>
                            
                            <div className="flex gap-2 border-t pt-3">
                                <button 
                                    onClick={() => handlePreview(invoice._id, invoice.invoiceNumber)}
                                    className="bg-blue-50 text-blue-600 p-2 rounded hover:bg-blue-100 transition"
                                    title="Preview Invoice"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => handleDownload(invoice._id, invoice.invoiceNumber)}
                                    className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded text-sm font-medium hover:bg-indigo-100 transition"
                                >
                                    Download
                                </button>
                                <button 
                                    onClick={() => handleDelete(invoice._id)}
                                    className="px-3 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.clientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#8B0000]">₹{invoice.grandTotal.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                                        <button 
                                            onClick={() => handlePreview(invoice._id, invoice.invoiceNumber)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="Preview"
                                        >
                                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDownload(invoice._id, invoice.invoiceNumber)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                            title="Download PDF"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(invoice._id)}
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
                    {filteredInvoices.length === 0 && (
                         <div className="p-6 text-center text-gray-500">No invoices found.</div>
                    )}
                </div>
            )}

            <Modal 
                isOpen={isPreviewOpen} 
                onClose={() => setIsPreviewOpen(false)} 
                title={`Preview: ${currentInvoiceNum}`}
                maxWidth="max-w-4xl" // Wider modal for PDF preview
            >
                {previewUrl ? (
                    <iframe 
                        src={previewUrl} 
                        className="w-full h-[75vh] border-none rounded"
                        title="Invoice Preview"
                    />
                ) : (
                    <div className="flex justify-center items-center h-64">
                        <p>Loading Preview...</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default InvoiceList;
