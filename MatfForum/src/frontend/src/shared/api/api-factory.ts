import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

const handleInterceptors = (apiInstance: AxiosInstance) => {
  apiInstance.defaults.headers.common["Content-Type"] = "application/json";

  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.data) {
        if (error.response.status === 401 || error.response.status === 403) {
          // console.log('Logout'); // ovde bi trebao user da se logoutuje 
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
      ? `http://localhost:5000/api/${commonPrefix}/`  // ovo je privremeno ovde treba da stoji adresa API Gateway-a ... 
      : `http://localhost:5000/${commonPrefix}/`, 
    ...rest,
  });

  handleInterceptors(api);

  return api;
};

export default createApi;