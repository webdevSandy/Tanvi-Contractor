import React from 'react';

const InvoicePreview = ({ data }) => {
  return (
    <div className="text-sm border p-4 mb-4">
      <img src="/header.jpg" alt="Tanvi Contractor" className="mb-4 w-full" />
      <div className='flex justify-between mb-28'>
          <div><strong>Invoice No:</strong> {data.invoiceNo}</div>
        <div><strong>Invoice Date:</strong> {data.invoiceDate}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div><strong>Consignee:</strong> {data.consignee}</div>
        <div><strong>Vendor Code:</strong> {data.vendorCode}</div>
        <div><strong>Order No:</strong> {data.orderNo}</div>
        <div><strong>Order Date:</strong> {data.orderDate}</div>
        <div><strong>OFFICIAL OTHER THAN CONSIGNEE:</strong> {data.official}</div>
      </div>

    </div>
  );
};

export default InvoicePreview;
