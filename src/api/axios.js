import axios from 'axios';

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1`

console.log(BASE_URL);

export default axios.create({
    baseURL: BASE_URL,
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})