import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
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

export default function InquiryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (id) fetchInquiry();
    }, [id]);

    const fetchInquiry = async () => {
        try {
            const response = await adminFetch(`/api/v1/inquiries/${id}`);
            const data = await response.json();
            setInquiry(data);
        } catch (error) {
            console.error('Failed to fetch inquiry:', error);
            showToast('Failed to load inquiry', 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            const response = await adminFetch(`/api/v1/inquiries/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error('Failed to update status');

            const updated = await response.json();
            setInquiry(updated);
            showToast('Status updated successfully!', 'success');
        } catch (error) {
            console.error('Failed to update status:', error);
            showToast('Failed to update status', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const deleteInquiry = async () => {
        if (!confirm('Are you sure you want to delete this inquiry?')) return;

        try {
            const response = await adminFetch(`/api/v1/inquiries/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete inquiry');

            showToast('Inquiry deleted successfully', 'success');
            setTimeout(() => navigate('/admin/inquiries'), 1000);
        } catch (error) {
            console.error('Failed to delete inquiry:', error);
            showToast('Failed to delete inquiry', 'error');
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
    if (!inquiry) return <div>Inquiry not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <Link to="/admin/inquiries" className="text-purple-600 hover:text-purple-700 mb-2 inline-block">
                        ← Back to Inquiries
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Inquiry Details</h1>
                </div>
                <button
                    onClick={deleteInquiry}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Delete Inquiry
                </button>
            </div>

            {/* Contact info Card */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{inquiry.name}</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <a href={`mailto:${inquiry.email}`} className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {inquiry.email}
                    </a>
                    <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {inquiry.phone}
                    </a>
                    <a href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 hover:text-green-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                    </a>
                </div>

                {/* Status Update */}
                <div className="flex items-center gap-4 mb-4">
                    <label className="font-semibold text-gray-700">Status:</label>
                    <select
                        value={inquiry.status}
                        onChange={(e) => updateStatus(e.target.value)}
                        disabled={updating}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                    </select>
                    {updating && <Spinner size="sm" />}
                </div>

                <p className="text-sm text-gray-500">
                    Submitted: {new Date(inquiry.createdAt).toLocaleString()}
                </p>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Inquiry Details</h3>

                {inquiry.eventType && (
                    <div>
                        <label className="font-semibold text-gray-700">Event Type:</label>
                        <p className="text-gray-900">{inquiry.eventType}</p>
                    </div>
                )}

                {inquiry.serviceRequired && (
                    <div>
                        <label className="font-semibold text-gray-700">Service Required:</label>
                        <p className="text-gray-900">{inquiry.serviceRequired}</p>
                    </div>
                )}

                {inquiry.language && (
                    <div>
                        <label className="font-semibold text-gray-700">Preferred Language:</label>
                        <p className="text-gray-900">{inquiry.language}</p>
                    </div>
                )}

                {inquiry.style && (
                    <div>
                        <label className="font-semibold text-gray-700">Musical Style:</label>
                        <p className="text-gray-900">{inquiry.style}</p>
                    </div>
                )}

                <div>
                    <label className="font-semibold text-gray-700">Message:</label>
                    <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg mt-2">
                        {inquiry.message}
                    </p>
                </div>
            </div>
        </div>
    );
}
