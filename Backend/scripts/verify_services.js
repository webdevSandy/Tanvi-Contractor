const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testServices() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin',
            password: 'password123'
        });
        const token = loginRes.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log('✅ Login Successful');

        // 2. Create Service
        console.log('Creating Service...');
        const serviceData = {
            name: `Service-${Date.now()}`,
            title: 'Professional Service',
            description: 'This is a test service description.',
            points: ['Point 1', 'Point 2', 'Point 3'],
            image: 'https://via.placeholder.com/150',
            rate: 5000
        };

        const createRes = await axios.post(`${API_URL}/services`, serviceData, config);
        const serviceId = createRes.data._id;
        console.log(`✅ Service Created: ${serviceId}`);
        console.log('Points:', createRes.data.points);
        console.log('Image:', createRes.data.image);

        // 3. Update Service
        console.log('Updating Service...');
        const updateRes = await axios.put(`${API_URL}/services/${serviceId}`, {
            points: ['Updated Point A', 'Updated Point B']
        }, config);
        console.log('✅ Service Updated');
        console.log('New Points:', updateRes.data.points);

        // 4. Delete Service
        console.log('Deleting Service...');
        await axios.delete(`${API_URL}/services/${serviceId}`, config);
        console.log('✅ Service Deleted');

    } catch (error) {
        console.error('❌ Service Test Failed:', error.response ? error.response.data : error.message);
    }
}

testServices();
