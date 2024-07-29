import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:44347/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token'); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export const getUsers = async () => {
    return await api.get('/users');
};

export const createUser = async (user) => {
    return await api.post('/users', user);
};

export const updateUser = async (id, user) => {
    return await api.put(`/users/${id}`, user);
};

export const deleteUser = async (id) => {
    return await api.delete(`/users/${id}`);
};

export const getAccounts = async () => {
    return await api.get('/accounts');
};

export const createAccount = async (account) => {
    return await api.post('/accounts', account);
};

export const updateAccount = async (id, account) => {
    return await api.put(`/accounts/${id}`, account);
};

export const deleteAccount = async (id) => {
    return await api.delete(`/accounts/${id}`);
};

export default api;
