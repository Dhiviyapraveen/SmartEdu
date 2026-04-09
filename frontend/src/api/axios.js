import axios from "axios";

const api = axios.create({
  baseURL: "https://smartedu-t2x0.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;