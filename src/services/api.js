import axios from "axios";
import "dotenv/config";

const API_URL = process.env.API_URL ?? "https://echo-serv.tbxnet.com/v1/";
const AUTH_TOKEN = process.env.AUTH_TOKEN ?? "aSuperSecretKey";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${AUTH_TOKEN}`,
  },
});

export default api;
