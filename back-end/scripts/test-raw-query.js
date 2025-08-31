const axios = require('axios');

async function testRawQuery() {
  try {
    // Login
    const loginResponse = await axios.post('http://localhost:3001/api/v1/auth/login', {
      email: 'admin@htqt.edu.vn',
      password: '123456'
    });
    
    console.log('Login successful!');
    const token = loginResponse.data.access_token;
    
    // Test SQL query to check actual data
    console.log('\n=== Testing raw SQL query ===');
    
    const { DataSource } = require('typeorm');

    const dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'ql_htqt',
      entities: [],
      synchronize: false,
    });

    await dataSource.initialize();
    
    // Query users with roles using raw SQL
    const usersWithRoles = await dataSource.query(`
      SELECT 
        u.user_id as "id", 
        u.username, 
        u.email, 
        u.full_name as "fullName",
        u.phone,
        u.created_at as "createdAt",
        u.updated_at as "updatedAt",
        COALESCE(
          JSON_AGG(
            CASE 
              WHEN r.role_id IS NOT NULL 
              THEN JSON_BUILD_OBJECT('id', r.role_id, 'roleName', r.role_name)
              ELSE NULL 
            END
          ) FILTER (WHERE r.role_id IS NOT NULL), 
          '[]'::json
        ) as roles
      FROM "user" u
      LEFT JOIN user_role ur ON u.user_id = ur.user_id
      LEFT JOIN role r ON ur.role_id = r.role_id
      GROUP BY u.user_id, u.username, u.email, u.full_name, u.phone, u.created_at, u.updated_at
      ORDER BY u.username
    `);
    
    console.log('Raw SQL result:', JSON.stringify(usersWithRoles, null, 2));
    
    await dataSource.destroy();
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testRawQuery();
