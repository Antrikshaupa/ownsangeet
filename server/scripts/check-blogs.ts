import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('\n🔍 Checking blog posts...\n');

    // Get all blog posts
    const allPosts = await prisma.blogPost.findMany();
    console.log(`Total posts in database: ${allPosts.length}`);

    allPosts.forEach((post, i) => {
        console.log(`\n${i + 1}. ${post.title}`);
        console.log(`   ID: ${post.id}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Status: ${post.status}`);
        console.log(`   Published At: ${post.publishedAt}`);
    });

    // Get only published posts (what the public API returns)
    const publishedPosts = await prisma.blogPost.findMany({
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' }
    });

    console.log(`\n\n📊 Published posts (visible on website): ${publishedPosts.length}`);

    if (publishedPosts.length === 0) {
        console.log('\n❌ No published posts found!');
        console.log('   Your posts are probably still in "draft" status.');
        console.log('   Go to admin panel and change status to "published".');
    } else {
        console.log('\n✅ Published posts:');
        publishedPosts.forEach((post, i) => {
            console.log(`   ${i + 1}. ${post.title} (${post.slug})`);
        });
    }

    // Auto-publish if user wants
    const draftPosts = allPosts.filter(p => p.status === 'draft');
    if (draftPosts.length > 0) {
        console.log(`\n\n💡 Found ${draftPosts.length} draft post(s).`);
        console.log('   Run this script with "--publish" to auto-publish them all.');

        if (process.argv.includes('--publish')) {
            console.log('\n📤 Publishing all draft posts...');
            for (const post of draftPosts) {
                await prisma.blogPost.update({
                    where: { id: post.id },
                    data: {
                        status: 'published',
                        publishedAt: new Date()
                    }
                });
                console.log(`   ✅ Published: ${post.title}`);
            }
            console.log('\n🎉 All posts are now published!');
        }
    }
}

main()
    .catch((e) => {
        console.error('Error:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
