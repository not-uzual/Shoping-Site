import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const signUp = async (userData) => {
  try {
    const response = await api.post("/user/signup", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const logIn = async (userData) => {
  try {
    const response = await api.post("/user/login", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export async function logout() {
  try {
    const response = await api.get("/user/logout");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

