import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import { showToast } from '~/components/Toast';
import Spinner from '~/components/Spinner';

const API_BASE = 'http://localhost:5000/api/v1';

export default function PagesListAdmin() {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE}/admin/pages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPages(response.data);
        } catch (error) {
            console.error('Failed to fetch pages:', error);
            showToast('Failed to load pages', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this page?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE}/admin/pages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPages(pages.filter(p => p.id !== id));
            showToast('Page deleted successfully', 'success');
        } catch (error) {
            console.error('Failed to delete page:', error);
            showToast('Failed to delete page', 'error');
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Pages</h1>
                <Link
                    to="/admin/pages/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    ➕ New Page
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pages.map((page) => (
                            <tr key={page.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {page.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.slug}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${page.isPublished
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {page.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(page.updatedAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <Link
                                        to={`/admin/pages/${page.id}`}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(page.id)}
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
