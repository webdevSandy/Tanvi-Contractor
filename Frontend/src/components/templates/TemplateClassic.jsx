import React, { forwardRef } from 'react';

const TemplateClassic = forwardRef(({ invoice, displayContact }, ref) => {
    // Basic calculations
    const cgstObj = invoice.taxDetails?.find(t => t.type === 'CGST') || { rate: 9, amount: ((invoice.totalAmount || 0) * 0.09) };
    const sgstObj = invoice.taxDetails?.find(t => t.type === 'SGST') || { rate: 9, amount: ((invoice.totalAmount || 0) * 0.09) };

    return (
        <div ref={ref} className="font-['Times_New_Roman',_Times,_serif] px-10 py-[30px] m-0 text-[13px] text-black bg-white w-[210mm] min-h-[295mm] box-border relative [&_*]:[print-color-adjust:exact] [&_*]:[-webkit-print-color-adjust:exact]">
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');`}
            </style>

            <div className="w-full">
                <div className="w-full mb-1">
                    <div className="">
                        <div className="bg-[#8B0000] text-white font-bold text-lg flex justify-center items-center w-fit mx-auto px-2 py-1 rounded-md">
                            TAX INVOICE
                        </div>
                    </div>

                    <div className="flex justify-between font-bold text-[12px] -mb-1">
                        <div>
                            GSTIN : {displayContact.gstin}<br/>
                            PAN No. : {displayContact.pan}
                        </div>
                        <div className="text-right">
                            Mob. : {invoice.mobile || '8115747357'}<br/>
                            Email Id: {invoice.email || 'tanvicontractor2022@gmail.com'}
                        </div>
                    </div>

                    <div className="flex items-end justify-start mt-5 mb-2.5">
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

                <div className="bg-[#8B0000] text-white text-center py-2 font-bold text-[13px] w-full mb-6 uppercase tracking-wide">
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
                            <td className="border border-black p-0 w-1/2 align-top leading-snug text-black">
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
                            <td className="border border-black p-0 w-1/2 align-top leading-snug text-black">
                                <div className="px-2 py-[5px] border-b border-black">
                                    <span className="font-bold uppercase">VENDER CODE:- {invoice.vendorCode || '1006395'}</span>
                                </div>
                                <div className="px-2 py-[5px] border-b border-black">
                                    <strong>ORDER. No:-</strong> {invoice.orderNo || '31/SDO 400KV S/S ORAI'}<br/>
                                    <strong>ORDER Date:-</strong> {invoice.orderDate ? new Date(invoice.orderDate).toLocaleDateString('en-GB') : '-'}
                                </div>
                                <div className="px-2 py-[5px]">
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
                            <th className="border border-black px-2 py-1 text-black font-bold text-center bg-[#f5f5f5] w-[5%]">Sr.</th>
                            <th className="border border-black px-2 py-1 text-black font-bold text-left bg-[#f5f5f5] w-[55%]">Description</th>
                            <th className="border border-black px-2 py-1 text-black font-bold text-right bg-[#f5f5f5] w-[15%]">QTY</th>
                            <th className="border border-black px-2 py-1 text-black font-bold text-right bg-[#f5f5f5] w-[10%]">Rate</th>
                            <th className="border border-black px-2 py-1 text-black font-bold text-right bg-[#f5f5f5] w-[15%]">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items?.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-black px-2 text-black text-center align-top border-b-0 py-2">{index + 1}</td>
                                <td className="border border-black px-2 text-black text-left align-top border-b-0 py-2 leading-snug">{item.description}</td>
                                <td className="border border-black px-2 text-black text-right align-top border-b-0 py-2">{item.quantity} {item.unit || 'NOS'}</td>
                                <td className="border border-black px-2 text-black text-right align-top border-b-0 py-2">{Number(item.rate).toFixed(2)}</td>
                                <td className="border border-black px-2 text-black text-right align-top border-b-0 py-2">{Number(item.amount).toFixed(2)}</td>
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
                            <td colSpan="2" className="border border-black px-2 py-1 text-black"></td>
                            <td colSpan="2" className="border border-black px-2 py-1 text-black text-right font-bold">TOTAL</td>
                            <td className="border border-black px-2 py-1 text-black text-right font-bold">{(invoice.totalAmount || 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="border border-black px-2 py-1 text-black font-bold">Contract No:- {invoice.contractNo || '4200063452'}</td>
                            <td colSpan="2" className="border border-black px-2 py-1 text-black text-right">Add C GST @ {cgstObj.rate}%</td>
                            <td className="border border-black px-2 py-1 text-black text-right">{Number(cgstObj.amount).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="border border-black px-2 py-1 text-black font-bold">DI No:- {invoice.diNo || '5200065362'}</td>
                            <td colSpan="2" className="border border-black px-2 py-1 text-black text-right">Add S GST @ {sgstObj.rate}%</td>
                            <td className="border border-black px-2 py-1 text-black text-right">{Number(sgstObj.amount).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="border border-black px-2 py-1 text-black font-bold">DI Date:- {invoice.diDate ? new Date(invoice.diDate).toLocaleDateString('en-GB') : '-'}</td>
                            <td colSpan="2" className="border border-black px-2 py-1 text-black text-right font-bold">Total Invoice Value</td>
                            <td className="border border-black px-2 py-1 text-black text-right font-bold">{(invoice.grandTotal || 0).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
});

export default TemplateClassic;
