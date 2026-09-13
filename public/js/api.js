const API_BASE_URL = 'http://localhost:5000/api';

async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

const API = {
    getProjects: () => apiRequest('/projects'),
    getTestimonials: () => apiRequest('/testimonials'),
    getSettings: () => apiRequest('/settings'),
    submitContact: (data) => apiRequest('/messages', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    adminLogin: (data) => apiRequest('/admin/login', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getAdminDashboard: () => apiRequest('/admin/dashboard', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
    }),
};