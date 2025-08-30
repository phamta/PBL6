import axios from 'axios';

async function simpleTest() {
  const BASE_URL = 'http://localhost:3001/api/v1';
  
  try {
    console.log('🧪 Testing login with admin@htqt.edu.vn...');
    
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@htqt.edu.vn',
      password: '123456'
    });
    
    console.log('✅ Login successful!');
    console.log('User:', loginResponse.data.user.fullName);
    console.log('Role:', loginResponse.data.user.role);
    
    const token = loginResponse.data.access_token;
    const headers = { Authorization: `Bearer ${token}` };
    
    // Test get users
    console.log('\n🔍 Testing get users...');
    const usersResponse = await axios.get(`${BASE_URL}/users`, { headers });
    console.log(`✅ Found ${usersResponse.data.length} users`);
    
    // Test get MOUs
    console.log('\n📋 Testing get MOUs...');
    const mousResponse = await axios.get(`${BASE_URL}/mou`, { headers });
    console.log(`✅ Found ${mousResponse.data.length} MOUs`);
    
    // Test get visa applications
    console.log('\n🛂 Testing get visa applications...');
    const visasResponse = await axios.get(`${BASE_URL}/visa`, { headers });
    console.log(`✅ Found ${visasResponse.data.length} visa applications`);
    
    console.log('\n🎉 All tests passed! Database and API are working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

simpleTest();
