import axios from "axios";
import { attachAuthMiddleware } from "../middleware/authMiddleware";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "*/*",
  },
});

attachAuthMiddleware(API);

export default API;
