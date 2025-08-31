const { DataSource } = require('typeorm');
require('dotenv').config();

async function checkDatabaseTables() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'ql_htqt',
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Check MOU related tables
    console.log('\n=== MOU TABLES ===');
    const mouTables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%mou%'
      ORDER BY table_name;
    `);
    
    if (mouTables.length > 0) {
      for (const table of mouTables) {
        console.log(`\nTable: ${table.table_name}`);
        const columns = await dataSource.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = '${table.table_name}'
          ORDER BY ordinal_position;
        `);
        columns.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}`);
        });
      }
    } else {
      console.log('No MOU tables found');
    }

    // Check Visitor related tables
    console.log('\n=== VISITOR TABLES ===');
    const visitorTables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%visitor%'
      ORDER BY table_name;
    `);
    
    if (visitorTables.length > 0) {
      for (const table of visitorTables) {
        console.log(`\nTable: ${table.table_name}`);
        const columns = await dataSource.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = '${table.table_name}'
          ORDER BY ordinal_position;
        `);
        columns.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}`);
        });
      }
    } else {
      console.log('No Visitor tables found');
    }

    // Check Translation related tables
    console.log('\n=== TRANSLATION TABLES ===');
    const translationTables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%translation%'
      ORDER BY table_name;
    `);
    
    if (translationTables.length > 0) {
      for (const table of translationTables) {
        console.log(`\nTable: ${table.table_name}`);
        const columns = await dataSource.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = '${table.table_name}'
          ORDER BY ordinal_position;
        `);
        columns.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}`);
        });
      }
    } else {
      console.log('No Translation tables found');
    }

    // Check all tables to see what exists
    console.log('\n=== ALL TABLES ===');
    const allTables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('All tables in database:');
    allTables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await dataSource.destroy();
  }
}

checkDatabaseTables();
