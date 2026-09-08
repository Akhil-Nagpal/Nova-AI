import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:8000",
  withCredentials: true,
});

// handling token rotation
apiClient.interceptors.response.use(
  // success callback
  (response) => response,
  // error callback
  async (error) => {
    // if the token is expired the call the rotation API
    // now get the .config from error because it holds why the request failed
    const originalRequest = error.config;
    // check if the error came because of "Unauthorized request and originalRequest don't have the retry yet"
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Now if the response is 401 then call the rotation api
      try {
        // Attempt to get a new access token using the refresh token cookie
        await apiClient.post("/auth/refresh-token");
        // after changing the tokens, retry the request
        return apiClient(originalRequest);
      } catch (error) {
        // if the refresh token also failed then forcefully logout the user
        useAuthStore.getState().clearUser();
        // after logout redirect user to login page
        window.location.href = "/login";

        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
