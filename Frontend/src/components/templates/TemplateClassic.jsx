import React, { forwardRef } from 'react';

const TemplateClassic = forwardRef(({ invoice, displayContact }, ref) => {
    // Basic calculations
    const cgstObj = invoice.taxDetails?.find(t => t.type === 'CGST') || { rate: 9, amount: ((invoice.totalAmount || 0) * 0.09) };
    const sgstObj = invoice.taxDetails?.find(t => t.type === 'SGST') || { rate: 9, amount: ((invoice.totalAmount || 0) * 0.09) };

    return (
        <div ref={ref} className="px-10 py-[30px] m-0 text-[13px] text-black bg-white w-[210mm] min-h-[295mm] box-border relative [&_*]:[print-color-adjust:exact] [&_*]:[-webkit-print-color-adjust:exact]">

            <div className="w-full">
                <div className="w-full mb-1">
                    <div className="">
                        <div className="bg-[#8B0000] text-white font-bold text-base  flex justify-center items-center w-fit mx-auto px-4 pb-3 rounded-md">
                            <span>  
                                TAX INVOICE
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between font-bold text-[12px] mt-6">
                        <div>
                            GSTIN : {displayContact.gstin}<br/>
                            PAN No. : {displayContact.pan}
                        </div>
                        <div className="text-right">
                            Mob. : {invoice.mobile || '8115747357'}<br/>
                            Email Id: {invoice.email || 'tanvicontractor2022@gmail.com'}
                        </div>
                    </div>

                    <div className="flex items-centerjustify-start mt-2 mb-10">
                        <div className="w-[80px] h-[80px] border-[3px] border-[#8B0000] rounded-full flex items-center justify-center mr-[20px] shadow-[inset_0_0_0_2px_#fff,inset_0_0_0_3px_#8b0000] relative shrink-0">
                            <div className="font-['Times_New_Roman',serif] text-[40px] font-bold text-black relative leading-none after:content-[''] after:absolute after:w-[120%] after:h-[3px] after:bg-[#8B0000] after:top-1/2 after:-left-[10%] after:z-10">
                                <span className="relative left-1 z-0">T</span>
                                <span className="relative -left-1 text-[#8B0000] z-20">N</span>
                            </div>
                        </div>
                        <div className="font-serif text-[48px] text-[#8B0000] uppercase tracking-normal font-black italic drop-shadow-md leading-none" style={{ WebkitTextStroke: '1px white', textShadow: '2px 2px 4px rgba(0,0,0,0.4)' }}>
                            TANVI CONTRACTOR
                        </div>
                    </div>
                </div>

                <div className="bg-[#8B0000] text-white text-center pb-4 font-bold text-[13px] w-full mb-6 uppercase tracking-wide">
                    Khasra No. 219, Eklashpura Chakbandi Kshetra, ORAI-285001 (Jalaun) U.P.
                </div>

                <div className="flex justify-between font-bold text-[14px] mb-6">
                    <span>INVOICE No:- {invoice.invoiceNumber}</span>
                    <span>INVOICE Date:- {new Date(invoice.date).toLocaleDateString('en-GB')}</span>
                </div>

                {/* Info Table (Top Half) */}
                <table className="w-full border-collapse border border-black text-[12px] border-b-0">
                    <tbody>
                        <tr>
                            <td className="border border-black p-0 w-1/2 align-middle leading-snug text-black">
                                <div className="px-2 py-[5px] border-b border-black">
                                    <span className="font-bold uppercase">CONSIGNEE</span><br/>
                                    {invoice.consignee?.name || invoice.clientName || 'EXCUTIVE ENGINEER'}<br/>
                                    {invoice.consignee?.address || invoice.clientAddress || '400 KV S/S Division UPPTCL ORAI JALAUN (UP)- Pin 285202'}<br/>
                                    GSTIN {invoice.consignee?.gstin || '09AAACU8823E1Z9'}
                                </div>
                                <div className="px-2 py-[5px]">
                                    <span className="font-bold uppercase">OFFICIAL OTHER THAN CONSIGNEE</span><br/>
                                    EXCUTIVE ENGINEER<br/>
                                    400 KV S/S Division UPPTCL ORAI JALAUN (UP)-<br/>
                                    Pin 285202
                                </div>
                            </td>
                            <td className="border border-black p-0 w-1/2 align-middle leading-snug text-black">
                                <div className="px-2 py-[5px] border-b border-black">
                                    <span className="font-bold uppercase">VENDER CODE:- {invoice.vendorCode || '1006395'}</span>
                                </div>
                                <div className="px-2 py-[5px] border-b border-black">
                                    <strong>ORDER. No:-</strong> {invoice.orderNo || '31/SDO 400KV S/S ORAI'}<br/>
                                    <strong>ORDER Date:-</strong> {invoice.orderDate ? new Date(invoice.orderDate).toLocaleDateString('en-GB') : '-'}
                                </div>

                                {/* Account Details */}
                                <div className="px-2 py-[5px] pb-4">
                                    <span className="font-bold uppercase">ACCOUNT DETAIL -</span><br/>
                                    <strong>A/C No. -</strong> {displayContact.accountNumber || invoice.accountDetails?.accountNumber || '7638335079'}<br/>
                                    <strong>IFSC Code -</strong> {displayContact.ifscCode || invoice.accountDetails?.ifscCode || 'IDIB000O029'}<br/>
                                    <strong>Bank Name :</strong> {displayContact.bankName || invoice.accountDetails?.bankName || 'Indian Bank'}<br/>
                                    <strong>Address :</strong> Kalpi Bus Stand Orai
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Items and Totals Table (Bottom Half) */}
                <table className="w-full border-collapse border border-black text-[12px] border-t-0">
                    <thead>
                        <tr>
                            <th className="border border-black px-2 py-2 text-black font-bold text-left align-middle bg-[#f5f5f5] w-[5%]">Sr.</th>
                            <th className="border border-black px-2 py-2 text-black font-bold text-left align-middle bg-[#f5f5f5] w-[55%]">Description</th>
                            <th className="border border-black px-2 py-2 text-black font-bold text-left align-middle bg-[#f5f5f5] w-[15%]">QTY</th>
                            <th className="border border-black px-2 py-2 text-black font-bold text-left align-middle bg-[#f5f5f5] w-[10%]">Rate</th>
                            <th className="border border-black px-2 py-2 text-black font-bold text-left align-middle bg-[#f5f5f5] w-[15%]">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items?.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-black px-2 py-3 text-black text-left align-middle border-b-0">{index + 1}</td>
                                <td className="border border-black px-2 py-3 text-black text-left align-middle border-b-0 leading-snug">{item.description}</td>
                                <td className="border border-black px-2 py-3 text-black text-left align-middle border-b-0">{item.quantity} {item.unit || 'NOS'}</td>
                                <td className="border border-black px-2 py-3 text-black text-left align-middle border-b-0">{Number(item.rate).toFixed(2)}</td>
                                <td className="border border-black px-2 py-3 text-black text-left align-middle border-b-0">{Number(item.amount).toFixed(2)}</td>
                            </tr>
                        ))}
                        {/* Spacing filler row to push totals down and match layout */}
                        <tr className="h-[60px]">
                            <td className="border border-black text-black border-t-0 border-b-0"></td>
                            <td className="border border-black text-black border-t-0 border-b-0"></td>
                            <td className="border border-black text-black border-t-0 border-b-0"></td>
                            <td className="border border-black text-black border-t-0 border-b-0"></td>
                            <td className="border border-black text-black border-t-0 border-b-0"></td>
                        </tr>

                        {/* Calculation Rows */}
                        <tr>
                            <td colSpan="2" className="border border-black px-2 py-2 text-black align-middle"></td>
                            <td colSpan="2" className="border border-black px-2 py-2 text-black text-left align-middle font-bold">TOTAL</td>
                            <td className="border border-black px-2 py-2 text-black text-left align-middle font-bold">{(invoice.totalAmount || 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="border border-black px-2 py-2 text-black font-bold align-middle">Contract No:- {invoice.contractNo || '4200063452'}</td>
                            <td colSpan="2" className="border border-black px-2 py-2 text-black text-left align-middle">Add C GST @ {cgstObj.rate}%</td>
                            <td className="border border-black px-2 py-2 text-black text-left align-middle">{Number(cgstObj.amount).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="border border-black px-2 py-2 text-black font-bold align-middle">DI No:- {invoice.diNo || '5200065362'}</td>
                            <td colSpan="2" className="border border-black px-2 py-2 text-black text-left align-middle">Add S GST @ {sgstObj.rate}%</td>
                            <td className="border border-black px-2 py-2 text-black text-left align-middle">{Number(sgstObj.amount).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="border border-black px-2 py-2 text-black font-bold align-middle">DI Date:- {invoice.diDate ? new Date(invoice.diDate).toLocaleDateString('en-GB') : '-'}</td>
                            <td colSpan="2" className="border border-black px-2 py-2 text-black text-left align-middle font-bold">Total Invoice Value</td>
                            <td className="border border-black px-2 py-2 text-black text-left align-middle font-bold">{(invoice.grandTotal || 0).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
             {/* Footer Notes */}
                <div className="absolute bottom-5 left-10 right-10 text-center pt-2 border-t border-slate-200 text-slate-500 text-[11px]">
                    <p className="m-0 mb-1 font-semibold text-slate-900">Thank you for your business!</p>
                    <p className="m-0">
                        If you have any questions about this invoice, please contact<br/>
                        {invoice.mobile || '8115747357'} | {invoice.email || 'tanvicontractor2022@gmail.com'}
                    </p>
                </div>
        </div>
    );
});

export default TemplateClassic;
