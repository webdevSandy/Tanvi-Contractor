const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    clientName: {
        type: String,
        required: true
    },
    clientAddress: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    // Consignee Details
    consignee: {
        name: { type: String, default: '' },
        address: { type: String, default: '' },
        gstin: { type: String, default: '' }
    },
    // Vendor & Order Details
    vendorCode: { type: String, default: '' },
    orderNo: { type: String, default: '' },
    orderDate: { type: Date },
    
    // Bank Details
    accountDetails: {
        accountName: { type: String, default: 'Indian Bank' },
        accountNumber: { type: String, default: '7638335079' },
        ifscCode: { type: String, default: 'IDIB000O029' },
        bankName: { type: String, default: 'Indian Bank' },
        branch: { type: String, default: 'Kalpi Bus Stand Orai' }
    },

    // Additional Invoice Info
    contractNo: { type: String, default: '' },
    diNo: { type: String, default: '' },
    diDate: { type: Date },

    items: [
        {
            srNo: { type: Number },
            description: { type: String, required: true },
            quantity: { type: Number, required: true },
            unit: { type: String, default: 'NOS' }, // e.g. NOS, KG
            rate: { type: Number, required: true },
            amount: { type: Number, required: true }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
    grandTotal: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Overdue'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
