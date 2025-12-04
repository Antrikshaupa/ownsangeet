import { useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

let toastCounter = 0;
const toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

export const showToast = (message: string, type: ToastType = 'info') => {
    const newToast: Toast = {
        id: toastCounter++,
        message,
        type
    };

    toasts = [...toasts, newToast];
    toastListeners.forEach(listener => listener(toasts));

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toasts = toasts.filter(t => t.id !== newToast.id);
        toastListeners.forEach(listener => listener(toasts));
    }, 4000);
};

export default function ToastContainer() {
    const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const listener = (newToasts: Toast[]) => setCurrentToasts(newToasts);
        toastListeners.push(listener);
        return () => {
            const index = toastListeners.indexOf(listener);
            if (index > -1) toastListeners.splice(index, 1);
        };
    }, []);

    const removeToast = (id: number) => {
        toasts = toasts.filter(t => t.id !== id);
        toastListeners.forEach(listener => listener(toasts));
    };

    const typeStyles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };

    const typeIcons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {currentToasts.map(toast => (
                <div
                    key={toast.id}
                    className={`${typeStyles[toast.type]} px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-in`}
                >
                    <span className="text-xl font-bold">{typeIcons[toast.type]}</span>
                    <span className="flex-1">{toast.message}</span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-white hover:text-gray-200 font-bold text-lg"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}
