import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { getAccessToken } from "./auth";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  withAuth?: boolean;
}

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/v1/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    const customConfig = config as CustomAxiosRequestConfig;
    if (customConfig.withAuth) {
      const token = getAccessToken();
      if (token) {
        customConfig.headers = customConfig.headers || {};
        (customConfig.headers as any)["Authorization"] = `Bearer ${token}`;
      }
    }
    return customConfig;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response.data,   
  (error) => Promise.reject(error)
);

export default axiosInstance;
