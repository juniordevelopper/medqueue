import axios from 'axios';

const getBackendUrl = () => {
    const hostname = window.location.hostname;
    return `http://${hostname}:8000/api/`;
};

const api = axios.create({
    baseURL: getBackendUrl(),
});

// 1. So'rov yuborishdan oldin Access Tokenni biriktirish
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Javob kelganda 401 (Unauthorized) xatosini tutib olish
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Agar xato 401 bo'lsa va bu qayta urinish bo'lmasa
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh');

            if (refreshToken) {
                try {
                    // Refresh tokenni yuborib yangi access token olish
                    const res = await axios.post(`${getBackendUrl()}/auth/login/refresh/`, {
                        refresh: refreshToken
                    });

                    if (res.status === 200) {
                        localStorage.setItem('access', res.data.access);
                        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                        return api(originalRequest); // Asl so'rovni qayta yuborish
                    }
                } catch (refreshError) {
                    // Agar refresh ham eskigan bo'lsa, hammasini o'chirib loginga haydaymiz
                    localStorage.clear();
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
