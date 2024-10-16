import axios from "axios";
import {
  clearSessionStorage,
  getSessionStorage,
  setSessionStorage,
} from "../helper/sessionManage";

const headers = {
  "Content-type": "application/json",
};
export const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers,
});

const setAuthorization = (accessToken) => {
  apiRequest.interceptors.request.use(
    (config) => {
      config.withCredentials = true;
      if (accessToken) {
        config.headers = {
          Authorization: "Bearer " + accessToken,
          Accept: "application/json",
        };
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

apiRequest.interceptors.request.use(
  (config) => {
    config.withCredentials = true; // need of cookie send in every req, only in refreshtoken api
    let data = getSessionStorage();
    if (data) {
      data = JSON.parse(data);
      const { accessToken } = data;
      if (accessToken) {
        config.headers = {
          ...config.headers, // Preserve existing headers
          Authorization: "Bearer " + accessToken,
          Accept: "application/json",
        };
      }
    } else {
      config.headers = { Accept: "application/json" };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiRequest.interceptors.response.use(
  (response) => {
    return response.data ? response.data : response;
  },
  async (error) => {
    let message;
    let originalRequest;
    let response;
    switch (error.response?.status || error.status) {
      case 500:
        message = "Internal Server error";
        break;
      case 404:
        message = "Not Found";
        break;
      case 400:
        message = "Bad Request";
        break;
      case 429:
        clearSessionStorage();
        window.location.href = "/login";
        message = "Too Many Request";
        break;
      case 403:
        originalRequest = error.config;
        try {
          response = await apiRequest.get(
            "/user/refresh_accessToken",
            {},
            {
              withCredentials: true, // Important for cookies
            }
          );
        } catch (error) {
          return Promise.reject(error);
        }
        if (response) {
          const accessToken = response?.accessToken; // Safely extract accessToken
          if (accessToken) {
            setSessionStorage({ accessToken });
            setAuthorization(accessToken);
          }
          const originalConfig = {
            baseURL: originalRequest.baseURL,
            url: originalRequest.url,
            method: originalRequest.method,
            data: originalRequest.data,
            headers: {
              ...originalRequest.headers,
              Authorization: `Bearer ${response.accessToken}`,
            },
          };
          return apiRequest.request(originalConfig);
        }
        // else {
        //   clearSessionStorage();
        //   window.location.href = "/login";
        // }
        break;
      default:
        message = error.response?.data?.message || error.message || error;
        return Promise.reject(message);
    }
  }
);
