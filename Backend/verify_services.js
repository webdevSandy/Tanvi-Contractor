const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runTest = async () => {
    try {
        console.log('1. Registering/Logging in Test User...');
        let token;
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                username: 'testadmin_' + Date.now(),
                password: 'password123'
            });
            token = regRes.data.token;
            console.log('   User registered successfully.');
        } catch (error) {
            console.log('   Registration failed (maybe user exists), trying login...');
            // In a real scenario we'd login, but here we used a unique username
            console.error(error.response?.data?.message || error.message);
            return;
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        console.log('\n2. Testing GET /services (Should be empty initially or have existing data)...');
        const getRes1 = await axios.get(`${API_URL}/services`, config);
        console.log(`   Status: ${getRes1.status}`);
        console.log(`   Count: ${getRes1.data.length}`);

        console.log('\n3. Testing POST /services (Creating new service)...');
        const newService = {
            name: 'Test Service ' + Date.now(),
            title: 'Test Service Title',
            description: 'This is a test service description.',
            points: ['Point 1', 'Point 2'],
            image: 'https://via.placeholder.com/150',
            rate: 1000
        };
        const createRes = await axios.post(`${API_URL}/services`, newService, config);
        console.log(`   Status: ${createRes.status}`);
        console.log(`   Created ID: ${createRes.data._id}`);

        console.log('\n4. Testing GET /services (Should include new service)...');
        const getRes2 = await axios.get(`${API_URL}/services`, config);
        console.log(`   Status: ${getRes2.status}`);
        console.log(`   Count: ${getRes2.data.length}`);
        const found = getRes2.data.find(s => s._id === createRes.data._id);
        if (found) {
            console.log('   SUCCESS: Created service found in list.');
        } else {
            console.error('   FAILURE: Created service NOT found in list.');
        }
        
        // Optional: Clean up
        console.log('\n5. Cleaning up (Deleting created service)...');
        await axios.delete(`${API_URL}/services/${createRes.data._id}`, config);
        console.log('   Service deleted.');

    } catch (error) {
        console.error('\nTEST FAILED:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
};

runTest();
