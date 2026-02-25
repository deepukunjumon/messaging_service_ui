import axios from "axios";
import AppConfig from "../config/app.config";

const axiosInstance = axios.create({
  baseURL: AppConfig.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Future JWT interceptor here

export default axiosInstance;
