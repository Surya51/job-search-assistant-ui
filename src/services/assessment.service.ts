import apiClient from "./api-client";
import { tokenService } from "./token.service";
import { authService } from "./auth.service";
import { ErrorResponse, QuestionAndAnswer } from "../domain";

export const assessmentService = {
  async getAssessmentData(assessmentGuid: string, redirectToHomePage: { (): void; }) {
    try {
      const url = `/assess/generate/${assessmentGuid}`;

      const token = tokenService.getAuthToken();
      if (!token) {
        redirectToHomePage();
        return false;
      }

      const response = await apiClient.post(url, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 30000 // as vector storage takes a little time.
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

  async submitAssessData(assessmentGuid: string, qnas: QuestionAndAnswer[], isContinue: boolean, redirectToHomePage: { (): void; }) {
    try {
      const url = `/assess/submit-assessment/${assessmentGuid}`;

      const token = tokenService.getAuthToken();
      if (!token) {
        redirectToHomePage();
        return false;
      }

      const response = await apiClient.post(url, { qnas, isContinue }, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 30000 // as vector storage takes a little time.
      });

      if (!isContinue) {
        redirectToHomePage();
      }

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