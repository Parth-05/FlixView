import axios from 'axios';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;

const API_BASE_URL = "http://localhost:8800/api";

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
        console.log(error)
        return error;
    }
}

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        console.log(error.response.data);
        return error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/logout`);
        return response.data;
    } catch (error) {
        console.log(error.response.data);
        return error;
    }
}