import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/modules/user/entities/user.entity';
import { Role } from '../src/modules/user/entities/role.entity';

async function setupAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('Setting up admin user and roles...');

    // Kiểm tra xem có role 'admin' chưa
    const roleRepository = dataSource.getRepository(Role);
    let adminRole = await roleRepository.findOne({ where: { roleName: 'admin' } });
    
    if (!adminRole) {
      // Tạo role admin
      adminRole = roleRepository.create({ roleName: 'admin' });
      await roleRepository.save(adminRole);
      console.log('Admin role created');
    }

    // Tìm user admin@htqt.edu.vn
    const userRepository = dataSource.getRepository(User);
    const adminUser = await userRepository.findOne({ 
      where: { email: 'admin@htqt.edu.vn' },
      relations: ['roles']
    });

    if (!adminUser) {
      console.log('Admin user not found!');
      process.exit(1);
    }

    // Kiểm tra xem user đã có role admin chưa
    const hasAdminRole = adminUser.roles.some(role => role.roleName === 'admin');
    
    if (!hasAdminRole) {
      // Assign admin role cho user
      adminUser.roles.push(adminRole);
      await userRepository.save(adminUser);
      console.log('Admin role assigned to admin@htqt.edu.vn');
    } else {
      console.log('Admin user already has admin role');
    }

    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    await app.close();
  }
}

setupAdmin();
