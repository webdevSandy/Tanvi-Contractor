import React from 'react';

const InvoiceTable = ({ item, contractNo, diNo, diDate }) => {
  const qty = parseFloat(item.qty || 0);
  const rate = parseFloat(item.rate || 0);
  const amount = qty * rate;
  const gstAmount = amount * 0.09;
  const total = amount + gstAmount * 2;

  return (
    <div className="text-sm border border-black">
      <table className="w-full border border-black text-left border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">Sr.</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">QTY</th>
            <th className="border px-2 py-1">Rate</th>
            <th className="border px-2 py-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-1">1</td>
            <td className="border px-2 py-1">{item.description}</td>
            <td className="border px-2 py-1">{item.qty}</td>
            <td className="border px-2 py-1">{item.rate}</td>
            <td className="border px-2 py-1">{amount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div className="grid grid-cols-2 border-t">
        <div className="p-2 space-y-1">
          <div><strong>Contract No:</strong> {contractNo}</div>
          <div><strong>DI No:</strong> {diNo}</div>
          <div><strong>DI Date:</strong> {diDate}</div>
        </div>
        <div className="p-2 border-l">
          <div className="flex justify-between"><span>TOTAL</span><span>{amount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Add C GST @ 9%</span><span>{gstAmount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Add S GST @ 9%</span><span>{gstAmount.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold"><span>Total Invoice Value</span><span>{total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;
