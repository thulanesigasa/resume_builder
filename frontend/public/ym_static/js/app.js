import { validateRegistrationForm } from './validation.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Toast Notification System
    const toastContainer = document.getElementById('toast-container');
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }

    // 2. YVP Form Submission Logic with Validation
    const yvpForm = document.getElementById('yvp-form');
    const successMessage = document.getElementById('success-message');
    const submitBtn = document.getElementById('submit-btn');

    if (yvpForm) {
        yvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(yvpForm);
            const data = Object.fromEntries(formData.entries());
            
            // Input Validation & Sanitization via Module
            const validationResult = validateRegistrationForm(data);
            if (!validationResult.isValid) {
                showToast(validationResult.errors[0], 'error');
                return;
            }

            // UI Feedback
            submitBtn.querySelector('span').textContent = 'Registering...';
            submitBtn.disabled = true;

            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            // Send Real Backend Call with sanitized data
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    body: JSON.stringify(validationResult.sanitizedData)
                });
                
                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || 'Registration failed');
                }
                
                // Success State: Only visible after 200 OK
                yvpForm.style.display = 'none';
                successMessage.classList.remove('hidden');
                showToast('Registration successful! Welcome to the family.', 'success');
                
                // Entrance animation for success message
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    successMessage.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                    successMessage.style.opacity = '1';
                    successMessage.style.transform = 'translateY(0)';
                }, 100);

            } catch (error) {
                console.error('Registration failed:', error);
                showToast(error.message || 'Registration failed. Please try again.', 'error');
                submitBtn.querySelector('span').textContent = 'Register Now';
                submitBtn.disabled = false;
            }
        });
    }
});
