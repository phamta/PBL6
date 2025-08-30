import { Client } from 'pg';
import { config } from 'dotenv';

config();

async function resetDatabase() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  try {
    await client.connect();
    console.log('🔄 Connecting to database...');

    // Drop all tables and types
    console.log('🗑️ Dropping all tables and types...');
    await client.query(`
      -- Drop all foreign key constraints first
      DO $$ DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT constraint_name, table_name FROM information_schema.table_constraints 
                   WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public') 
          LOOP
              EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' DROP CONSTRAINT ' || quote_ident(r.constraint_name);
          END LOOP;
      END $$;
    `);

    // Drop all tables
    await client.query(`
      DO $$ DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
          LOOP
              EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
          END LOOP;
      END $$;
    `);

    // Drop all custom types
    await client.query(`
      DO $$ DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public') AND typtype = 'e') 
          LOOP
              EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
          END LOOP;
      END $$;
    `);

    // Drop migrations table
    await client.query(`DROP TABLE IF EXISTS migrations CASCADE`);

    console.log('✅ Database reset successfully!');
    console.log('📝 Now you can run migrations to recreate the schema.');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  } finally {
    await client.end();
  }
}

resetDatabase();
