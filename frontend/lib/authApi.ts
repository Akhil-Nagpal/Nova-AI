import axios from "axios";
import { apiClient } from "./apiClient";

// Register API
export const register = async (
  fullName: string,
  email: string,
  password: string,
) => {
  try {
    // call the api
    const response = await apiClient.post("/auth/register", {
      fullName,
      email,
      password,
    });
    return response?.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error?.response?.data?.message);
    }
    throw error;
  }
};

// Login API
export const login = async (email: string, password: string) => {
  try {
    // call the api
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response?.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error?.response?.data?.message);
    }
    throw error;
  }
};

// Logout API
export const logout = async () => {
  try {
    // call the api
    const response = await apiClient.post("/auth/logout");
    return response?.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error?.response?.data?.message);
    }
    throw error;
  }
};
