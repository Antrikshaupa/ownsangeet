import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import { showToast } from '~/components/Toast';
import Spinner from '~/components/Spinner';

const API_BASE = 'http://localhost:5000/api/v1';

export default function BlogsListAdmin() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        authorType: '',
        page: 1
    });

    useEffect(() => {
        fetchBlogs();
    }, [filters]);

    const fetchBlogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.authorType) params.append('authorType', filters.authorType);
            params.append('page', filters.page.toString());

            const response = await axios.get(`${API_BASE}/admin/blogs?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlogs(response.data.data || response.data);
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
            showToast('Failed to load blog posts', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE}/admin/blogs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlogs(blogs.filter(b => b.id !== id));
            showToast('Blog post deleted successfully', 'success');
        } catch (error) {
            console.error('Failed to delete blog:', error);
            showToast('Failed to delete blog post', 'error');
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Blog Posts</h1>
                <Link
                    to="/admin/blogs/new"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    ✏️ New Blog
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 flex gap-4">
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>

                <select
                    value={filters.authorType}
                    onChange={(e) => setFilters({ ...filters, authorType: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="">All Authors</option>
                    <option value="human">Human</option>
                    <option value="ai">AI</option>
                </select>
            </div>

            {/* Blog List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {blogs.map((blog) => (
                            <tr key={blog.id}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {blog.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 py-1 text-xs rounded-full ${blog.authorType === 'ai'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {blog.authorType === 'ai' ? '🤖 AI' : '👤 Human'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${blog.status === 'published'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {blog.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {blog.viewCount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <Link
                                        to={`/admin/blogs/${blog.id}`}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
