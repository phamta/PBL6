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

async function checkUsersAndRoles() {
  try {
    await dataSource.initialize();
    console.log('Database connected successfully');

    // Check users
    const users = await dataSource.query('SELECT user_id, username, email, full_name FROM "user"');
    console.log('\n=== USERS ===');
    console.log(users);

    // Check roles
    const roles = await dataSource.query('SELECT role_id, role_name FROM role');
    console.log('\n=== ROLES ===');
    console.log(roles);

    // Check user_role relationships
    const userRoles = await dataSource.query(`
      SELECT ur.user_id, ur.role_id, u.username, u.email, r.role_name 
      FROM user_role ur
      JOIN "user" u ON ur.user_id = u.user_id
      JOIN role r ON ur.role_id = r.role_id
    `);
    console.log('\n=== USER-ROLE RELATIONSHIPS ===');
    console.log(userRoles);

    // Test the join query that should be used in the API
    const usersWithRoles = await dataSource.query(`
      SELECT 
        u.user_id, 
        u.username, 
        u.email, 
        u.full_name,
        ARRAY_AGG(
          JSON_BUILD_OBJECT(
            'id', r.role_id,
            'roleName', r.role_name
          )
        ) as roles
      FROM "user" u
      LEFT JOIN user_role ur ON u.user_id = ur.user_id
      LEFT JOIN role r ON ur.role_id = r.role_id
      GROUP BY u.user_id, u.username, u.email, u.full_name
    `);
    console.log('\n=== USERS WITH ROLES (JOIN QUERY) ===');
    console.log(JSON.stringify(usersWithRoles, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await dataSource.destroy();
  }
}

checkUsersAndRoles();
