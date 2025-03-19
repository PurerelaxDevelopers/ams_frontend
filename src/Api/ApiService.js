import axios from "axios";

const api = axios.create({	
  baseURL: "https://git.thikse.in/api",
  //baseURL: "http://54.188.29.98:5000/api",
  // baseURL: "http://127.0.0.1:5000", // Replace with your API URL
  // baseURL: "http://44.224.219.80/", // Replace with your API URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
