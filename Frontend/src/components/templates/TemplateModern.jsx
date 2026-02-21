import React, { forwardRef } from 'react';

const TemplateModern = forwardRef(({ invoice, displayContact }, ref) => {
    return (
        <div ref={ref} className="w-[210mm] min-h-[295mm] box-border p-8 m-0 text-[13px] text-slate-800 bg-[#f8fafc] relative font-sans [&_*]:[print-color-adjust:exact] [&_*]:[-webkit-print-color-adjust:exact]">
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');`}
            </style>

            <div className="modern-wrapper font-['Outfit',sans-serif]">
                
                {/* Header Section (Dark Slate) */}
                <div className="bg-[#1e293b] rounded-2xl p-8 mb-8 text-white flex justify-between items-center shadow-lg">
                    
                    {/* Left: Brand Identity */}
                    <div>
                        <h1 className="text-3xl font-bold text-white m-0 mb-2 tracking-tight flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full bg-white text-[#1e293b] flex items-center justify-center text-lg font-black">
                                TN
                            </span>
                            TANVI CONTRACTOR
                        </h1>
                        <p className="text-slate-300 text-[12px] m-0 leading-relaxed max-w-[300px] opacity-90">
                            Khasra No. 219, Eklashpura Chakbandi Kshetra, ORAI-285001 (Jalaun) U.P.
                        </p>
                    </div>

                    {/* Right: Invoice Details */}
                    <div className="text-right">
                        <div className="text-emerald-400 font-bold text-xl tracking-widest uppercase mb-4 opacity-90">
                            INVOICE
                        </div>
                        <div className="flex gap-6 text-right justify-end">
                            <div>
                                <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">No.</div>
                                <div className="text-lg font-semibold text-white">{invoice.invoiceNumber}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Date</div>
                                <div className="text-lg font-semibold text-white">{new Date(invoice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3-Column Info Array */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    {/* Bill To */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Billed To</div>
                        <div className="font-bold text-slate-800 text-[14px] mb-1">{invoice.consignee?.name || invoice.clientName}</div>
                        <div className="text-slate-500 text-[12px] leading-snug">{invoice.consignee?.address || invoice.clientAddress}</div>
                        {invoice.consignee?.gstin && (
                            <div className="mt-3 text-[11px] bg-slate-50 inline-block px-2 py-1 rounded text-slate-600 border border-slate-100">
                                GSTIN: <span className="font-bold text-slate-800">{invoice.consignee.gstin}</span>
                            </div>
                        )}
                    </div>

                    {/* Company Tax Info */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Our Tax Info</div>
                        <div className="mb-2">
                            <span className="text-slate-500 text-[12px] block">GSTIN</span>
                            <span className="font-bold text-slate-800 text-[14px]">{displayContact.gstin}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 text-[12px] block">PAN</span>
                            <span className="font-bold text-slate-800 text-[14px]">{displayContact.pan}</span>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Order Details</div>
                        <div className="grid grid-cols-2 gap-y-2 text-[12px]">
                            <span className="text-slate-500">Vendor:</span>
                            <span className="font-bold text-slate-800 text-right">{invoice.vendorCode || '1006395'}</span>
                            
                            <span className="text-slate-500">Order No:</span>
                            <span className="font-bold text-slate-800 text-right">{invoice.orderNo || 'N/A'}</span>
                            
                            <span className="text-slate-500">Order Date:</span>
                            <span className="font-bold text-slate-800 text-right">{invoice.orderDate ? new Date(invoice.orderDate).toLocaleDateString('en-GB') : '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Modern List Items */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-[5%]">#</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-[50%]">Item</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center w-[12%]">Qty</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right w-[15%]">Rate</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right w-[18%]">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items?.map((item, index) => (
                                <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-6 text-slate-400 font-medium">{index + 1}</td>
                                    <td className="py-4 px-6 font-medium text-slate-800">{item.description}</td>
                                    <td className="py-4 px-6 text-slate-600 text-center">
                                        <span className="font-bold text-slate-800 mr-1">{item.quantity}</span> 
                                        <span className="text-[11px] text-slate-400">{item.unit || 'NOS'}</span>
                                    </td>
                                    <td className="py-4 px-6 text-slate-600 text-right">₹{Number(item.rate).toFixed(2)}</td>
                                    <td className="py-4 px-6 font-bold text-slate-900 text-right">₹{Number(item.amount).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Bottom Row: Bank & Totals */}
                <div className="flex justify-between items-start gap-8">
                    
                    {/* Bank Details */}
                    <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <div className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">Payment Details</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-3 text-[13px]">
                            <div className="text-slate-500">Bank Name</div>
                            <div className="font-bold text-slate-800 text-right">{displayContact.bankName || invoice.accountDetails?.bankName}</div>
                            
                            <div className="text-slate-500">Account No.</div>
                            <div className="font-mono font-bold text-slate-800 text-right">{displayContact.accountNumber || invoice.accountDetails?.accountNumber}</div>
                            
                            <div className="text-slate-500">IFSC Code</div>
                            <div className="font-mono font-bold text-slate-800 text-right">{displayContact.ifscCode || invoice.accountDetails?.ifscCode}</div>
                        </div>
                    </div>

                    {/* Totals Box */}
                    <div className="w-[320px] bg-[#1e293b] rounded-xl p-6 shadow-lg text-white">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-slate-400 text-[13px]">Subtotal</span>
                            <span className="font-medium">₹{(invoice.totalAmount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-slate-400 text-[13px]">CGST (9%)</span>
                            <span className="text-slate-300">₹{((invoice.totalAmount || 0) * 0.09).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700/50">
                            <span className="text-slate-400 text-[13px]">SGST (9%)</span>
                            <span className="text-slate-300">₹{((invoice.totalAmount || 0) * 0.09).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-slate-300 text-[11px] uppercase tracking-wider mb-1">Grand Total</span>
                            <span className="text-2xl font-bold text-emerald-400">₹{(invoice.grandTotal || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="absolute bottom-8 left-8 right-8 text-center pt-6 border-t border-slate-200 text-slate-400 text-[11px]">
                    <p className="m-0 mb-1 font-medium text-slate-600">Thank you for your business.</p>
                    <p className="m-0">
                        {invoice.mobile || '8115747357'}  •  {invoice.email || 'tanvicontractor2022@gmail.com'}
                    </p>
                </div>

            </div>
        </div>
    );
});

export default TemplateModern;
