import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add JWT token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If unauthorized, clear token and redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// =====================================
// AUTH API
// =====================================

export const authAPI = {
    /**
     * Register a new user
     * @param {Object} userData - { name, email, password }
     */
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    /**
     * Login user
     * @param {Object} credentials - { email, password }
     */
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
};

// =====================================
// INVENTORY API
// =====================================

export const inventoryAPI = {
    /**
     * Get all inventory items for the logged-in user
     */
    getAll: async () => {
        const response = await api.get('/inventory');
        return response.data;
    },

    /**
     * Get a single inventory item by ID
     * @param {string} id - Item ID
     */
    getById: async (id) => {
        const response = await api.get(`/inventory/${id}`);
        return response.data;
    },

    /**
     * Create a new inventory item
     * @param {Object} itemData - { name, sku, category, quantity, price, description }
     */
    create: async (itemData) => {
        const response = await api.post('/inventory', itemData);
        return response.data;
    },

    /**
     * Update an inventory item
     * @param {string} id - Item ID
     * @param {Object} itemData - Updated item data
     */
    update: async (id, itemData) => {
        const response = await api.put(`/inventory/${id}`, itemData);
        return response.data;
    },

    /**
     * Delete an inventory item
     * @param {string} id - Item ID
     */
    delete: async (id) => {
        const response = await api.delete(`/inventory/${id}`);
        return response.data;
    },
};

export default api;
