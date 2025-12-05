const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdmin() {
    try {
        const email = 'hr@ownsangeet.com';
        const password = 'Password@123'; // Simple temporary password
        const hash = await bcrypt.hash(password, 10);

        // Update or create
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                passwordHash: hash,
                role: 'super_admin',
                isActive: true
            },
            create: {
                email,
                passwordHash: hash,
                role: 'super_admin',
                isActive: true
            }
        });

        console.log('✅ Admin password reset successfully');
        console.log('Email:', email);
        console.log('New Password:', password);
    } catch (error) {
        console.error('❌ Error resetting admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdmin();
