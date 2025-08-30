import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserRoleEnum1693414280000 implements MigrationInterface {
    name = 'UpdateUserRoleEnum1693414280000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, check what roles currently exist in the database
        const existingRoles = await queryRunner.query(`
            SELECT DISTINCT role FROM users
        `);
        console.log('Existing roles in database:', existingRoles);

        // Step 1: Create new enum type with all required values
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum_new" AS ENUM(
                'admin', 
                'user', 
                'student', 
                'specialist', 
                'manager', 
                'viewer', 
                'system'
            )
        `);

        // Step 2: Add a temporary column with the new enum type
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "role_new" "public"."users_role_enum_new"
        `);

        // Step 3: Update the temporary column with mapped values
        await queryRunner.query(`
            UPDATE users 
            SET role_new = CASE 
                WHEN role = 'khoa' THEN 'manager'::users_role_enum_new
                WHEN role = 'phong' THEN 'specialist'::users_role_enum_new
                WHEN role = 'admin' THEN 'admin'::users_role_enum_new
                WHEN role = 'user' THEN 'user'::users_role_enum_new
                ELSE 'user'::users_role_enum_new
            END
        `);

        // Step 4: Drop the old column
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);

        // Step 5: Rename the new column to the original name
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "role_new" TO "role"`);

        // Step 6: Drop the old enum type if it exists
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_role_enum"`);
        
        // Step 7: Rename the new enum type
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum_new" RENAME TO "users_role_enum"`);

        // Step 8: Set default value and not null constraint
        await queryRunner.query(`
            ALTER TABLE "users" 
            ALTER COLUMN "role" SET DEFAULT 'user',
            ALTER COLUMN "role" SET NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Create old enum type (only with roles that existed before)
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum_old" AS ENUM(
                'admin', 
                'user', 
                'khoa', 
                'phong', 
                'viewer', 
                'system'
            )
        `);

        // Add temporary column with old enum
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "role_old" "public"."users_role_enum_old"
        `);

        // Revert back to old roles
        await queryRunner.query(`
            UPDATE users 
            SET role_old = CASE 
                WHEN role = 'manager' THEN 'khoa'::users_role_enum_old
                WHEN role = 'specialist' THEN 'phong'::users_role_enum_old
                WHEN role = 'admin' THEN 'admin'::users_role_enum_old
                WHEN role = 'user' THEN 'user'::users_role_enum_old
                ELSE 'user'::users_role_enum_old
            END
        `);

        // Drop new column and rename old one back
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "role_old" TO "role"`);

        // Drop new enum and rename old one back
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`);

        // Set constraints
        await queryRunner.query(`
            ALTER TABLE "users" 
            ALTER COLUMN "role" SET DEFAULT 'user',
            ALTER COLUMN "role" SET NOT NULL
        `);
    }
}
