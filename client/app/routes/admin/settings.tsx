import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

export default function SettingsAdmin() {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        siteTitle: 'Own Sangeet',
        siteLogo: '',
        metaDescription: 'Custom songs for your special moments',
        socialLinks: {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: ''
        }
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_BASE}/admin/settings`,
                settings,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

            <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Site Configuration</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Site Title
                            </label>
                            <input
                                type="text"
                                value={settings.siteTitle}
                                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Logo URL
                            </label>
                            <input
                                type="text"
                                value={settings.siteLogo}
                                onChange={(e) => setSettings({ ...settings, siteLogo: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="/logo.png"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Description
                            </label>
                            <textarea
                                rows={3}
                                value={settings.metaDescription}
                                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                <hr />

                <div>
                    <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Facebook
                            </label>
                            <input
                                type="text"
                                value={settings.socialLinks.facebook}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="https://facebook.com/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Instagram
                            </label>
                            <input
                                type="text"
                                value={settings.socialLinks.instagram}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="https://instagram.com/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Twitter
                            </label>
                            <input
                                type="text"
                                value={settings.socialLinks.twitter}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    socialLinks: { ...settings.socialLinks, twitter: e.target.value }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="https://twitter.com/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                YouTube
                            </label>
                            <input
                                type="text"
                                value={settings.socialLinks.youtube}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                    </div>
                </div>

                <hr />

                <div>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    ℹ️ <strong>Note:</strong> Settings are currently stored in-memory and will reset on server restart.
                    Database persistence will be added in a future update.
                </p>
            </div>
        </div>
    );
}
