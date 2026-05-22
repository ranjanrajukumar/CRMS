import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

export default API;
