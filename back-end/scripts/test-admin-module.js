// Script để test admin module functionality
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';

// Mock admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123'
};

class AdminModuleTest {
  constructor() {
    this.token = null;
  }

  async login() {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, ADMIN_CREDENTIALS);
      this.token = response.data.access_token;
      console.log('✅ Login successful');
      return true;
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testGetUsers() {
    try {
      const response = await axios.get(`${BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      console.log('✅ Get users successful:', response.data.length, 'users found');
      return true;
    } catch (error) {
      console.log('❌ Get users failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testGetDashboardStats() {
    try {
      const response = await axios.get(`${BASE_URL}/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      console.log('✅ Dashboard stats successful:', response.data);
      return true;
    } catch (error) {
      console.log('❌ Dashboard stats failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testGetSystemSettings() {
    try {
      const response = await axios.get(`${BASE_URL}/admin/settings`, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      console.log('✅ Get system settings successful:', response.data.length, 'settings found');
      return true;
    } catch (error) {
      console.log('❌ Get system settings failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testGetRoles() {
    try {
      const response = await axios.get(`${BASE_URL}/admin/roles`, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      console.log('✅ Get roles successful:', response.data.length, 'roles found');
      return true;
    } catch (error) {
      console.log('❌ Get roles failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Admin Module Test...\n');

    // Login first
    const loginSuccess = await this.login();
    if (!loginSuccess) {
      console.log('❌ Cannot proceed without login');
      return;
    }

    console.log('\n📊 Testing admin endpoints...');
    await this.testGetUsers();
    await this.testGetDashboardStats();
    await this.testGetSystemSettings();
    await this.testGetRoles();

    console.log('\n✨ Admin Module Test completed!');
  }
}

// Helper function to check if server is running
async function checkServerHealth() {
  try {
    const response = await axios.get(`${BASE_URL}/auth/login`, {
      method: 'HEAD',
      validateStatus: function (status) {
        return status < 500; // Accept any status code less than 500 as server running
      }
    });
    console.log('✅ Server is running');
    return true;
  } catch (error) {
    console.log('❌ Server is not running. Start the server first with: npm run start:dev');
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking server health...');
  const serverRunning = await checkServerHealth();
  
  if (!serverRunning) {
    return;
  }

  const test = new AdminModuleTest();
  await test.runAllTests();
}

// Export for use in other scripts
module.exports = { AdminModuleTest, checkServerHealth };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}