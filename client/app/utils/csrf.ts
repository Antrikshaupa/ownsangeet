// CSRF Token utility functions for admin routes
const CSRF_TOKEN_KEY = 'csrfToken';
const API_BASE_URL = '';

export const fetchCsrfToken = async (): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/csrf-token`, {
            credentials: 'include', // Important: sends/receives cookies
        });

        if (!response.ok) {
            throw new Error('Failed to fetch CSRF token');
        }

        const data = await response.json();
        const token = data.csrfToken;

        // Store token in sessionStorage
        sessionStorage.setItem(CSRF_TOKEN_KEY, token);

        return token;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
};

export const getCsrfToken = (): string | null => {
    return sessionStorage.getItem(CSRF_TOKEN_KEY);
};

export const clearCsrfToken = (): void => {
    sessionStorage.removeItem(CSRF_TOKEN_KEY);
};

// Helper function to make authenticated admin API requests with CSRF token
export const adminFetch = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> => {
    const token = localStorage.getItem('token');
    const csrfToken = getCsrfToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Always send cookies for CSRF
    });

    // If we get a CSRF error, try refreshing the token once
    if (response.status === 403) {
        try {
            await fetchCsrfToken();
            const newCsrfToken = getCsrfToken();

            const retryHeaders: HeadersInit = {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...(newCsrfToken && { 'X-CSRF-Token': newCsrfToken }),
                ...options.headers,
            };

            return fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: retryHeaders,
                credentials: 'include',
            });
        } catch (error) {
            console.error('Error refreshing CSRF token:', error);
        }
    }

    return response;
};
