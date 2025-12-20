import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = res.data.accessToken;
                sessionStorage.setItem("accessToken", newAccessToken);
                original.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(original);
            }
            catch (refreshError) {
                sessionStorage.removeItem("accessToken");
                sessionStorage.removeItem("user");
                alert("Session expired. Please login again.");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
