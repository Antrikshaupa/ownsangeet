import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [activity, setActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [statsRes, activityRes] = await Promise.all([
                    axios.get(`${API_BASE}/admin/dashboard/stats`, { headers }),
                    axios.get(`${API_BASE}/admin/dashboard/activity`, { headers })
                ]);

                setStats(statsRes.data);
                setActivity(activityRes.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Pages"
                    value={stats?.pages || 0}
                    icon="📄"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Music Tracks"
                    value={stats?.musicTracks || 0}
                    icon="🎵"
                    color="bg-purple-500"
                />
                <StatCard
                    title="Blog Posts"
                    value={stats?.blogs || 0}
                    icon="📝"
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Views"
                    value={stats?.totalBlogViews || 0}
                    icon="👁️"
                    color="bg-orange-500"
                />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                    {activity.length === 0 ? (
                        <p className="text-gray-500">No recent activity</p>
                    ) : (
                        activity.map((item, index) => (
                            <div key={index} className="flex items-center justify-between border-b pb-3">
                                <div>
                                    <p className="font-medium text-gray-800">{item.title}</p>
                                    <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                                </div>
                                <p className="text-sm text-gray-400">
                                    {new Date(item.timestamp).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/admin/pages/new"
                        className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        ➕ New Page
                    </a>
                    <a
                        href="/admin/music/new"
                        className="flex items-center justify-center px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        🎵 Upload Music
                    </a>
                    <a
                        href="/admin/blogs/new"
                        className="flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        ✏️ Write Blog
                    </a>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                </div>
                <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
