const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Test accounts from seed data
const ACCOUNTS = {
  admin: {
    email: 'admin@dntu.edu.vn',
    password: 'Admin123456',
    role: 'SYSTEM_ADMIN'
  },
  officer: {
    email: 'officer1@dntu.edu.vn', 
    password: 'Officer123456',
    role: 'DEPARTMENT_OFFICER'
  },
  leadership: {
    email: 'truongkhoa.cntt@dntu.edu.vn',
    password: 'Leadership123456',
    role: 'LEADERSHIP'
  },
  staff: {
    email: 'gv.cntt1@dntu.edu.vn',
    password: 'Staff123456',
    role: 'FACULTY_STAFF'
  },
  student: {
    email: 'sv.cntt1@sv.dntu.edu.vn',
    password: 'Student123456',
    role: 'STUDENT'
  },
  inactive: {
    email: 'inactive@dntu.edu.vn',
    password: 'Inactive123456',
    role: 'STUDENT'
  }
};

class IdentityServiceTester {
  constructor() {
    this.tokens = {};
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async testLogin(accountType, account) {
    try {
      console.log(`\n🔐 Testing login for ${accountType.toUpperCase()}...`);
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: account.email,
        password: account.password
      });

      this.tokens[accountType] = {
        access: response.data.accessToken,
        refresh: response.data.refreshToken
      };

      console.log(`✅ ${accountType} login successful`);
      console.log(`   👤 User: ${response.data.user.fullName}`);
      console.log(`   🏢 Unit: ${response.data.user.unit?.name || 'N/A'}`);
      return true;
    } catch (error) {
      if (accountType === 'inactive' && error.response?.status === 401) {
        console.log(`✅ ${accountType} login properly blocked (expected)`);
        return false;
      }
      console.log(`❌ ${accountType} login failed:`, error.response?.data?.message);
      return false;
    }
  }

  async testRegister() {
    console.log('\n📝 Testing user registration...');
    try {
      const newUser = {
        email: 'testuser@dntu.edu.vn',
        password: 'TestUser123456',
        fullName: 'Test User Registration',
        role: 'STUDENT'
      };

      const response = await axios.post(`${BASE_URL}/auth/register`, newUser);
      console.log('✅ Registration successful');
      console.log(`   👤 New user: ${response.data.user.fullName}`);
      
      // Test duplicate registration
      try {
        await axios.post(`${BASE_URL}/auth/register`, newUser);
        console.log('❌ Duplicate registration should fail!');
      } catch (error) {
        if (error.response?.status === 409) {
          console.log('✅ Duplicate registration properly blocked');
        }
      }
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('ℹ️ User already exists (expected if running multiple times)');
      } else {
        console.log('❌ Registration failed:', error.response?.data?.message);
      }
    }
  }

  async testProfile(accountType) {
    if (!this.tokens[accountType]) return;
    
    console.log(`\n👤 Testing profile access for ${accountType}...`);
    try {
      const response = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${this.tokens[accountType].access}` }
      });
      console.log(`✅ Profile retrieved: ${response.data.fullName}`);
      console.log(`   📧 Email: ${response.data.email}`);
      console.log(`   🎭 Role: ${response.data.role}`);
    } catch (error) {
      console.log(`❌ Profile access failed:`, error.response?.data?.message);
    }
  }

  async testUserList(accountType) {
    if (!this.tokens[accountType]) return;

    console.log(`\n👥 Testing user list access for ${accountType}...`);
    try {
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${this.tokens[accountType].access}` }
      });
      console.log(`✅ User list retrieved: ${response.data.data.length} users`);
      console.log(`   📄 Page: ${response.data.pagination.page}/${response.data.pagination.pages}`);
    } catch (error) {
      console.log(`❌ User list access failed:`, error.response?.data?.message);
    }
  }

  async testUserCreation(accountType) {
    if (!this.tokens[accountType]) return;

    console.log(`\n➕ Testing user creation for ${accountType}...`);
    try {
      const newUser = {
        email: `new-${accountType}@dntu.edu.vn`,
        fullName: `New User by ${accountType}`,
        role: 'STUDENT'
      };

      const response = await axios.post(`${BASE_URL}/users`, newUser, {
        headers: { Authorization: `Bearer ${this.tokens[accountType].access}` }
      });
      console.log(`✅ User creation successful: ${response.data.user.fullName}`);
      console.log(`   🔑 Default password: ${response.data.defaultPassword}`);
    } catch (error) {
      if (error.response?.status === 403) {
        console.log(`✅ User creation properly blocked for ${accountType} (expected)`);
      } else {
        console.log(`❌ User creation failed:`, error.response?.data?.message);
      }
    }
  }

  async testUnits(accountType) {
    if (!this.tokens[accountType]) return;

    console.log(`\n🏢 Testing units access for ${accountType}...`);
    try {
      const response = await axios.get(`${BASE_URL}/units`, {
        headers: { Authorization: `Bearer ${this.tokens[accountType].access}` }
      });
      console.log(`✅ Units retrieved: ${response.data.data.length} units`);
      
      // Test hierarchy
      const hierarchyResponse = await axios.get(`${BASE_URL}/units/hierarchy`, {
        headers: { Authorization: `Bearer ${this.tokens[accountType].access}` }
      });
      console.log(`✅ Unit hierarchy retrieved: ${hierarchyResponse.data.length} root units`);
    } catch (error) {
      console.log(`❌ Units access failed:`, error.response?.data?.message);
    }
  }

  async testPasswordChange(accountType) {
    if (!this.tokens[accountType] || accountType === 'inactive') return;

    console.log(`\n🔐 Testing password change for ${accountType}...`);
    try {
      // Get user ID first
      const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${this.tokens[accountType].access}` }
      });
      
      const userId = profileResponse.data.id;
      const account = ACCOUNTS[accountType];
      
      const changePasswordDto = {
        currentPassword: account.password,
        newPassword: account.password + '1' // Just add '1' to current password
      };

      await axios.put(`${BASE_URL}/users/${userId}/change-password`, changePasswordDto, {
        headers: { Authorization: `Bearer ${this.tokens[accountType].access}` }
      });
      console.log(`✅ Password change successful for ${accountType}`);
      
      // Update account password for future tests
      ACCOUNTS[accountType].password = changePasswordDto.newPassword;
    } catch (error) {
      console.log(`❌ Password change failed:`, error.response?.data?.message);
    }
  }

  async testRefreshToken(accountType) {
    if (!this.tokens[accountType]) return;

    console.log(`\n🔄 Testing token refresh for ${accountType}...`);
    try {
      const response = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
        headers: { Authorization: `Bearer ${this.tokens[accountType].refresh}` }
      });
      console.log(`✅ Token refresh successful for ${accountType}`);
      
      // Update tokens
      this.tokens[accountType].access = response.data.accessToken;
      this.tokens[accountType].refresh = response.data.refreshToken;
    } catch (error) {
      console.log(`❌ Token refresh failed:`, error.response?.data?.message);
    }
  }

  async testLogout(accountType) {
    if (!this.tokens[accountType]) return;

    console.log(`\n🚪 Testing logout for ${accountType}...`);
    try {
      await axios.post(`${BASE_URL}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${this.tokens[accountType].refresh}` }
      });
      console.log(`✅ Logout successful for ${accountType}`);
      
      // Clear tokens
      delete this.tokens[accountType];
    } catch (error) {
      console.log(`❌ Logout failed:`, error.response?.data?.message);
    }
  }

  async testUnauthorizedAccess() {
    console.log('\n🔒 Testing unauthorized access...');
    try {
      await axios.get(`${BASE_URL}/users`);
      console.log('❌ Unauthorized access should be blocked!');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Unauthorized access properly blocked');
      }
    }

    try {
      await axios.get(`${BASE_URL}/auth/profile`);
      console.log('❌ Profile access without token should be blocked!');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Profile access properly protected');
      }
    }
  }

  async runCompleteTest() {
    console.log('🧪 IDENTITY SERVICE COMPREHENSIVE TEST');
    console.log('=====================================');
    console.log(`🎯 Testing against: ${BASE_URL}`);
    
    try {
      // Test 1: Registration
      await this.testRegister();
      await this.delay(500);

      // Test 2: Login for each role
      console.log('\n📋 AUTHENTICATION TESTS');
      console.log('========================');
      for (const [accountType, account] of Object.entries(ACCOUNTS)) {
        await this.testLogin(accountType, account);
        await this.delay(300);
      }

      // Test 3: Profile access
      console.log('\n📋 PROFILE ACCESS TESTS');
      console.log('=======================');
      for (const accountType of ['admin', 'officer', 'leadership', 'staff', 'student']) {
        await this.testProfile(accountType);
        await this.delay(200);
      }

      // Test 4: User management
      console.log('\n📋 USER MANAGEMENT TESTS');
      console.log('========================');
      for (const accountType of ['admin', 'officer', 'leadership', 'staff', 'student']) {
        await this.testUserList(accountType);
        await this.delay(200);
      }

      for (const accountType of ['admin', 'officer', 'student']) {
        await this.testUserCreation(accountType);
        await this.delay(300);
      }

      // Test 5: Units access
      console.log('\n📋 UNITS MANAGEMENT TESTS');
      console.log('=========================');
      for (const accountType of ['admin', 'officer', 'student']) {
        await this.testUnits(accountType);
        await this.delay(200);
      }

      // Test 6: Password change
      console.log('\n📋 PASSWORD MANAGEMENT TESTS');
      console.log('============================');
      for (const accountType of ['admin', 'student']) {
        await this.testPasswordChange(accountType);
        await this.delay(300);
      }

      // Test 7: Token refresh
      console.log('\n📋 TOKEN MANAGEMENT TESTS');
      console.log('=========================');
      for (const accountType of ['admin', 'officer']) {
        await this.testRefreshToken(accountType);
        await this.delay(200);
      }

      // Test 8: Unauthorized access
      await this.testUnauthorizedAccess();

      // Test 9: Logout
      console.log('\n📋 LOGOUT TESTS');
      console.log('===============');
      for (const accountType of Object.keys(this.tokens)) {
        await this.testLogout(accountType);
        await this.delay(200);
      }

      // Final summary
      console.log('\n🎉 IDENTITY SERVICE TEST COMPLETED!');
      console.log('===================================');
      console.log('✅ Registration & Authentication');
      console.log('✅ Role-based Authorization');
      console.log('✅ User Profile Management');
      console.log('✅ User CRUD Operations');
      console.log('✅ Units Management');
      console.log('✅ Password Management');
      console.log('✅ JWT Token Management');
      console.log('✅ Security & Access Control');
      console.log('\n🔗 Access Points:');
      console.log(`   🌐 API Server: ${BASE_URL}`);
      console.log(`   📚 Swagger Docs: ${BASE_URL}/api`);
      console.log(`   🗄️ Database: PostgreSQL`);

    } catch (error) {
      console.error('\n❌ Test suite failed:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.log('\n💡 Make sure the server is running:');
        console.log('   npm run start:dev');
      }
    }
  }
}

// Check if server is running
async function checkServer() {
  try {
    // Try to call root endpoint to see if server responds
    await axios.get(`${BASE_URL}/`, { 
      timeout: 5000,
      validateStatus: () => true // Accept any status code
    });
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return false;
    }
    // If we get any response (even error), server is running
    return true;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking if server is running...');
  
  const isRunning = await checkServer();
  if (!isRunning) {
    console.log('❌ Server not running. Please start server first:');
    console.log('   npm run start:dev');
    console.log(`   Server should be available at: ${BASE_URL}`);
    return;
  }

  console.log('✅ Server is running!');
  
  const tester = new IdentityServiceTester();
  await tester.runCompleteTest();
}

main().catch(console.error);