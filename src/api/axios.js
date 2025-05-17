import axios from 'axios';

export const BACKEND_URL = 'http://localhost:3300';
export const BASE_URL = `${BACKEND_URL}/api/v1`

export default axios.create({
    baseURL: BASE_URL,
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})