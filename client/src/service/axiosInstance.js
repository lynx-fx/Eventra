import axios from "axios";

const BACKEND = import.meta.env.PROD
  ? import.meta.env.VITE_BACKEND_HOSTED
  : import.meta.env.VITE_BACKEND_LOCAL;

const axiosInstance = axios.create({
  baseURL: BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
