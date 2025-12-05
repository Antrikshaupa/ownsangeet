const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        // Delete all existing users
        await prisma.user.deleteMany({});
        console.log('✅ Cleared existing users');

        // Create new admin
        const hash = await bcrypt.hash('9407361115@Hr', 10);
        const admin = await prisma.user.create({
            data: {
                email: 'hr@ownsangeet.com',
                passwordHash: hash,
                role: 'super_admin',
                isActive: true
            }
        });

        console.log('✅ Admin user created:', admin.email);
        console.log('   Role:', admin.role);
        console.log('   ID:', admin.id);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
