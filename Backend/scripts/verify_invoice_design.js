const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Invoice = require('../models/Invoice');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log('MongoDB Connected');
    
    const testInvoice = {
        invoiceNumber: `TEST-${Date.now()}`,
        clientName: 'Test Client',
        clientAddress: '123 Test St',
        consignee: { name: 'Consignee Name', address: 'Consignee Addr', gstin: 'GST123' },
        vendorCode: 'VC001',
        orderNo: 'ORD-999',
        orderDate: new Date(),
        items: [
            { description: 'Item A', quantity: 10, rate: 100, amount: 1000 }
        ],
        totalAmount: 1000,
        cgst: 90,
        sgst: 90,
        grandTotal: 1180
    };

    try {
        const created = await Invoice.create(testInvoice);
        console.log('✅ Invoice Created Successfully');
        console.log('Consignee:', created.consignee);
        console.log('Vendor Code:', created.vendorCode);
        console.log('Items:', created.items.length);
        
        // Clean up
        await Invoice.deleteOne({ _id: created._id });
        console.log('Test invoice cleaned up');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating invoice:', err);
        process.exit(1);
    }
})
.catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
});
