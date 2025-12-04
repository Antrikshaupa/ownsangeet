import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { useState } from 'react';

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

interface BlogCardProps {
    post: BlogPost;
    index?: number;
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const tags = post.tags ? post.tags.split(',').slice(0, 2) : [];

    // Calculate read time (rough estimate: 200 words per minute)
    const readTime = Math.max(1, Math.ceil(post.excerpt.split(' ').length / 50));

    // Format date
    const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
        >
            <Link to={`/blog/${post.slug}`} className="block">
                {/* Featured Image with Gradient Overlay */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                    {post.featuredImageUrl && (
                        <>
                            <img
                                src={post.featuredImageUrl}
                                alt={post.title}
                                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                onLoad={() => setImageLoaded(true)}
                                loading="lazy"
                            />
                            {!imageLoaded && (
                                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-purple-200 to-pink-200" />
                            )}
                        </>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* View Count Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-lg">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">{post.viewCount || 0}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-semibold uppercase tracking-wide"
                            >
                                {tag.trim()}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{readTime} min read</span>
                        </div>
                    </div>

                    {/* Read More Arrow */}
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <div className="bg-purple-600 text-white rounded-full p-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
