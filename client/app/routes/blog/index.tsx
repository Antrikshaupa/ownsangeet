import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MetaFunction } from 'react-router';
import BlogCard from '../../components/BlogCard';
import SearchBar from '../../components/SearchBar';
import TrendingSection from '../../components/TrendingSection';

// SEO Meta tags for blog list page
export const meta: MetaFunction = () => {
    return [
        { title: 'Blog - Own Sangeet | Custom Music & Songs' },
        { name: 'description', content: 'Discover our latest blog posts about custom music creation, songwriting tips, event music, and behind-the-scenes stories from Own Sangeet.' },
        { name: 'keywords', content: 'custom music blog, songwriting tips, event music, custom songs, music production, Own Sangeet blog' },

        // Open Graph tags for social media
        { property: 'og:title', content: 'Blog - Own Sangeet | Custom Music & Songs' },
        { property: 'og:description', content: 'Discover our latest blog posts about custom music creation, songwriting tips, and event music.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://ownsangeet.com/blog' },

        // Twitter Card tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Blog - Own Sangeet' },
        { name: 'twitter:description', content: 'Discover our latest blog posts about custom music creation and songwriting tips.' },
    ];
};

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    featuredImageUrl: string;
    publishedAt: string;
    tags: string;
    viewCount: number;
}

export default function BlogList() {
    const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
    const [trendingPosts, setTrendingPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Fetch all posts
    useEffect(() => {
        Promise.all([
            fetch('http://localhost:5000/api/v1/blogs').then(res => res.json()),
            fetch('http://localhost:5000/api/v1/blogs/trending?limit=5').then(res => res.json())
        ])
            .then(([posts, trending]) => {
                setAllPosts(posts);
                setTrendingPosts(trending);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Get all unique tags
    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        allPosts.forEach(post => {
            if (post.tags) {
                post.tags.split(',').forEach(tag => tagSet.add(tag.trim()));
            }
        });
        return Array.from(tagSet).slice(0, 8); // Show top 8 tags
    }, [allPosts]);

    // Filter posts based on search and tag
    const filteredPosts = useMemo(() => {
        let filtered = allPosts;

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query) ||
                post.tags.toLowerCase().includes(query)
            );
        }

        // Filter by selected tag
        if (selectedTag) {
            filtered = filtered.filter(post =>
                post.tags.toLowerCase().includes(selectedTag.toLowerCase())
            );
        }

        return filtered;
    }, [allPosts, searchQuery, selectedTag]);

    // Skeleton Loading Component
    const SkeletonCard = () => (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
            <div className="aspect-[16/10] bg-gradient-to-br from-gray-200 to-gray-300" />
            <div className="p-6 space-y-4">
                <div className="flex gap-2">
                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                </div>
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="container mx-auto px-6 py-20">
                    <div className="h-12 bg-gray-200 rounded w-64 mb-12 animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Hero Header */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
                    <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
                    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
                </div>

                <div className="container mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
                    >
                        Our Blog
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
                    >
                        Discover stories, insights, and inspiration from our community
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        <SearchBar onSearch={setSearchQuery} placeholder="Search for articles, topics, or tags..." />
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-6 pb-20">
                {/* Trending Section */}
                {!searchQuery && !selectedTag && trendingPosts.length > 0 && (
                    <TrendingSection posts={trendingPosts} />
                )}

                {/* Tags Filter */}
                {allTags.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-gray-600 font-semibold">Filter by tag:</span>
                            <button
                                onClick={() => setSelectedTag(null)}
                                className={`px-4 py-2 rounded-full transition-all ${selectedTag === null
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                All
                            </button>
                            {allTags.map((tag, i) => (
                                <motion.button
                                    key={tag}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setSelectedTag(tag)}
                                    className={`px-4 py-2 rounded-full transition-all ${selectedTag === tag
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow'
                                        }`}
                                >
                                    {tag}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Blog Posts Grid */}
                <AnimatePresence mode="wait">
                    {filteredPosts.length > 0 ? (
                        <motion.div
                            key="posts-grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredPosts.map((post, index) => (
                                <BlogCard key={post.id} post={post} index={index} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center py-20"
                        >
                            <div className="max-w-md mx-auto">
                                <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">No posts found</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchQuery
                                        ? `We couldn't find any posts matching "${searchQuery}"`
                                        : selectedTag
                                            ? `No posts found for tag "${selectedTag}"`
                                            : "No blog posts available yet"}
                                </p>
                                {(searchQuery || selectedTag) && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedTag(null);
                                        }}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition-all"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Custom Styles for Animations */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
