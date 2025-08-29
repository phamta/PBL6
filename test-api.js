const http = require('http');

// Test 1: Kiểm tra admin có tồn tại không
function checkAdmin() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3001,
      path: '/api/v1/debug/check-admin',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('\n=== CHECK ADMIN ===');
        console.log(`Status: ${res.statusCode}`);
        console.log('Response:', data);
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (e) => {
      console.error(`Error checking admin: ${e.message}`);
      reject(e);
    });

    req.end();
  });
}

// Test 2: Tạo admin nếu chưa có
function createAdmin() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3001,
      path: '/api/v1/debug/create-admin',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('\n=== CREATE ADMIN ===');
        console.log(`Status: ${res.statusCode}`);
        console.log('Response:', data);
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (e) => {
      console.error(`Error creating admin: ${e.message}`);
      reject(e);
    });

    req.end();
  });
}

// Test 3: Test login
function testLogin() {
  return new Promise((resolve, reject) => {
    const loginData = JSON.stringify({
      email: 'admin@university.edu.vn',
      password: 'admin123'
    });

    const options = {
      hostname: '127.0.0.1',
      port: 3001,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('\n=== TEST LOGIN ===');
        console.log(`Status: ${res.statusCode}`);
        console.log('Response:', data);
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (e) => {
      console.error(`Error testing login: ${e.message}`);
      reject(e);
    });

    req.write(loginData);
    req.end();
  });
}

// Test 4: Lấy danh sách users (public endpoint)
function getUsers() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3001,
      path: '/api/v1/debug/users',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('\n=== GET USERS ===');
        console.log(`Status: ${res.statusCode}`);
        console.log('Response:', data);
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (e) => {
      console.error(`Error getting users: ${e.message}`);
      reject(e);
    });

    req.end();
  });
}

// Chạy tests
async function runTests() {
  console.log('Testing API endpoints...');
  
  try {
    // 1. Kiểm tra admin có tồn tại không
    const adminCheck = await checkAdmin();
    
    // 2. Nếu không có admin, tạo mới
    if (!adminCheck.exists) {
      console.log('\nAdmin not found, creating...');
      await createAdmin();
    }
    
    // 3. Lấy danh sách users
    await getUsers();
    
    // 4. Test login
    await testLogin();
    
    console.log('\n=== ALL TESTS COMPLETED ===');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

runTests();
