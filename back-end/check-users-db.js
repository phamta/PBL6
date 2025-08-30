const { Client } = require('pg');
require('dotenv').config();

async function checkUsers() {
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

    // Get all users
    console.log('\n👥 USERS IN DATABASE:');
    console.log('='.repeat(50));
    const usersResult = await client.query(`
      SELECT user_id, username, email, full_name, phone, created_at
      FROM "user" 
      ORDER BY created_at;
    `);
    
    if (usersResult.rows.length === 0) {
      console.log('❌ No users found in database');
      console.log('\n💡 You need to create an admin user first.');
      console.log('You can use the debug endpoint: POST /api/v1/debug/create-admin');
    } else {
      console.log(`Found ${usersResult.rows.length} user(s):`);
      usersResult.rows.forEach((user, index) => {
        console.log(`\n${index + 1}. 👤 ${user.full_name} (${user.username})`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   📱 Phone: ${user.phone || 'N/A'}`);
        console.log(`   📅 Created: ${user.created_at}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkUsers();
