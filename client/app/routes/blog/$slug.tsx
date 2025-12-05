import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import type { MetaFunction } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

interface BlogPost {
    id: string;
    title: string;
    excerpt?: string;
    content: string;
    featuredImageUrl: string;
    publishedAt: string;
    tags: string;
    authorType: string;
    viewCount: number;
}

// SEO Meta tags - dynamically generated based on blog title from URL
export const meta: MetaFunction = ({ params }) => {
    // Note: This is a basic implementation. For full SSR SEO, you'd need a loader
    const title = params.slug
        ? params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'Blog Post';

    return [
        { title: `${title} - Own Sangeet Blog` },
        { name: 'description', content: 'Read our latest blog post about custom music creation, songwriting, and event entertainment at Own Sangeet.' },
        { name: 'keywords', content: 'custom music, songwriting, event music, own sangeet, blog' },
        { property: 'og:title', content: `${title} - Own Sangeet` },
        { property: 'og:description', content: 'Read our latest blog post about custom music and songwriting.' },
        { property: 'og:type', content: 'article' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
    ];
};

export default function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        fetch(`/api/v1/blogs/${slug}`)
            .then(res => {
                if (!res.ok) throw new Error('Post not found');
                return res.json();
            })
            .then(data => {
                setPost(data);
                setLoading(false);

                // Update document title and meta for better SEO
                if (data.title) {
                    document.title = `${data.title} - Own Sangeet Blog`;

                    // Update meta description dynamically
                    let metaDesc = document.querySelector('meta[name="description"]');
                    if (metaDesc) {
                        const excerpt = data.excerpt || data.content.substring(0, 160).replace(/#/g, '').trim();
                        metaDesc.setAttribute('content', excerpt);
                    }
                }

                // Add JSON-LD structured data for Google crawlers
                const structuredData = {
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": data.title,
                    "description": data.excerpt || data.content.substring(0, 160).replace(/#/g, '').trim(),
                    "image": data.featuredImageUrl || "https://ownsangeet.com/og-image.jpg",
                    "author": {
                        "@type": data.authorType === 'ai' ? "Organization" : "Person",
                        "name": data.authorType === 'ai' ? "AI Assistant" : "Own Sangeet Editorial Team"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Own Sangeet",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://ownsangeet.com/logo.png"
                        }
                    },
                    "datePublished": data.publishedAt,
                    "dateModified": data.updatedAt || data.publishedAt,
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": `https://ownsangeet.com/blog/${slug}`
                    },
                    "keywords": data.tags,
                    "articleBody": data.content,
                    "wordCount": data.content.split(/\s+/).length,
                    "url": `https://ownsangeet.com/blog/${slug}`
                };

                // Inject JSON-LD structured data into page head
                let scriptTag = document.getElementById('blog-structured-data') as HTMLScriptElement | null;
                if (!scriptTag) {
                    scriptTag = document.createElement('script');
                    scriptTag.id = 'blog-structured-data';
                    scriptTag.type = 'application/ld+json';
                    document.head.appendChild(scriptTag);
                }
                scriptTag.textContent = JSON.stringify(structuredData);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-6">Post not found</p>
                    <Link to="/blog" className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                        ← Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Back Button */}
            <div className="container mx-auto px-6 pt-24">
                <Link to="/blog" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-8">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Blog
                </Link>
            </div>

            <article className="container mx-auto px-6 pb-20" itemScope itemType="https://schema.org/BlogPosting">
                {/* Hidden meta for crawlers */}
                <meta itemProp="headline" content={post.title} />
                <meta itemProp="datePublished" content={post.publishedAt} />
                <meta itemProp="author" content={post.authorType === 'ai' ? 'AI Assistant' : 'Editorial Team'} />

                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 text-center"
                    >
                        {/* Tags */}
                        <div className="flex items-center justify-center mb-6 gap-2 flex-wrap">
                            {post.tags && post.tags.split(',').map((tag, i) => (
                                <span key={i} itemProp="keywords" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold">
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>

                        {/* Title */}
                        <h1 itemProp="name headline" className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex items-center justify-center text-gray-600 space-x-4 text-sm md:text-base">
                            <time itemProp="datePublished" dateTime={post.publishedAt}>
                                {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </time>
                            <span>•</span>
                            <span itemProp="author" itemScope itemType="https://schema.org/Person">
                                By <span itemProp="name">{post.authorType === 'ai' ? 'AI Assistant' : 'Editorial Team'}</span>
                            </span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>{post.viewCount || 0} views</span>
                            </div>
                        </div>
                    </motion.header>

                    {/* Featured Image */}
                    {post.featuredImageUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-12 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <img
                                itemProp="image"
                                src={post.featuredImageUrl}
                                alt={post.title}
                                className="w-full h-[400px] md:h-[500px] object-cover"
                            />
                        </motion.div>
                    )}

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
                    >
                        <div itemProp="articleBody" className="blog-content">
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-6" {...props} />,
                                    h4: ({ node, ...props }) => <h4 className="text-xl font-bold text-gray-900 mb-2 mt-4" {...props} />,
                                    p: ({ node, ...props }) => <p className="text-lg text-gray-700 leading-relaxed mb-6" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside text-lg text-gray-700 mb-6 space-y-2" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-lg text-gray-700 mb-6 space-y-2" {...props} />,
                                    li: ({ node, ...props }) => <li className="text-gray-700 ml-4" {...props} />,
                                    a: ({ node, ...props }) => <a className="text-purple-600 hover:text-purple-700 underline font-medium" {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-purple-600 pl-6 italic text-gray-700 my-6" {...props} />,
                                    code: ({ node, ...props }) => <code className="bg-gray-100 text-purple-600 px-2 py-1 rounded font-mono text-sm" {...props} />,
                                    pre: ({ node, ...props }) => <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto mb-6" {...props} />,
                                    img: ({ node, ...props }) => <img className="rounded-xl shadow-lg my-8 w-full" {...props} />,
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </motion.div>

                    {/* Share Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-center"
                    >
                        <Link
                            to="/blog"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition-all font-semibold"
                        >
                            ← Read More Articles
                        </Link>
                    </motion.div>
                </div>
            </article>
        </div>
    );
}
