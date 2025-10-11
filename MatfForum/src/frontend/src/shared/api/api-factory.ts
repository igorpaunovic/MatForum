import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

const handleInterceptors = (apiInstance: AxiosInstance) => {
  apiInstance.defaults.headers.common["Content-Type"] = "application/json";

  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.data) {
        if (error.response.status === 401 || error.response.status === 403) {
          // Suppress console errors for authentication failures
          // These are handled by the mutation's onError handler
          if (import.meta.env.DEV) {
            console.warn(`Authentication failed: ${error.response.status}`, {
              url: error.config?.url,
              method: error.config?.method,
              message: error.response.data?.message || 'Authentication failed'
            });
          }
        }
      }
      return Promise.reject(error);
    },
  );

  apiInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (token) {
        // Token is already stored as "Bearer <token>" format
        config.headers["Authorization"] = token;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
};

interface IApiOptions extends AxiosRequestConfig {
  commonPrefix: string;
}

const createApi = ({ commonPrefix, ...rest }: IApiOptions) => {
  const api = axios.create({
    baseURL: import.meta.env.DEV 
      ? `http://localhost:5000/api/${commonPrefix}/`  // API Gateway on port 5000
      : `http://localhost:5000/${commonPrefix}/`, 
    ...rest,
  });

  handleInterceptors(api);

  return api;
};

export default createApi;