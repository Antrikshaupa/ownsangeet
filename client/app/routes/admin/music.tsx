import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { showToast } from '~/components/Toast';
import Spinner from '~/components/Spinner';
import { adminFetch } from '~/utils/csrf';

export default function MusicListAdmin() {
    const [tracks, setTracks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTracks();
    }, []);

    const fetchTracks = async () => {
        try {
            const response = await adminFetch('/api/v1/admin/music');
            const data = await response.json();
            setTracks(data);
        } catch (error) {
            console.error('Failed to fetch tracks:', error);
            showToast('Failed to load tracks', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this track?')) return;

        try {
            const response = await adminFetch(`/api/v1/admin/music/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete track');
            }

            setTracks(tracks.filter(t => t.id !== id));
            showToast('Track deleted successfully', 'success');
        } catch (error) {
            console.error('Failed to delete track:', error);
            showToast('Failed to delete track', 'error');
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const response = await adminFetch(`/api/v1/admin/music/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ isActive: !currentStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update track');
            }

            fetchTracks();
            showToast('Track status updated', 'success');
        } catch (error) {
            console.error('Failed to update track:', error);
            showToast('Failed to update track', 'error');
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Music Tracks</h1>
                <Link
                    to="/admin/music/new"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    🎵 Upload Track
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cover</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artist</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plays</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tracks.map((track) => (
                            <tr key={track.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img
                                        src={track.coverImageUrl}
                                        alt={track.title}
                                        className="w-12 h-12 rounded object-cover"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {track.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {track.artist || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {track.playCount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => toggleActive(track.id, track.isActive)}
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${track.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {track.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <Link
                                        to={`/admin/music/${track.id}`}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(track.id)}
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
