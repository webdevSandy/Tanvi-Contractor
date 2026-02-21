import React, { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import InvoiceTemplate from './InvoiceTemplate';

const InvoiceDetailModal = ({ isOpen, onClose, invoice, onUpdate }) => {
    const [updating, setUpdating] = useState(false);
    const printRef = React.useRef(null);
    const [contactInfo, setContactInfo] = useState(null);

    React.useEffect(() => {
        if (!isOpen) return;
        const fetchContact = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/company-contact`);
                setContactInfo(response.data);
            } catch (err) {
                console.error("Failed to fetch contact details for PDF");
            }
        };
        fetchContact();
    }, [isOpen]);

    if (!isOpen || !invoice) return null;

    const handleStatusChange = async (newStatus) => {
        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(
                `${process.env.REACT_APP_API_URL}/invoices/${invoice._id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (onUpdate) onUpdate(res.data);
            onClose();
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setUpdating(false);
        }
    };

    const handleDownload = async () => {
        try {
            const element = printRef.current;
            const opt = {
                margin:       0,
                filename:     `invoice_${invoice.invoiceNumber}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            
            html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("Download failed", error);
            alert("Error downloading PDF");
        }
    };

    const statusColors = {
        Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Paid: 'bg-green-100 text-green-800 border-green-200',
        Overdue: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                {/* Modal panel */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Invoice Details
                                </h3>
                                <div className="mt-4 space-y-3">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Invoice No:</span>
                                        <span className="font-semibold">{invoice.invoiceNumber}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Client:</span>
                                        <span className="font-semibold">{invoice.clientName}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Date:</span>
                                        <span className="font-semibold">{new Date(invoice.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Amount:</span>
                                        <span className="font-bold text-lg">₹{invoice.grandTotal?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-500">Current Status:</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[invoice.status] || 'bg-gray-100 text-gray-800'}`}>
                                            {invoice.status || 'Pending'}
                                        </span>
                                    </div>
                                    
                                    <div className="pt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                                        <div className="flex space-x-2">
                                            {['Pending', 'Paid', 'Overdue'].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusChange(status)}
                                                    disabled={updating || invoice.status === status}
                                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
                                                        ${invoice.status === status 
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                            : status === 'Paid' ? 'bg-green-600 text-white hover:bg-green-700'
                                                            : status === 'Overdue' ? 'bg-red-600 text-white hover:bg-red-700'
                                                            : 'bg-yellow-500 text-white hover:bg-yellow-600'
                                                        }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={handleDownload}
                        >
                            Download PDF
                        </button>
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
                
                {/* Hidden container for PDF Generation */}
                <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                    <InvoiceTemplate ref={printRef} invoice={invoice} contact={contactInfo} />
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailModal;
