import axios from "axios";

const BACKEND =
  process.env.NEXT_PUBLIC_NODE_ENV == "production"
    ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
    : process.env.NEXT_PUBLIC_BACKEND_LOCAL;

const axiosInstance = axios.create({
  baseURL: BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: () => true,
});

export default axiosInstance;
