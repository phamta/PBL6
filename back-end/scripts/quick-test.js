const axios = require('axios');

async function quickTest() {
  const BASE_URL = 'http://localhost:3001/api/v1';
  
  try {
    console.log('🧪 Testing login...');
    
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@htqt.edu.vn',
      password: '123456'
    });
    
    console.log('✅ Login successful!');
    console.log('User:', response.data.user?.fullName || 'N/A');
    console.log('Role:', response.data.user?.role || 'N/A');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    if (error.code) {
      console.log('Error code:', error.code);
    }
  }
}

quickTest();
