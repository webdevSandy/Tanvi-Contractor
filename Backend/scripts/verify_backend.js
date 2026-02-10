const axios = require('axios');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const API_URL = `http://localhost:${PORT}/api`;

async function verifyBackend() {
    console.log('🚀 Starting Backend Verification...');

    let token;
    let invoiceId;

    // 1. Login Admin
    try {
        console.log('\nTesting Login...');
        const response = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin',
            password: 'password123'
        });
        token = response.data.token;
        console.log('✅ Login Successful! Token received.');
    } catch (error) {
        console.error('❌ Login Failed:', error.response ? error.response.data : error.message);
        console.log('⚠️  Make sure you have run "node scripts/seedAdmin.js" first!');
        return;
    }

    // 2. Create Invoice
    try {
        console.log('\nTesting Create Invoice...');
        const invoiceData = {
            invoiceNumber: `TEST-${Date.now()}`,
            clientName: 'Test Client',
            clientAddress: '123 Test Lane',
            items: [
                { description: 'Test Item 1', quantity: 2, rate: 50, amount: 100 }
            ],
            totalAmount: 100,
            gst: 18,
            grandTotal: 118
        };

        const response = await axios.post(`${API_URL}/invoices`, invoiceData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        invoiceId = response.data._id;
        console.log(`✅ Invoice Created! ID: ${invoiceId}`);
    } catch (error) {
        console.error('❌ Create Invoice Failed:', error.response ? error.response.data : error.message);
        return;
    }

    // 3. Generate PDF
    try {
        console.log('\nTesting PDF Generation...');
        const response = await axios.get(`${API_URL}/invoices/${invoiceId}/pdf`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'arraybuffer'
        });
        
        const pdfPath = path.join(__dirname, 'test_invoice.pdf');
        fs.writeFileSync(pdfPath, response.data);
        console.log(`✅ PDF Generated and saved to: ${pdfPath}`);
    } catch (error) {
        console.error('❌ PDF Generation Failed:', error.response ? error.response.data : error.message);
    }

    // 4. Test Services
    try {
        console.log('\nTesting Services...');
        // Create Service
        const serviceData = { name: `Service-${Date.now()}`, rate: 500, description: 'Test Service' };
        const createRes = await axios.post(`${API_URL}/services`, serviceData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Service Created! ID: ${createRes.data._id}`);

        // Get Services
        const getRes = await axios.get(`${API_URL}/services`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Services Fetched! Count: ${getRes.data.length}`);
    } catch (error) {
        console.error('❌ Service Test Failed:', error.response ? error.response.data : error.message);
    }


    console.log('\n🎉 Verification Documentation Complete!');
}

verifyBackend();
