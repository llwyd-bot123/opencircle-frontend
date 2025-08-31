import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    // "Content-Type": "application/json",
    "Content-Type": "multipart/form-data",
  },
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config;

    // Don't redirect on 401 errors from login endpoints
    const isLoginRequest = originalRequest?.url?.includes("signin");

    if (error.response?.status === 401 && originalRequest && !isLoginRequest) {
      window.location.href = "/login";
      return Promise.reject(new Error("Unauthorized"));
    }

    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
