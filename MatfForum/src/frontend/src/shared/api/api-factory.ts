import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

const handleInterceptors = (apiInstance: AxiosInstance) => {
  apiInstance.defaults.headers.common["Content-Type"] = "application/json";

  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.data) {
        if (error.response.status === 401 || error.response.status === 403) {
          console.log('Logout'); // ovde bi trebao user da se logoutuje 
        }
      }
      return Promise.reject(error);
    },
  );

  apiInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (token) config.headers["Authorization"] = `${token}`;  // saljemo kao Bearer i onda ovde token <- ali moze i ovako samo svejedno je 

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
      ? `https://localhost:55187/api/${commonPrefix}/`  // ovo je privremeno ovde treba da stoji adresa API Gateway-a ... 
      : `http://localhost:5002/${commonPrefix}/`, 
    ...rest,
  });

  handleInterceptors(api);

  return api;
};

export default createApi;