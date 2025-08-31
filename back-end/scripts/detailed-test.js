const axios = require('axios');

async function detailedTest() {
  try {
    console.log('🔑 Testing login...');
    
    // Login
    const loginResponse = await axios.post('http://localhost:3001/api/v1/auth/login', {
      email: 'admin@htqt.edu.vn',
      password: '123456'
    });
    
    console.log('✅ Login successful!');
    const token = loginResponse.data.access_token;
    console.log('Token received:', token.substring(0, 50) + '...');
    
    console.log('\n👥 Testing users API...');
    
    // Get users with detailed error logging
    try {
      const usersResponse = await axios.get('http://localhost:3001/api/v1/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('\n✅ Users API Response:');
      console.log('Response status:', usersResponse.status);
      console.log('Number of users:', usersResponse.data.length);
      
      // Check if users have roles
      usersResponse.data.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log(`- Name: ${user.fullName} (${user.username})`);
        console.log(`- Email: ${user.email}`);
        console.log(`- Has roles field: ${user.roles !== undefined}`);
        if (user.roles) {
          console.log(`- Roles: ${JSON.stringify(user.roles)}`);
        } else {
          console.log(`- Roles: ❌ NOT FOUND`);
        }
      });
      
    } catch (userError) {
      console.error('❌ Users API Error:');
      console.error('Status:', userError.response?.status);
      console.error('Message:', userError.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Login Error:', error.response?.data || error.message);
  }
}

detailedTest();
