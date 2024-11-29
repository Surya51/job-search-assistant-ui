import { ErrorResponse, User } from "../domain/entities";
import apiClient from "./api-client";
import { tokenService } from "./token.service";


export const authService = {
  async loginOrRegister(isLogin: boolean, userData: User) {
    try {
      const url = `/auth/${isLogin ? 'login' : 'register'}`;
      const response = await apiClient.post(url, userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        tokenService.setAuthToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      return error;
    }
  },

  async logout() {
    try {
      const url = '/auth/logout';
      const token = tokenService.getAuthToken();
      if (!token) {
        return false;
      }

      const response = await apiClient.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const isLoggedOut = response.data.loggedOut;
      if (isLoggedOut) {
        tokenService.removeAuthToken()
      }

      return isLoggedOut;
    }
    catch (error) {
      return error;
    }
  },

  isTokenExists() {
    const token = tokenService.getAuthToken();

    if (!token) {
      return false;
    }

    return true;
  },

  async isAuthorized(redirectToHomePage: () => void) {
    try {
      const url = '/auth/validate';
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

      const validateResponse = response.data;

      if (!validateResponse.noToken && !validateResponse.isValid) {
        tokenService.removeAuthToken()
        this.logout();
      }

      return validateResponse.isValid;
    }
    catch (error) {
      const err = error as ErrorResponse;
      if (err.status == 401) {
        this.logout();
        redirectToHomePage();
      }
      return error;
    }
  }
}