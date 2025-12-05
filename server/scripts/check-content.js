const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkContent() {
    try {
        console.log('--- Checking Blog Posts ---');
        const blogs = await prisma.blogPost.findMany();
        console.log(`Found ${blogs.length} blog posts.`);
        blogs.forEach(blog => {
            console.log(`- [${blog.status}] ${blog.title} (Slug: ${blog.slug})`);
        });

        console.log('\n--- Checking Users ---');
        const users = await prisma.user.findMany({
            select: { id: true, email: true, role: true, isActive: true }
        });
        console.table(users);

    } catch (error) {
        console.error('❌ Error checking content:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkContent();
