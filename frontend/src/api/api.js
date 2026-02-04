import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const API = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, 
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

       
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
               
                await axios.post(
                    `${BASE_URL}/users/refresh-token`,
                    {}, 
                    { withCredentials: true }
                );

               
                return API(originalRequest);
            } catch (refreshError) {
               
                console.error("Session expired. Please log in again.");
                
                localStorage.removeItem("user"); 
              
                window.location.href = "/login";
                
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default API;