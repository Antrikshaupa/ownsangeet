import { useState, useEffect } from 'react';
import { adminFetch } from '~/utils/csrf';
import { showToast } from '~/components/Toast';

export default function APIKeysAdmin() {
    const [keys, setKeys] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');

    const [generatedKey, setGeneratedKey] = useState<string | null>(null);

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            const response = await adminFetch('/api/v1/admin/api-keys');
            if (!response.ok) throw new Error('Failed to fetch keys');
            const data = await response.json();
            setKeys(data || []);
        } catch (error) {
            console.error('Failed to fetch API keys:', error);
            showToast('Failed to load API keys', 'error');
        } finally {
            setLoading(false);
        }
    };

    const generateKey = async () => {
        if (!newKeyName.trim()) {
            showToast('Please enter a name for the API key', 'error');
            return;
        }

        try {
            const response = await adminFetch('/api/v1/admin/api-keys', {
                method: 'POST',
                body: JSON.stringify({ name: newKeyName })
            });

            if (!response.ok) throw new Error('Failed to generate key');
            const data = await response.json();

            setGeneratedKey(data.key);
            setNewKeyName('');
            setShowCreateForm(false);
            fetchKeys();
            showToast('API Key generated successfully', 'success');
        } catch (error) {
            console.error('Failed to generate key:', error);
            showToast('Failed to generate API key', 'error');
        }
    };

    const revokeKey = async (id: string) => {
        if (!confirm('Are you sure you want to revoke this API key?')) return;

        try {
            const response = await adminFetch(`/api/v1/admin/api-keys/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to revoke key');

            setKeys(keys.filter(k => k.id !== id));
            showToast('API Key revoked successfully', 'success');
        } catch (error) {
            console.error('Failed to revoke key:', error);
            showToast('Failed to revoke API key', 'error');
        }
    };

    const copyToClipboard = () => {
        if (generatedKey) {
            navigator.clipboard.writeText(generatedKey);
            showToast('API Key copied to clipboard!', 'success');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">API Keys</h1>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    🔑 Generate New Key
                </button>
            </div>

            {/* Generated Key Modal */}
            {generatedKey && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">API Key Created Successfully</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Please copy your API key now. You won't be able to see it again!
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200 break-all font-mono text-sm text-gray-800">
                            {generatedKey}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={copyToClipboard}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Copy to Clipboard
                            </button>
                            <button
                                onClick={() => setGeneratedKey(null)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCreateForm && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Generate New API Key</h2>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Key name (e.g., n8n-webhook)"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                        />
                        <button
                            onClick={generateKey}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Generate
                        </button>
                        <button
                            onClick={() => setShowCreateForm(false)}
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Using Your API Key</h3>
                    <p className="text-gray-600 mb-4">
                        Include your API key in the <code>X-API-Key</code> header of your requests.
                    </p>
                    <div className="bg-gray-800 text-gray-200 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                        curl -X POST http://localhost:5000/api/v1/webhooks/blog-generation \<br />
                        &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                        &nbsp;&nbsp;-H "X-API-Key: YOUR_API_KEY" \<br />
                        &nbsp;&nbsp;-d '&#123;"title": "My Blog Post", "content": "..."&#125;'
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Actions</h3>
                    <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start">
                            <span className="mr-2">🤖</span>
                            <span>
                                <strong>n8n Blog Generation:</strong> Automate blog posting via the <code>/api/v1/webhooks/blog-generation</code> endpoint.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">📝</span>
                            <span>
                                <strong>Content Management:</strong> Create, update, and manage content programmatically (coming soon).
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">🔒</span>
                            <span>
                                <strong>Secure Access:</strong> All API requests are rate-limited and secured.
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Used</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {keys.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    No API keys yet. Generate one to get started.
                                </td>
                            </tr>
                        ) : (
                            keys.map((key) => (
                                <tr key={key.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {key.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${key.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {key.isActive ? 'Active' : 'Revoked'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {key.lastUsedAt
                                            ? new Date(key.lastUsedAt).toLocaleDateString()
                                            : 'Never'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(key.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {key.isActive && (
                                            <button
                                                onClick={() => revokeKey(key.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Revoke
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
