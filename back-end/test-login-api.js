const axios = require('axios');

async function testLoginAPI() {
  try {
    console.log('Testing login API...');
    
    const response = await axios.post('http://localhost:3001/api/v1/auth/login', {
      username: 'admin',
      password: '123456'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else if (error.request) {
      console.log('Network error:', error.message);
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Also test with email
async function testLoginWithEmail() {
  try {
    console.log('\nTesting login with email...');
    
    const response = await axios.post('http://localhost:3001/api/v1/auth/login', {
      email: 'admin@htqt.edu.vn',
      password: '123456'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Email login successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Email login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else if (error.request) {
      console.log('Network error:', error.message);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLoginAPI();
testLoginWithEmail();
