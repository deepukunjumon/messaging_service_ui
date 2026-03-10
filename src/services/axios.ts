import axios from "axios";
import AppConfig from "../config/app.config";
import { decryptIfNeeded } from "../utils/decryptResponse";

const axiosInstance = axios.create({
  baseURL: AppConfig.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Transparently decrypt encrypted backend responses
axiosInstance.interceptors.response.use(
  async (response) => {
    const decrypted = await decryptIfNeeded(response.data, AppConfig.ENCRYPTION_KEY);
    response.data = decrypted;
    return response;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
