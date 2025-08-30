import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function resetCompleteDatabase() {
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

    console.log('🧹 Dropping all tables...');
    
    // Drop all tables
    const dropTablesQuery = `
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `;
    
    await client.query(dropTablesQuery);
    console.log('✅ All tables dropped successfully!');
    
    console.log('🔧 Creating UUID extension...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    console.log('✅ Database reset completed!');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  } finally {
    await client.end();
  }
}

resetCompleteDatabase();
