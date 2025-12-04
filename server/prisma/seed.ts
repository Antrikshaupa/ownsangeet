import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Seed Admin User
    const adminEmail = 'admin@ownsangeet.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        const bcrypt = require('bcryptjs');
        const passwordHash = await bcrypt.hash('admin123', 10);

        await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash: passwordHash,
                role: 'super_admin',
                isActive: true
            }
        });
        console.log('✅ Admin user created: admin@ownsangeet.com / admin123');
    } else {
        console.log('ℹ️  Admin user already exists');
    }

    // 2. Seed Pages (Home Page Content)
    // We will structure the Home Page content as a JSON block
    const homePageContent = {
        blocks: [
            {
                type: 'hero',
                data: {
                    heading: 'Your Story, Your Song',
                    subheading: 'We craft unforgettable, custom-made songs for all of life\'s biggest moments. From wedding anthems to corporate jingles, we turn your ideas into music.',
                    ctaText: 'Get Started',
                    ctaLink: '#contact'
                }
            },
            {
                type: 'services',
                data: {
                    heading: 'Custom Songs for Every Occasion',
                    subheading: 'From intimate gatherings to grand celebrations, we provide a truly personal soundtrack for your most important events.',
                    items: [
                        {
                            title: "Custom Wedding Anthems",
                            description: "Immortalize your love story. We craft unique songs for your Haldi, Mehendi, or Sangeet, weaving your names, memories, and journey into a beautiful anthem for your special day.",
                            icon: "💒",
                            gradient: "from-pink-500 to-purple-600"
                        },
                        {
                            title: "Corporate & Brand Anthems",
                            description: "Elevate your brand with a unique sonic identity. We produce custom jingles, promotional music, and official anthems that capture your brand's message and resonate with your audience.",
                            icon: "💼",
                            gradient: "from-green-500 to-emerald-600"
                        },
                        {
                            title: "Devotional & Cultural Music",
                            description: "Honor your faith and heritage with custom devotional songs. We compose personalized bhajans and tracks for religious gatherings like Bhagwat katha, mata ki chowki, and community festivals.",
                            icon: "🎭",
                            gradient: "from-red-500 to-pink-600"
                        },
                        {
                            title: "Celebration & Party Tracks",
                            description: "Energize any celebration, from birthdays to anniversaries. We compose custom tracks for dance competitions or flash mobs, creating music that matches the vibe and gets everyone moving.",
                            icon: "🎉",
                            gradient: "from-blue-500 to-cyan-500"
                        },
                        {
                            title: "Instrumentals & Scores",
                            description: "Need a unique background score? We create instrumental-only tracks for videos, presentations, or podcasts that need a one-of-a-kind sound without vocals.",
                            icon: "🎵",
                            gradient: "from-yellow-500 to-orange-500"
                        },
                        {
                            title: "Songs for Special Moments",
                            description: "From a heartfelt proposal to a family slideshow, we create the perfect musical backdrop. Tell us the moment, and we'll write its soundtrack.",
                            icon: "✨",
                            gradient: "from-indigo-500 to-purple-600"
                        }
                    ]
                }
            },
            {
                type: 'testimonials',
                data: {
                    heading: 'What Our Clients Say',
                    items: [
                        {
                            quote: "Hearing our love story turned into a song was the most magical part of our wedding. The team captured our journey perfectly. Our families had it on repeat during the whole Sangeet!",
                            name: "Aisha and Vikram Patel",
                            event: "Custom Wedding Anthem"
                        },
                        {
                            quote: "The jingle they created for our new product launch was incredibly catchy and professional. It perfectly matched our brand's energy and has been a huge hit in our marketing campaign.",
                            name: "Riya Sharma, Marketing Head",
                            event: "Corporate Jingle"
                        },
                        {
                            quote: "I commissioned a surprise song for my parents' 50th anniversary, and it was the best gift I could have given. They wove in so many family memories. There wasn't a dry eye in the room.",
                            name: "Arjun Desai",
                            event: "Anniversary Song"
                        },
                        {
                            quote: "The devotional song created for our community event was soulful and beautifully composed. It set the perfect tone for the evening and was appreciated by everyone.",
                            name: "Priya Mehta",
                            event: "Devotional Song"
                        },
                        {
                            quote: "Our brand anthem has been a game-changer. It's energetic, memorable, and captures our company's spirit perfectly. The team was a pleasure to work with.",
                            name: "Sameer Verma, CEO",
                            event: "Brand Anthem"
                        },
                        {
                            quote: "I wanted a unique birthday song for my daughter, and they delivered beyond my expectations. It was the highlight of the party!",
                            name: "Neha Gupta",
                            event: "Birthday Song"
                        }
                    ]
                }
            },
            {
                type: 'faq',
                data: {
                    heading: 'Frequently Asked Questions',
                    subheading: 'Have questions? We\'ve got answers. Here are the details about our custom song creation process.',
                    categories: [
                        {
                            categoryTitle: "A. About Our Service",
                            items: [
                                {
                                    question: "What exactly do you create?",
                                    answer: "We craft fully customized songs—lyrics, composition, vocals or instrumental tracks—tailored to your event, brand, or personal story."
                                },
                                {
                                    question: "Which occasions do you serve?",
                                    answer: "Family ceremonies (haldi, mehndi, sangeet, birthdays, anniversaries), religious gatherings (Bhagwat katha, mata ki chowki, jagran), community festivals, corporate promos, dance competitions—essentially any function needing a unique soundtrack."
                                },
                                {
                                    question: "Do you handle corporate projects?",
                                    answer: "Yes. We compose jingles, anthems, promotional tracks, and sonic logos that match brand guidelines and campaign goals."
                                },
                                {
                                    question: "Can I order instrumental-only tracks?",
                                    answer: "Absolutely. Choose full vocals, instrumental, or mixed versions."
                                },
                                {
                                    question: "In which languages can you write lyrics?",
                                    answer: "Hindi, English, Punjabi, Bhojpuri, Gujarati, Marathi—plus most Indian regional languages on request."
                                },
                                {
                                    question: "What musical styles can you produce?",
                                    answer: "From devotional bhajans to Bollywood, EDM, folk, lo-fi, and orchestral—you name the vibe, we compose it."
                                },
                                {
                                    question: 'Is the music truly "personalized"?',
                                    answer: "Yes. We incorporate your stories, names, slogans, or spiritual verses so the song feels one-of-a-kind."
                                },
                                {
                                    question: "Do you cover dance routines or flash-mobs?",
                                    answer: "Yes. We can build tempo, drop points, and loop sections specifically for choreographed performances."
                                },
                                {
                                    question: "Who owns the song after delivery?",
                                    answer: "You receive 100% master and publishing rights—but we jointly register the track so you also earn 50% lifetime royalties from streaming platforms."
                                },
                                {
                                    question: "Can I keep the song private?",
                                    answer: 'Sure. Just select the "private release" option and we won\'t publish it publicly.'
                                }
                            ]
                        },
                        {
                            categoryTitle: "B. Process & Turnaround",
                            items: [
                                {
                                    question: "How do I start an order?",
                                    answer: "Fill our online brief or call our team, share event details, musical taste, preferred language, and any must-mention names or themes."
                                },
                                {
                                    question: "What is the standard delivery time?",
                                    answer: "4 calendar days."
                                },
                                {
                                    question: 'Do you offer a rush or "emergency" service?',
                                    answer: "Yes—48-hour turnaround. Rush fees apply because we prioritize studio time and extra staff."
                                },
                                {
                                    question: "How many concepts will I receive?",
                                    answer: "We typically provide two distinct melody/arrangement ideas; you pick one for full production."
                                },
                                {
                                    question: "How many revisions are included?",
                                    answer: "Two revision rounds (lyrics or mix tweaks) are complimentary. Extra rounds are billed modestly."
                                },
                                {
                                    question: "Can I choose the singer?",
                                    answer: "Yes. We maintain a roster of male, female, and choir vocalists across genres. Singer choice may affect pricing."
                                },
                                {
                                    question: "Can you integrate my own voice clips?",
                                    answer: "It depends on the circumstances—specifically the audio quality and how well the clips fit the arrangement. Share your recordings with us and we'll confirm feasibility."
                                },
                                {
                                    question: "What if I need lyrics only?",
                                    answer: "We offer standalone lyric-writing with optional basic composition for your own arranger."
                                }
                            ]
                        },
                        {
                            categoryTitle: "C. Formats & Delivery",
                            items: [
                                {
                                    question: "Which file types do you supply?",
                                    answer: "High-quality WAV (24-bit) and MP3 (320 kbps) by default; AAC, FLAC, or stems are available on request."
                                },
                                {
                                    question: "How will I receive my files?",
                                    answer: "Via a secure download link plus a cloud backup that remains active for one year."
                                },
                                {
                                    question: "Can I request different lengths (e.g., 30-sec)?",
                                    answer: "Yes—radio edits, reels, teasers, or looped background versions are included if specified upfront."
                                },
                                {
                                    question: "Is mastering included?",
                                    answer: "Every track is professionally mixed and mastered to broadcast standards (-14 LUFS for streaming)."
                                },
                                {
                                    question: "Do you provide karaoke versions?",
                                    answer: "Yes—a vocal-free mix is supplied at no extra cost."
                                }
                            ]
                        },
                        {
                            categoryTitle: "D. Publishing & Royalties",
                            items: [
                                {
                                    question: "Which platforms will my song appear on?",
                                    answer: "30+ outlets including Spotify, Apple Music, Amazon Music, JioSaavn, Gaana, YouTube & YouTube Music, Instagram Reels, Facebook, Snapchat Sounds, and more."
                                },
                                {
                                    question: "How long does publishing take?",
                                    answer: "3–7 days after you sign off the master."
                                },
                                {
                                    question: "How does the 50% lifetime royalty work?",
                                    answer: "We handle distribution and collect royalties; 50% of net streaming income is transferred to you quarterly."
                                },
                                {
                                    question: "Who manages streaming distribution and dashboards?",
                                    answer: "Our distribution partner Own Sangeet uploads your track and handles royalty collection. You'll receive secure dashboard access through them to monitor streams and earnings in real time."
                                },
                                {
                                    question: "Will my name show as the artist?",
                                    answer: 'Choose "Artist Attribution" at checkout and we\'ll list you (or a stage name) as the primary or featured artist.'
                                }
                            ]
                        },
                        {
                            categoryTitle: "E. Pricing & Payment",
                            items: [
                                {
                                    question: "How is pricing calculated?",
                                    answer: "Scope factors include lyrical complexity, singer tier, instrumentation, language, and turnaround speed."
                                },
                                {
                                    question: "What payment methods do you accept?",
                                    answer: "UPI, credit/debit cards, bank transfer, PayPal, and corporate PO for businesses."
                                },
                                {
                                    question: "Is there a deposit?",
                                    answer: "Yes—a 50% advance begins production; balance is due upon final approval."
                                },
                                {
                                    question: "Are there any hidden costs?",
                                    answer: "None. All charges are quoted upfront, including distribution and copyright registration fees."
                                },
                                {
                                    question: "Do you offer discounts for multiple songs?",
                                    answer: "Yes—bundle pricing and loyalty credits for repeat clients and event planners."
                                }
                            ]
                        },
                        {
                            categoryTitle: "F. Legal & Copyright",
                            items: [
                                {
                                    question: "Do I need to worry about copyright strikes?",
                                    answer: "No. We create original compositions and handle copyright registration to protect you."
                                },
                                {
                                    question: "Can I monetize videos using the song?",
                                    answer: "Yes—you're free to use the track in monetized YouTube or social-media content."
                                },
                                {
                                    question: "Can I resell or license the song to others?",
                                    answer: "Yes, once you hold the rights, you may license it further, though we'd love to help negotiate fair terms."
                                },
                                {
                                    question: "What if someone else claims my music?",
                                    answer: "Provide the claim notice; our legal team will issue a takedown or ownership proof within 48 hours."
                                },
                                {
                                    question: "Do you sign NDAs for private events?",
                                    answer: "Of course—confidentiality agreements are standard for corporate or sensitive family projects."
                                }
                            ]
                        },
                        {
                            categoryTitle: "G. Support & After-Sales",
                            items: [
                                {
                                    question: "How do I contact you?",
                                    answer: "WhatsApp, email, or our 24/7 hotline. Response time: under 2 hours during business days."
                                },
                                {
                                    question: "Do you offer on-site performance or DJ services?",
                                    answer: "No, we currently don't provide on-site performance or DJ services, but we can recommend trusted partners if needed."
                                },
                                {
                                    question: "What if I lose my files later?",
                                    answer: "We keep a secure archive; re-delivery is free during the first year and nominal afterward."
                                },
                                {
                                    question: "Can you create lyric videos or reels?",
                                    answer: 'Yes—add our "visual bundle" for animated lyric videos, vertical reels, and teaser clips.'
                                },
                                {
                                    question: "Do you provide ISRC and UPC codes?",
                                    answer: "Yes—they're included for global digital distribution and royalty tracking."
                                }
                            ]
                        },
                        {
                            categoryTitle: "H. Special Requests & Extras",
                            items: [
                                {
                                    question: "Can you sync songs to photo slideshows?",
                                    answer: "Yes—provide images and we'll align the music dynamically."
                                },
                                {
                                    question: "Do you compose theme music for podcasts or YouTube intros?",
                                    answer: 'Certainly—select "Digital Branding Package" for shorter stingers and loops.'
                                },
                                {
                                    question: "Can you handle multiregional medleys?",
                                    answer: "Yes—we can merge multiple languages or styles into one seamless medley."
                                },
                                {
                                    question: "Do you offer voiceovers or spoken blessings?",
                                    answer: "Yes—celebrity voiceovers, shlokas, or parental blessings can be layered into the track."
                                },
                                {
                                    question: "What if I'm not satisfied?",
                                    answer: 'Our "Love-It Guarantee" lets you request additional revisions or a partial refund per our policy—though 97% of clients sign off on the first master!'
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    };

    // Upsert Home Page
    await prisma.page.upsert({
        where: { slug: 'home' },
        update: { content: JSON.stringify(homePageContent) },
        create: {
            slug: 'home',
            title: 'Home Page',
            content: JSON.stringify(homePageContent),
            isPublished: true,
            metaTitle: 'Own Sangeet - Custom Songs for Your Special Moments',
            metaDescription: 'We craft unforgettable, custom-made songs for all of life\'s biggest moments. From wedding anthems to corporate jingles, we turn your ideas into music.'
        }
    });

    // 3. Seed Music Tracks
    const tracks = [
        {
            title: "Indian Wedding",
            audioUrl: "/audios/104545-7-phere-1.mp3",
            coverImageUrl: "/photos/104545-7-phere-1.jpeg",
            orderPosition: 1
        },
        {
            title: "Birthday Party",
            audioUrl: "/audios/Firstbirthday_delhiphotographer_birthdayphotography_photoshoot_photography_delhi_Gurgaon_candid_013.mp3",
            coverImageUrl: "/photos/Firstbirthday_delhiphotographer_birthdayphotography_photoshoot_photography_delhi_Gurgaon_candid_013.jpg",
            orderPosition: 2
        },
        {
            title: "Indian Party",
            audioUrl: "/audios/Group-dance-songs-_-WItty-Vows-_-Dream-Diaries.mp3",
            coverImageUrl: "/photos/Group-dance-songs-_-WItty-Vows-_-Dream-Diaries.webp",
            orderPosition: 3
        },
        {
            title: "Indian Culture",
            audioUrl: "/audios/haldi.mp3",
            coverImageUrl: "/photos/haldi.jpg",
            orderPosition: 4
        },
        {
            title: "Proposal",
            audioUrl: "/audios/praposal.mp3",
            coverImageUrl: "/photos/praposal.jpg",
            orderPosition: 5
        },
        {
            title: "Special Occasion",
            audioUrl: "/audios/special occasion.mp3",
            coverImageUrl: "/photos/special occasion.jpg",
            orderPosition: 6
        },
        {
            title: "Ladies Sangeet",
            audioUrl: "/audios/ladies-sangeet-gautam-khullar.mp3",
            coverImageUrl: "/photos/ladies-sangeet-gautam-khullar.jpeg",
            orderPosition: 7
        },
        {
            title: "Custom Event",
            audioUrl: "/audios/8157b39c1e592d34df1e94f97a0173fc.mp3",
            coverImageUrl: "/photos/8157b39c1e592d34df1e94f97a0173fc.png",
            orderPosition: 8
        }
    ];

    for (const track of tracks) {
        // Check if exists by title (approximate check)
        const existing = await prisma.musicTrack.findFirst({ where: { title: track.title } });
        if (!existing) {
            await prisma.musicTrack.create({
                data: {
                    ...track,
                    isActive: true
                }
            });
        }
    }

    // 4. Seed Blog Posts
    const blogPosts = [
        {
            slug: 'welcome-to-own-sangeet',
            title: 'Welcome to Own Sangeet: Your Personal Songwriting Studio',
            excerpt: 'Discover how we turn your stories into custom songs for weddings, birthdays, and corporate events.',
            content: `
# Welcome to Own Sangeet

Music has the power to tell stories, evoke emotions, and create lasting memories. At **Own Sangeet**, we believe that every story deserves its own song.

## What We Do

We are a collective of passionate songwriters, composers, and producers dedicated to transforming your memories, feelings, and ideas into one-of-a-kind musical pieces.

### Our Services

- **Custom Wedding Anthems**: Immortalize your love story.
- **Corporate Jingles**: Elevate your brand identity.
- **Personalized Gifts**: Birthday songs, anniversary tracks, and more.

## How It Works

1. **Share Your Story**: Tell us about your event and your vision.
2. **We Compose**: Our team creates a unique track for you.
3. **You Celebrate**: Play your custom song and make the moment unforgettable.

Contact us today to get started!
      `,
            featuredImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            authorType: 'human',
            status: 'published',
            publishedAt: new Date(),
            tags: 'News, Announcements'
        }
    ];

    for (const post of blogPosts) {
        const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
        if (!existing) {
            await prisma.blogPost.create({
                data: post
            });
        }
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
