const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testCRUD() {
    try {
        // 1. Login to get token
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('✅ Login Successful');

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Create a Dummy Invoice for Testing
        console.log('Creating Test Invoice...');
        const invRes = await axios.post(`${API_URL}/invoices`, {
            invoiceNumber: `DEL-TEST-${Date.now()}`,
            clientName: 'Delete Me',
            clientAddress: 'Nowhere',
            totalAmount: 100,
            grandTotal: 100,
            items: [{ description: 'Test', quantity: 1, rate: 100, amount: 100 }]
        }, config);
        const invoiceId = invRes.data._id;
        console.log(`✅ Invoice Created: ${invoiceId}`);

        // 3. Update Invoice
        console.log('Updating Invoice...');
        await axios.put(`${API_URL}/invoices/${invoiceId}`, { clientName: 'Updated Name' }, config);
        console.log('✅ Invoice Updated');

        // 4. Delete Invoice
        console.log('Deleting Invoice...');
        await axios.delete(`${API_URL}/invoices/${invoiceId}`, config);
        console.log('✅ Invoice Deleted');

        // 5. User CRUD
        console.log('Fetching Users...');
        const usersRes = await axios.get(`${API_URL}/users`, config);
        console.log(`✅ Users Fetched: ${usersRes.data.length} users found`);

        console.log('🎉 All CRUD Tests Passed!');

    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
    }
}

testCRUD();
