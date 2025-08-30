const { Client } = require('pg');
require('dotenv').config();

async function checkDatabaseStructure() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_DATABASE || 'ql_htqt',
  });

  try {
    console.log('🔗 Connecting to database ql_htqt...');
    await client.connect();

    // Get all tables
    console.log('\n📋 DANH SÁCH CÁC BẢNG:');
    console.log('='.repeat(50));
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('❌ Không có bảng nào trong database');
      return;
    }

    for (const table of tablesResult.rows) {
      console.log(`\n🗂️  BẢNG: ${table.table_name.toUpperCase()}`);
      console.log('-'.repeat(50));
      
      // Get columns for each table
      const columnsResult = await client.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = $1 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `, [table.table_name]);

      columnsResult.rows.forEach((col, index) => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const length = col.character_maximum_length ? `(${col.character_maximum_length})` : '';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        
        console.log(`${index + 1}. ${col.column_name} - ${col.data_type}${length} ${nullable}${defaultVal}`);
      });

      // Get constraints
      const constraintsResult = await client.query(`
        SELECT 
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        LEFT JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.table_name = $1
        AND tc.table_schema = 'public';
      `, [table.table_name]);

      if (constraintsResult.rows.length > 0) {
        console.log('\n🔗 CONSTRAINTS:');
        constraintsResult.rows.forEach(constraint => {
          let constraintInfo = `- ${constraint.constraint_type}: ${constraint.column_name}`;
          if (constraint.foreign_table_name) {
            constraintInfo += ` -> ${constraint.foreign_table_name}.${constraint.foreign_column_name}`;
          }
          console.log(constraintInfo);
        });
      }
    }

  } catch (error) {
    console.error('❌ Lỗi kết nối database:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabaseStructure();
