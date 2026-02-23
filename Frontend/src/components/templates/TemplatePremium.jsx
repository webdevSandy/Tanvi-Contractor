import React, { forwardRef } from 'react';

const TemplatePremium = forwardRef(({ invoice, displayContact }, ref) => {
    return (
        <div ref={ref} className="w-[210mm] min-h-[295mm] box-border p-10 m-0 text-[13px] text-slate-800 bg-white relative font-sans [&_*]:[print-color-adjust:exact] [&_*]:[-webkit-print-color-adjust:exact]">

            <div className="invoice-template-wrapper font-['Inter',sans-serif]">
                
                {/* Header Section */}
                <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6">
                    
                    {/* Left: Brand Identity */}
                    <div>
                        <div className="w-[70px] h-[70px] rounded-xl bg-gradient-to-br from-[#8B0000] to-[#4a0000] text-white flex items-center justify-center text-3xl font-bold shadow-md mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                            TN
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 m-0 mb-1 tracking-tight">
                            TANVI CONTRACTOR
                        </h1>
                        <p className="text-slate-500 text-[11px] m-0 leading-relaxed max-w-[250px]">
                            Khasra No. 219, Eklashpura Chakbandi Kshetra,<br/>
                            ORAI-285001 (Jalaun) U.P.
                        </p>
                        <div className="text-[11px] font-semibold text-slate-900 mt-2.5">
                            GSTIN: <span className="text-[#8B0000] font-bold">{displayContact.gstin}</span><br/>
                            PAN No: <span className="text-[#8B0000] font-bold">{displayContact.pan}</span>
                        </div>
                    </div>

                    {/* Right: Invoice Details */}
                    <div className="text-right">
                        <div className="bg-slate-100 border-l-4 border-[#8B0000] text-slate-900 px-4 py-2 font-bold text-lg tracking-wide uppercase inline-block mb-5">
                            Tax Invoice
                        </div>
                        
                        <div className="mb-4">
                            <div className="text-slate-500 text-[11px] uppercase pb-1">Invoice Number</div>
                            <div className="text-base font-bold text-slate-900">{invoice.invoiceNumber}</div>
                        </div>
                        
                        <div>
                            <div className="text-slate-500 text-[11px] uppercase pb-1">Date of Issue</div>
                            <div className="font-semibold text-slate-900">{new Date(invoice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        </div>
                    </div>
                </div>

                {/* Information Grid: Bill To, Order Details, Bank */}
                <div className="grid grid-cols-2 gap-5 mt-8 mb-8">
                    
                    {/* Consignee */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <h4 className="m-0 mb-2.5 text-[#8B0000] text-[11px] uppercase tracking-wide border-b border-slate-200 pb-1.5">
                            Billed To (Consignee)
                        </h4>
                        <div className="font-bold text-slate-900 text-[13px] mb-1">
                            {invoice.consignee?.name || invoice.clientName}
                        </div>
                        <div className="text-slate-500 text-[11px] leading-snug mb-2">
                            {invoice.consignee?.address || invoice.clientAddress}
                        </div>
                        {invoice.consignee?.gstin && (
                            <div className="text-[11px]">
                                <span className="text-slate-500">GSTIN:</span> <span className="font-semibold text-slate-900">{invoice.consignee.gstin}</span>
                            </div>
                        )}
                        <div className="text-[11px] mt-2.5">
                            <span className="text-slate-500 font-bold block text-[10px]">OFFICIAL OTHER THAN CONSIGNEE</span>
                            EXCUTIVE ENGINEER, 400 KV S/S Division<br/>
                            UPPTCL ORAI JALAUN (UP) - 285202
                        </div>
                    </div>

                    {/* Order & Bank Details */}
                    <div className="flex flex-col gap-5">
                        <div className="bg-white border-l-4 border-slate-300 p-3 px-4 shadow-sm border-y border-r border-slate-100 rounded-r-lg">
                            <div className="flex justify-between mb-1 text-[11px]">
                                <span className="text-slate-500">Vendor Code:</span>
                                <span className="font-bold text-slate-900">{invoice.vendorCode || '1006395'}</span>
                            </div>
                            <div className="flex justify-between mb-1 text-[11px]">
                                <span className="text-slate-500">Order No:</span>
                                <span className="font-bold text-slate-900">{invoice.orderNo || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                                <span className="text-slate-500">Order Date:</span>
                                <span className="font-semibold text-slate-900">{invoice.orderDate ? new Date(invoice.orderDate).toLocaleDateString() : '-'}</span>
                            </div>
                        </div>

                        <div className="bg-white border-l-4 border-[#8B0000] p-3 px-4 shadow-sm border-y border-r border-slate-100 rounded-r-lg">
                            <h4 className="m-0 mb-1.5 text-[#8B0000] text-[11px] uppercase tracking-wide">
                                Payment Details
                            </h4>
                            <div className="flex justify-between mb-1 text-[11px]">
                                <span className="text-slate-500">Bank:</span>
                                <span className="font-semibold text-slate-900">{displayContact.bankName || invoice.accountDetails?.bankName}</span>
                            </div>
                            <div className="flex justify-between mb-1 text-[11px]">
                                <span className="text-slate-500">A/C No:</span>
                                <span className="font-bold text-slate-900">{displayContact.accountNumber || invoice.accountDetails?.accountNumber}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                                <span className="text-slate-500">IFSC:</span>
                                <span className="font-semibold text-slate-900">{displayContact.ifscCode || invoice.accountDetails?.ifscCode}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Items Table */}
                <table className="w-full border-collapse mb-8">
                    <thead>
                        <tr>
                            <th className="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold p-3 text-center border-b-2 border-slate-300 w-[5%]">#</th>
                            <th className="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold p-3 text-left border-b-2 border-slate-300 w-[50%]">Item Description</th>
                            <th className="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold p-3 text-center border-b-2 border-slate-300 w-[12%]">Qty</th>
                            <th className="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold p-3 text-right border-b-2 border-slate-300 w-[15%]">Rate</th>
                            <th className="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold p-3 text-right border-b-2 border-slate-300 w-[18%]">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items?.map((item, index) => (
                            <tr key={index} className="even:bg-slate-50">
                                <td className="p-3.5 border-b border-slate-200 text-slate-500 font-semibold text-center">{index + 1}</td>
                                <td className="p-3.5 border-b border-slate-200 text-slate-900 font-semibold text-left">{item.description}</td>
                                <td className="p-3.5 border-b border-slate-200 text-slate-900 text-center">{item.quantity} <span className="text-slate-500 text-[11px]">{item.unit || 'NOS'}</span></td>
                                <td className="p-3.5 border-b border-slate-200 text-slate-900 text-right">₹{Number(item.rate).toFixed(2)}</td>
                                <td className="p-3.5 border-b border-slate-200 text-slate-900 font-bold text-right">₹{Number(item.amount).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Additional Details & Totals */}
                <div className="flex justify-between items-start">
                    
                    {/* Contract Details (Left Side of Totals) */}
                    <div className="p-3 px-4 bg-slate-50 rounded-lg border border-slate-200 w-[280px]">
                        <div className="mb-2 text-[11px]">
                            <span className="text-slate-500 uppercase block text-[10px] mb-0.5">Contract No</span>
                            <span className="font-bold text-slate-900">{invoice.contractNo || '4200063452'}</span>
                        </div>
                        <div className="mb-2 text-[11px]">
                            <span className="text-slate-500 uppercase block text-[10px] mb-0.5">DI No</span>
                            <span className="font-bold text-slate-900">{invoice.diNo || '5200065362'}</span>
                        </div>
                        <div className="text-[11px]">
                            <span className="text-slate-500 uppercase block text-[10px] mb-0.5">DI Date</span>
                            <span className="font-semibold text-slate-900">{invoice.diDate ? new Date(invoice.diDate).toLocaleDateString() : '-'}</span>
                        </div>
                    </div>

                    {/* Totals Box */}
                    <div className="w-[350px] rounded-lg bg-slate-50 border border-slate-200 overflow-hidden">
                        <div className="flex justify-between p-2.5 px-4 border-b border-slate-200">
                            <span className="text-slate-500 font-semibold">Subtotal</span>
                            <span className="font-bold text-slate-900">₹{(invoice.totalAmount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between p-2.5 px-4 border-b border-slate-200">
                            <span className="text-slate-500">CGST (9%)</span>
                            <span>₹{((invoice.totalAmount || 0) * 0.09).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between p-2.5 px-4 border-b border-slate-200">
                            <span className="text-slate-500">SGST (9%)</span>
                            <span>₹{((invoice.totalAmount || 0) * 0.09).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between p-4 bg-[#8B0000] text-white text-base font-bold">
                            <span className="text-white">Grand Total</span>
                            <span className="text-white">₹{(invoice.grandTotal || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="absolute bottom-10 left-10 right-10 text-center pt-5 border-t border-slate-200 text-slate-500 text-[11px]">
                    <p className="m-0 mb-1 font-semibold text-slate-900">Thank you for your business!</p>
                    <p className="m-0">
                        If you have any questions about this invoice, please contact<br/>
                        {invoice.mobile || '8115747357'} | {invoice.email || 'tanvicontractor2022@gmail.com'}
                    </p>
                </div>

            </div>
        </div>
    );
});

export default TemplatePremium;
