import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { showToast } from '~/components/Toast';
import Spinner from '~/components/Spinner';
import { adminFetch } from '~/utils/csrf';

export default function MusicForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        audioUrl: '',
        coverImageUrl: '',
        duration: '',
        orderPosition: '0',
        isActive: true
    });

    useEffect(() => {
        if (id) {
            fetchTrack();
        }
    }, [id]);

    const fetchTrack = async () => {
        setLoading(true);
        try {
            const response = await adminFetch(`/api/v1/admin/music/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch track');
            }
            const track = await response.json();
            setFormData({
                title: track.title,
                artist: track.artist || '',
                audioUrl: track.audioUrl,
                coverImageUrl: track.coverImageUrl,
                duration: track.duration?.toString() || '',
                orderPosition: track.orderPosition?.toString() || '0',
                isActive: track.isActive
            });
        } catch (error) {
            console.error('Failed to fetch track:', error);
            showToast('Failed to load track', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = id ? `/api/v1/admin/music/${id}` : `/api/v1/admin/music`;
            const method = id ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                duration: formData.duration ? parseInt(formData.duration) : undefined,
                orderPosition: parseInt(formData.orderPosition)
            };

            const response = await adminFetch(url, {
                method,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save track');
            }

            showToast(id ? 'Track updated successfully!' : 'Track created successfully!', 'success');
            setTimeout(() => navigate('/admin/music'), 1000);
        } catch (error: any) {
            console.error('Failed to save track:', error);
            showToast(error.message || 'Failed to save track', 'error');
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
                {id ? 'Edit Music Track' : 'Upload New Track'}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Artist
                    </label>
                    <input
                        type="text"
                        value={formData.artist}
                        onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Audio URL *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.audioUrl}
                        onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="/audios/track.mp3"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image URL *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.coverImageUrl}
                        onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="/photos/haldi.jpg"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration (seconds)
                        </label>
                        <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Order Position
                        </label>
                        <input
                            type="number"
                            value={formData.orderPosition}
                            onChange={(e) => setFormData({ ...formData, orderPosition: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                        Active
                    </label>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {submitting && <Spinner size="sm" />}
                        {submitting ? 'Saving...' : (id ? 'Update Track' : 'Create Track')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/music')}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
