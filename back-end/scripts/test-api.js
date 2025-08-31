const axios = require('axios');

async function testAPI() {
  try {
    // Login
    const loginResponse = await axios.post('http://localhost:3001/api/v1/auth/login', {
      email: 'admin@htqt.edu.vn',
      password: '123456'
    });
    
    console.log('Login successful!');
    const token = loginResponse.data.access_token;
    console.log('Token:', token.substring(0, 50) + '...');
    
    // Get users
    const usersResponse = await axios.get('http://localhost:3001/api/v1/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n=== USERS API RESPONSE ===');
    console.log(JSON.stringify(usersResponse.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAPI();
