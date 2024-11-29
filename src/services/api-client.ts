import axios from "axios";
import { ErrorResponse } from "../domain";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        error.response.data.status = error.status;
        return Promise.reject<ErrorResponse>(error.response?.data);
      }
      else {
        console.log("Axios error:", error.message);
      }
    } else {
      console.log("Unexpected error:", error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;