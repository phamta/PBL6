import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBasicSchema1726473400000 implements MigrationInterface {
    name = 'CreateBasicSchema1726473400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create extension for UUID generation
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create User table
        await queryRunner.query(`
            CREATE TABLE "user" (
                "user_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying(100) NOT NULL,
                "email" character varying(200) NOT NULL,
                "password_hash" character varying(255) NOT NULL,
                "full_name" character varying(200) NOT NULL,
                "phone" character varying(20),
                "status" character varying(20) NOT NULL DEFAULT 'active',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_user" PRIMARY KEY ("user_id"),
                CONSTRAINT "UQ_user_username" UNIQUE ("username"),
                CONSTRAINT "UQ_user_email" UNIQUE ("email")
            )
        `);

        // Create Role table
        await queryRunner.query(`
            CREATE TABLE "role" (
                "role_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "role_name" character varying(100) NOT NULL,
                CONSTRAINT "PK_role" PRIMARY KEY ("role_id"),
                CONSTRAINT "UQ_role_name" UNIQUE ("role_name")
            )
        `);

        // Create UserRole table
        await queryRunner.query(`
            CREATE TABLE "user_role" (
                "user_role_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "role_id" uuid NOT NULL,
                "assigned_at" TIMESTAMP NOT NULL DEFAULT now(),
                "assigned_by" uuid,
                CONSTRAINT "PK_user_role" PRIMARY KEY ("user_role_id"),
                CONSTRAINT "FK_user_role_user" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE,
                CONSTRAINT "FK_user_role_role" FOREIGN KEY ("role_id") REFERENCES "role"("role_id") ON DELETE CASCADE,
                CONSTRAINT "UQ_user_role" UNIQUE ("user_id", "role_id")
            )
        `);

        // Insert default roles
        await queryRunner.query(`
            INSERT INTO "role" ("role_name") VALUES 
            ('admin'),
            ('user'),
            ('specialist'),
            ('manager'),
            ('viewer')
        `);

        // Create default admin user
        await queryRunner.query(`
            INSERT INTO "user" ("username", "email", "password_hash", "full_name", "status") VALUES 
            ('admin', 'admin@pbl6.com', '$2b$10$8Ey3NlFNFnR.A6ZrHGTzLOzl/7nZDQj2Bb1dT5hJRW5Yv7uCG8K8C', 'Administrator', 'active')
        `);

        // Assign admin role to admin user
        await queryRunner.query(`
            INSERT INTO "user_role" ("user_id", "role_id") 
            SELECT u."user_id", r."role_id" 
            FROM "user" u, "role" r 
            WHERE u."username" = 'admin' AND r."role_name" = 'admin'
        `);

        // Create indexes for better performance
        await queryRunner.query(`CREATE INDEX "IDX_user_username" ON "user" ("username")`);
        await queryRunner.query(`CREATE INDEX "IDX_user_email" ON "user" ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_user_status" ON "user" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_role_name" ON "role" ("role_name")`);
        await queryRunner.query(`CREATE INDEX "IDX_user_role_user_id" ON "user_role" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_user_role_role_id" ON "user_role" ("role_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_role"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
    }
}