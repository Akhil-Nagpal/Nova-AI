import axios from "axios";
import { apiClient } from "./apiClient";

//   now write the async function with message and conversation id params
export const sendMessage = async (message: string, conversationId?: string) => {
  try {
    // call the api
    const response = await apiClient.post("/api/v1/chat", {
      message,
      conversationId,
    });
    // return the response data
    return response?.data?.data;
  } catch (error) {
    // get the error from api response if there any
    if (axios.isAxiosError(error)) {
      throw new Error(error?.response?.data?.message);
    }
    throw error;
  }
};
