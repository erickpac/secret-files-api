import axios from "axios";
import "dotenv/config";

const { API_URL, AUTH_TOKEN } = process.env;

if (!API_URL || !AUTH_TOKEN) {
  throw new Error(
    // eslint-disable-next-line comma-dangle
    "API_URL and AUTH_TOKEN must be defined in the environment variables"
  );
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${AUTH_TOKEN}`,
  },
});

export default api;
