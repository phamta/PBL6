const fetch = require('node-fetch');

async function createAdmin() {
    try {
        const response = await fetch('http://localhost:3001/api/v1/auth/register', {
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

        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Admin user created successfully:', data);
        } else {
            console.log('ℹ️ Admin user response:', data);
        }
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
    }
}

createAdmin();
