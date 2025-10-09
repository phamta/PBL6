import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up old roles...');

  // Delete old role codes that are no longer used
  const oldRoleCodes = ['SYSTEM_ADMIN', 'ADMIN', 'MANAGER', 'SPECIALIST', 'STAFF', 'VIEWER'];
  
  for (const code of oldRoleCodes) {
    try {
      const role = await prisma.role.findUnique({ where: { code } });
      
      if (role) {
        // Delete role permissions
        await prisma.rolePermission.deleteMany({
          where: { roleId: role.id },
        });

        // Delete user roles
        await prisma.userRole.deleteMany({
          where: { roleId: role.id },
        });

        // Delete role
        await prisma.role.delete({
          where: { code },
        });

        console.log(`✅ Deleted old role: ${code}`);
      }
    } catch (error) {
      console.log(`⚠️ Could not delete role ${code}:`, error.message);
    }
  }

  console.log('🎉 Cleanup completed!');

  const roleCount = await prisma.role.count();
  console.log(`\n📊 Total roles now: ${roleCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
