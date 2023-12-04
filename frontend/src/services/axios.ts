import axios, { AxiosInstance } from "axios";

const baseURL: string = "http://localhost:8000/api/v1/";

const axiosInstance: AxiosInstance = axios.create({
    baseURL,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
