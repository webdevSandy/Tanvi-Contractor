import React from 'react';
import { useInvoice } from '../context/InvoiceContext';
import InvoicePreview from '../components/InvoicePreview';
import InvoiceTable from '../components/InvoiceTable';

const InvoicePage = () => {
  const { invoiceData } = useInvoice();
  const item = {
    description: invoiceData.description,
    qty: '',
    rate: ''
  };

  return (
    <div className="p- max-w-5xl mx-auto">
      <InvoicePreview data={invoiceData} />
      <InvoiceTable
        item={item}
        contractNo={invoiceData.contractNo}
        diNo={invoiceData.diNo}
        diDate={invoiceData.diDate}
      />
    </div>
  );
};

export default InvoicePage;
