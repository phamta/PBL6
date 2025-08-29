const fetch = require('node-fetch');

async function checkUsers() {
    try {
        console.log('🔍 Checking if admin user exists...');
        
        // Try to login with admin credentials
        const loginResponse = await fetch('http://localhost:3001/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@university.edu.vn',
                password: 'admin123'
            })
        });

        const loginData = await loginResponse.json();
        
        if (loginResponse.ok) {
            console.log('✅ Admin user exists and can login:', {
                email: loginData.user.email,
                role: loginData.user.role,
                fullName: loginData.user.fullName
            });
            
            // Get all users with the token
            const usersResponse = await fetch('http://localhost:3001/api/v1/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${loginData.token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (usersResponse.ok) {
                const usersData = await usersResponse.json();
                console.log('\n📊 Users in database:');
                usersData.data.forEach((user, index) => {
                    console.log(`${index + 1}. ${user.fullName} (${user.email}) - ${user.role}`);
                });
            } else {
                const errorData = await usersResponse.json();
                console.log('❌ Error fetching users:', errorData);
            }
            
        } else {
            console.log('❌ Admin login failed:', loginData);
            
            // Try to register admin
            console.log('\n🔄 Attempting to register admin user...');
            const registerResponse = await fetch('http://localhost:3001/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'admin@university.edu.vn',
                    password: 'admin123',
                    fullName: 'System Administrator',
                    phone: '0123456789',
                    department: 'IT Department',
                    role: 'ADMIN'
                })
            });
            
            const registerData = await registerResponse.json();
            if (registerResponse.ok) {
                console.log('✅ Admin user created successfully:', registerData);
            } else {
                console.log('❌ Failed to create admin user:', registerData);
            }
        }
    } catch (error) {
        console.error('💥 Error:', error.message);
    }
}

checkUsers();
