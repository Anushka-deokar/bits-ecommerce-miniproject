// src>services > authService.ts
import axios from 'axios';

const BASE_URL = 'https://dummyjson.com/auth';

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, { username, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};