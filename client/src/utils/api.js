import axios from 'axios';

const TMDB_BASE_URL = import.meta.env.VITE_APP_TMDB_BASE_URL;
const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const headers = {
    Authorization: "bearer " + TMDB_TOKEN
};

export const fetchDataFromApi = async (url, params) => {
    try {
        const { data } = await axios.get( TMDB_BASE_URL + url, {
            headers,
            params
        });
        return data;
    } catch (error) {
        return error;
    }
}

// Login
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        return error;
    }
};

// Register User
export const registerUser = async (name, email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password })
        return response.data;
    } catch (error) {
        return error;
    }
}

// Logout
export const logoutUser = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/logout`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}