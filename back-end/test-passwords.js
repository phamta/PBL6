const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testPasswords() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_DATABASE || 'ql_htqt',
  });

  try {
    console.log('🔗 Connecting to database...');
    await client.connect();

    // Get admin user
    const result = await client.query(`
      SELECT username, email, password_hash, full_name
      FROM "user" 
      WHERE username = 'admin' OR email LIKE '%admin%'
      LIMIT 1;
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ No admin user found');
      return;
    }

    const user = result.rows[0];
    console.log('👤 Found admin user:');
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Full name: ${user.full_name}`);

    // Common passwords to test
    const commonPasswords = [
      'admin123',
      'admin',
      'password',
      '123456',
      'password123',
      'htqt123',
      '12345678'
    ];

    console.log('\n🔐 Testing common passwords...');
    
    for (const password of commonPasswords) {
      try {
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (isMatch) {
          console.log(`✅ FOUND MATCHING PASSWORD: "${password}"`);
          console.log('\n🎯 LOGIN CREDENTIALS:');
          console.log(`   Username: ${user.username}`);
          console.log(`   Password: ${password}`);
          console.log('   OR');
          console.log(`   Email: ${user.email}`);
          console.log(`   Password: ${password}`);
          return;
        }
      } catch (err) {
        // Continue testing
      }
    }
    
    console.log('❌ None of the common passwords matched');
    console.log('💡 You may need to reset the password or create a new admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

testPasswords();
