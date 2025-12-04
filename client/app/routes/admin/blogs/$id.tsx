import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { showToast } from '~/components/Toast';
import Spinner from '~/components/Spinner';
import { adminFetch } from '~/utils/csrf';

const API_BASE = 'http://localhost:5000/api/v1';

export default function BlogForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        excerpt: '',
        content: '',
        featuredImageUrl: '',
        authorType: 'human',
        status: 'draft',
        tags: ''
    });

    useEffect(() => {
        if (id) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        setLoading(true);
        try {
            const response = await adminFetch(`/api/v1/admin/blogs/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch blog');
            }
            const blog = await response.json();
            setFormData({
                slug: blog.slug,
                title: blog.title,
                excerpt: blog.excerpt || '',
                content: blog.content,
                featuredImageUrl: blog.featuredImageUrl || '',
                authorType: blog.authorType,
                status: blog.status,
                tags: blog.tags || ''
            });
        } catch (error) {
            console.error('Failed to fetch blog:', error);
            showToast('Failed to load blog post', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = id ? `/api/v1/admin/blogs/${id}` : `/api/v1/admin/blogs`;
            const method = id ? 'PUT' : 'POST';

            const response = await adminFetch(url, {
                method,
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save blog post');
            }

            showToast(id ? 'Blog post updated successfully!' : 'Blog post created successfully!', 'success');
            setTimeout(() => navigate('/admin/blogs'), 1000);
        } catch (error: any) {
            console.error('Failed to save blog:', error);
            showToast(error.message || 'Failed to save blog post', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {id ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="url-friendly-slug"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Excerpt
                    </label>
                    <textarea
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Short summary..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content (Markdown) *
                    </label>
                    <textarea
                        required
                        rows={15}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                        placeholder="# Blog Title

Your content here..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image URL
                    </label>
                    <input
                        type="text"
                        value={formData.featuredImageUrl}
                        onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (comma-separated)
                    </label>
                    <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="music, technology, news"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Author Type
                        </label>
                        <select
                            value={formData.authorType}
                            onChange={(e) => setFormData({ ...formData, authorType: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                        >
                            <option value="human">Human</option>
                            <option value="ai">AI</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {submitting && <Spinner size="sm" />}
                        {submitting ? 'Saving...' : (id ? 'Update Post' : 'Create Post')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/blogs')}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
