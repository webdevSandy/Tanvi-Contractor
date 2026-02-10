const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testNewModules() {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin',
            password: 'password123'
        });
        const token = loginRes.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log('✅ Login Successful');

        // --- Partners ---
        console.log('\nTesting Partners...');
        const pRes = await axios.post(`${API_URL}/partners`, {
            name: 'Test Partner',
            logo: 'http://example.com/logo.png'
        }, config);
        console.log(`✅ Partner Created: ${pRes.data._id}`);
        
        await axios.put(`${API_URL}/partners/${pRes.data._id}`, { name: 'Updated Partner' }, config);
        console.log('✅ Partner Updated');

        await axios.delete(`${API_URL}/partners/${pRes.data._id}`, config);
        console.log('✅ Partner Deleted');

        // --- Banners ---
        console.log('\nTesting Banners...');
        const bRes = await axios.post(`${API_URL}/banners`, {
            title: 'Welcome',
            subtitle: 'To Tanvi Contractor',
            image: 'http://example.com/banner.jpg'
        }, config);
        console.log(`✅ Banner Created: ${bRes.data._id}`);

        await axios.put(`${API_URL}/banners/${bRes.data._id}`, { title: 'Updated Welcome' }, config);
        console.log('✅ Banner Updated');

        await axios.delete(`${API_URL}/banners/${bRes.data._id}`, config);
        console.log('✅ Banner Deleted');

        console.log('\n🎉 All New Modules Verified!');

    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
    }
}

testNewModules();
