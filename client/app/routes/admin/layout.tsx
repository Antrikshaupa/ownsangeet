import { Outlet, useNavigate, NavLink } from "react-router";
import { useEffect, useState } from "react";
import { fetchCsrfToken, clearCsrfToken } from "~/utils/csrf";

export default function AdminLayout() {
    const navigate = useNavigate();
    const [csrfError, setCsrfError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/admin/login");
            return;
        }

        // Fetch CSRF token on mount
        fetchCsrfToken().catch(error => {
            console.error('Failed to fetch CSRF token:', error);
            setCsrfError('Security initialization failed. Please refresh the page.');
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        clearCsrfToken(); // Clear CSRF token on logout
        navigate("/admin/login");
    };

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `block px-6 py-3 text-gray-700 transition-colors ${isActive ? 'bg-purple-50 text-purple-600 border-r-4 border-purple-600' : 'hover:bg-purple-50 hover:text-purple-600'}`;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-purple-600">Own Sangeet</h1>
                    <p className="text-sm text-gray-500">Admin Panel</p>
                </div>
                <nav className="mt-6">
                    <NavLink to="/admin/dashboard" className={navLinkClass}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/pages" className={navLinkClass}>
                        Pages
                    </NavLink>
                    <NavLink to="/admin/music" className={navLinkClass}>
                        Music Tracks
                    </NavLink>
                    <NavLink to="/admin/blogs" className={navLinkClass}>
                        Blog Posts
                    </NavLink>
                    <NavLink to="/admin/inquiries" className={navLinkClass}>
                        Inquiries
                    </NavLink>
                    <NavLink to="/admin/api-keys" className={navLinkClass}>
                        API Keys
                    </NavLink>
                    <NavLink to="/admin/settings" className={navLinkClass}>
                        Settings
                    </NavLink>
                </nav>
                <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {csrfError && (
                    <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                        {csrfError}
                    </div>
                )}
                <Outlet />
            </main>
        </div>
    );
}
