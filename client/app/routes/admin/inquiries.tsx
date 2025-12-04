import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { showToast } from '~/components/Toast';
import Spinner from '~/components/Spinner';
import { adminFetch } from '~/utils/csrf';

interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    eventType: string;
    serviceRequired: string;
    language: string;
    style: string;
    message: string;
    status: 'new' | 'contacted' | 'resolved';
    createdAt: string;
}

export default function InquiriesListAdmin() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchInquiries();
    }, [statusFilter]);

    const fetchInquiries = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);

            const response = await adminFetch(`/api/v1/inquiries?${params}`);
            const data = await response.json();
            setInquiries(data.data || []);
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
            showToast('Failed to load inquiries', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            new: 'bg-blue-100 text-blue-800',
            contacted: 'bg-yellow-100 text-yellow-800',
            resolved: 'bg-green-100 text-green-800',
        };
        return styles[status as keyof typeof styles] || styles.new;
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Contact Inquiries</h1>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

            {inquiries.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-gray-500 text-lg">No inquiries found</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {inquiries.map((inquiry) => (
                                <tr key={inquiry.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {inquiry.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>{inquiry.email}</div>
                                        <div>{inquiry.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {inquiry.eventType || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(inquiry.status)}`}>
                                            {inquiry.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(inquiry.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            to={`/admin/inquiries/${inquiry.id}`}
                                            className="text-purple-600 hover:text-purple-900"
                                        >
                                            View Details →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
