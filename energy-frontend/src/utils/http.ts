import type { AxiosInstance } from 'axios';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

class Http {
    instance: AxiosInstance;
    constructor() {
        this.instance = axios.create({
            baseURL: `${baseURL}/api`,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers = config.headers ?? {};
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        this.instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error?.response?.status === 401) {
                    localStorage.removeItem('accessToken');
                }
                return Promise.reject(error);
            },
        );
    }
}

const http = new Http().instance;

export default http;
