/**
 * YVP Registration Validation Module
 * Provides strict input sanitization and validation.
 */

/**
 * Sanitizes input to prevent basic XSS attacks.
 * @param {string} input - The raw input string.
 * @returns {string} - The sanitized string.
 */
export function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Validates the registration form data.
 * @param {Object} data - The form data object.
 * @returns {Array} - An array of error messages, empty if valid.
 */
export function validateRegistrationForm(data) {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9\-\+\s\(\)]{10,15}$/; // Basic international/local phone format

    // Name Validation
    const name = sanitizeInput(data.name);
    if (!name || name.length < 2) {
        errors.push('Please enter a valid full name (min 2 characters).');
    } else if (name.length > 100) {
        errors.push('Name is too long.');
    }

    // Email Validation
    const email = sanitizeInput(data.email);
    if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address.');
    }

    // Phone Validation
    const phone = sanitizeInput(data.phone);
    if (!phoneRegex.test(phone)) {
        errors.push('Please enter a valid phone number (10-15 digits).');
    }

    return {
        isValid: errors.length === 0,
        errors,
        sanitizedData: { name, email, phone }
    };
}
