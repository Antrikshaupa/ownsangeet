import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updateAdminCredentials() {
    console.log('🔄 Updating admin credentials...');

    try {
        // New admin credentials
        const newEmail = 'hr@ownsangeet.com';
        const newPassword = '9407361115@Hr';

        // Delete all existing admin users
        const deleted = await prisma.user.deleteMany({});
        console.log(`✅ Deleted ${deleted.count} existing user(s)`);

        // Hash the new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Create new admin user
        const newAdmin = await prisma.user.create({
            data: {
                email: newEmail,
                passwordHash: passwordHash,
                role: 'super_admin',
                isActive: true
            }
        });

        console.log('✅ Admin user created successfully!');
        console.log(`   Email: ${newAdmin.email}`);
        console.log(`   Role: ${newAdmin.role}`);
        console.log(`   ID: ${newAdmin.id}`);
        console.log('\n⚠️  IMPORTANT: Save these credentials securely!');
        console.log(`   Email: ${newEmail}`);
        console.log(`   Password: ${newPassword}`);

    } catch (error) {
        console.error('❌ Error updating admin credentials:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

updateAdminCredentials()
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
