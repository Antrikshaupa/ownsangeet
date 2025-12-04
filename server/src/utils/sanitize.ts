import validator from 'validator';

// Sanitize string input to prevent XSS
export const sanitizeString = (input: string): string => {
    if (!input) return '';
    // Escape HTML and trim
    return validator.escape(validator.trim(input));
};

// Sanitize email
export const sanitizeEmail = (email: string): string => {
    if (!email) return '';
    const normalized = validator.normalizeEmail(email) || '';
    return validator.trim(normalized);
};

// Validate and sanitize slug
export const sanitizeSlug = (slug: string): string => {
    if (!slug) return '';
    // Remove any characters that aren't alphanumeric, hyphens, or underscores
    return slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
};

// Sanitize URL
export const sanitizeUrl = (url: string): string => {
    if (!url) return '';
    const trimmed = validator.trim(url);
    // Only return if it's a valid URL or relative path
    if (validator.isURL(trimmed) || trimmed.startsWith('/')) {
        return trimmed;
    }
    return '';
};

// Validate password strength
export const isStrongPassword = (password: string): boolean => {
    return validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    });
};

// Sanitize JSON content (keep structure but escape strings)
export const sanitizeJsonContent = (content: any): any => {
    if (typeof content === 'string') {
        try {
            const parsed = JSON.parse(content);
            return sanitizeJsonContent(parsed);
        } catch {
            return validator.escape(content);
        }
    }

    if (Array.isArray(content)) {
        return content.map(item => sanitizeJsonContent(item));
    }

    if (typeof content === 'object' && content !== null) {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(content)) {
            sanitized[key] = sanitizeJsonContent(value);
        }
        return sanitized;
    }

    return content;
};
