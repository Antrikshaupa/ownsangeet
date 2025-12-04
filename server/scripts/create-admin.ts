import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@ownsangeet.com';
    const password = 'Admin@123'; // Change this to a secure password

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        console.log('❌ Admin user already exists with email:', email);
        return;
    }

    // Create admin user
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            role: 'super_admin',
            isActive: true
        }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 User ID:', user.id);
    console.log('\n⚠️  IMPORTANT: Please change this password after first login!');
}

main()
    .catch((e) => {
        console.error('Error creating admin user:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
