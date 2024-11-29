import apiClient from "./api-client";
import { tokenService } from "./token.service";
import { authService } from "./auth.service";
import { ErrorResponse } from "../domain";

export const uploadService = {
  async uploadResumeJD(formData: FormData, redirectToHomePage: { (): void; }) {
    try {
      const url = '/upload';
      const token = tokenService.getAuthToken();

      if (!token) {
        redirectToHomePage();
        return false;
      }
      const response = await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      const err = error as ErrorResponse;
      if (err.status == 401) {
        authService.logout();
        redirectToHomePage();
      }
      return error;
    }
  },

  async getPreviousData(redirectToHomePage: { (): void; }) {
    try {
      const url = '/get-previous-assess-data';
      const token = tokenService.getAuthToken();

      if (!token) {
        redirectToHomePage();
        return false;
      }
      const response = await apiClient.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      const err = error as ErrorResponse;
      if (err.status == 401) {
        authService.logout();
        redirectToHomePage();
      }
      return error;
    }
  }
}