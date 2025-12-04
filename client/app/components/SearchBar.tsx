import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search blogs..." }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-2xl mx-auto"
        >
            <div
                className={`relative flex items-center bg-white rounded-2xl shadow-lg transition-all duration-300 ${isFocused ? 'ring-4 ring-purple-200 shadow-2xl' : 'hover:shadow-xl'
                    }`}
            >
                {/* Search Icon */}
                <div className="absolute left-5 pointer-events-none">
                    <motion.svg
                        animate={{ rotate: isFocused ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </motion.svg>
                </div>

                {/* Input */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full pl-16 pr-16 py-5 bg-transparent text-gray-800 text-lg placeholder-gray-400 focus:outline-none rounded-2xl"
                />

                {/* Clear Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: query ? 1 : 0,
                        scale: query ? 1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    onClick={handleClear}
                    className="absolute right-5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </motion.button>
            </div>

            {/* Search Results Indicator */}
            {query && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-0 right-0 top-full mt-2 text-center"
                >
                    <span className="text-sm text-gray-500">
                        Searching for <span className="font-semibold text-purple-600">"{query}"</span>
                    </span>
                </motion.div>
            )}

            {/* Decorative Gradient */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20 pointer-events-none" />
        </motion.div>
    );
}
