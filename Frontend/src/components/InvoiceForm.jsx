import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InvoiceForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        invoiceNumber: `TC/24-25/${Math.floor(Math.random() * 1000)}`,
        date: new Date().toISOString().split('T')[0],
        clientName: '',
        clientAddress: '',
        consignee: { name: '', address: '', gstin: '' },
        vendorCode: '1006395',
        orderNo: '',
        orderDate: '',
        contractNo: '4200063452',
        diNo: '5200065362',
        diDate: '',
        accountDetails: {
            accountName: 'Indian Bank',
            accountNumber: '7638335079',
            ifscCode: 'IDIB000O029',
            bankName: 'Indian Bank',
            branch: 'Kalpi Bus Stand Orai'
        },
        items: [{ description: '', quantity: 1, rate: 0, amount: 0, unit: 'NOS' }]
    });

    const handleChange = (e, section = null) => {
        const { name, value } = e.target;
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...formData.items];
        newItems[index][name] = value;
        
        if (name === 'quantity' || name === 'rate') {
             newItems[index].amount = newItems[index].quantity * newItems[index].rate;
        }

        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0, unit: 'NOS' }]
        }));
    };

    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const calculateTotal = () => {
        return formData.items.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const totalAmount = calculateTotal();
        const cgst = totalAmount * 0.09;
        const sgst = totalAmount * 0.09;
        const grandTotal = totalAmount + cgst + sgst;

        const payload = {
            ...formData,
            items: formData.items,
            totalAmount,
            cgst,
            sgst,
            grandTotal
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/invoices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Invoice Created Successfully!');
                navigate('/admin/invoices');
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error(error);
            alert('Network Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-[#8B0000] border-b pb-2">Generate New Invoice</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Header Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Invoice No</label>
                        <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} className="w-full border p-2 rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Invoice Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border p-2 rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Vendor Code</label>
                        <input type="text" name="vendorCode" value={formData.vendorCode} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                </div>

                {/* Client Details */}
                <div className="bg-gray-50 p-4 rounded">
                   <h3 className="font-bold mb-2 text-gray-700">Client / Billed To Details</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                           <label className="block text-sm font-bold mb-1">Client Name</label>
                           <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} className="w-full border p-2 rounded" required />
                       </div>
                       <div>
                           <label className="block text-sm font-bold mb-1">Client Address</label>
                           <input type="text" name="clientAddress" value={formData.clientAddress} onChange={handleChange} className="w-full border p-2 rounded" required />
                       </div>
                   </div>
                </div>

                {/* Consignee & Order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded">
                    <div>
                        <h3 className="font-bold mb-2 text-gray-700">Consignee Details</h3>
                        <input placeholder="Name" name="name" value={formData.consignee.name} onChange={(e) => handleChange(e, 'consignee')} className="w-full border p-2 rounded mb-2" />
                        <textarea placeholder="Address" name="address" value={formData.consignee.address} onChange={(e) => handleChange(e, 'consignee')} className="w-full border p-2 rounded mb-2 h-20"></textarea>
                        <input placeholder="GSTIN" name="gstin" value={formData.consignee.gstin} onChange={(e) => handleChange(e, 'consignee')} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <h3 className="font-bold mb-2 text-gray-700">Order & DI Details</h3>
                        <input placeholder="Order No" name="orderNo" value={formData.orderNo} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
                        <input type="date" placeholder="Order Date" name="orderDate" value={formData.orderDate} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
                        <input placeholder="Contract No" name="contractNo" value={formData.contractNo} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
                        <div className="flex gap-2">
                             <input placeholder="DI No" name="diNo" value={formData.diNo} onChange={handleChange} className="w-full border p-2 rounded" />
                             <input type="date" name="diDate" value={formData.diDate} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div>
                    <h3 className="font-bold mb-2 text-gray-700">Items</h3>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Description</th>
                                <th className="border p-2 w-20">Qty</th>
                                <th className="border p-2 w-20">Unit</th>
                                <th className="border p-2 w-32">Rate</th>
                                <th className="border p-2 w-32">Amount</th>
                                <th className="border p-2 w-16">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="border p-2">
                                        <input type="text" name="description" value={item.description} onChange={(e) => handleItemChange(index, e)} className="w-full p-1 outline-none" placeholder="Item Description" required />
                                    </td>
                                    <td className="border p-2">
                                        <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} className="w-full p-1 outline-none" min="1" required />
                                    </td>
                                    <td className="border p-2">
                                        <input type="text" name="unit" value={item.unit} onChange={(e) => handleItemChange(index, e)} className="w-full p-1 outline-none" />
                                    </td>
                                    <td className="border p-2">
                                        <input type="number" name="rate" value={item.rate} onChange={(e) => handleItemChange(index, e)} className="w-full p-1 outline-none" min="0" required />
                                    </td>
                                    <td className="border p-2 bg-gray-50 text-right font-mono">
                                        {item.amount.toFixed(2)}
                                    </td>
                                    <td className="border p-2 text-center">
                                        {formData.items.length > 1 && (
                                            <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">✕</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="button" onClick={addItem} className="mt-2 text-blue-600 hover:underline">+ Add Item</button>
                </div>

                {/* Footer Totals */}
                <div className="flex justify-end">
                    <div className="w-64 bg-gray-50 p-4 rounded">
                        <div className="flex justify-between mb-1">
                            <span>Subtotal:</span>
                            <span>{calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-1 text-sm text-gray-600">
                            <span>CGST (9%):</span>
                            <span>{(calculateTotal() * 0.09).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-1 text-sm text-gray-600">
                            <span>SGST (9%):</span>
                            <span>{(calculateTotal() * 0.09).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                            <span>Grand Total:</span>
                            <span>{(calculateTotal() * 1.18).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/admin/invoices')} className="px-6 py-2 border rounded hover:bg-gray-100">Cancel</button>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-[#8B0000] text-white rounded hover:bg-[#660000] disabled:opacity-50">
                        {loading ? 'Creating...' : 'Create Invoice'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InvoiceForm;
