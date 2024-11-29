

const AUTH_TOKEN = 'AUTH_TOKEN';

export const tokenService = {
  getAuthToken() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return authToken;
  },

  setAuthToken(token: string) {
    localStorage.setItem(AUTH_TOKEN, token);
  },

  removeAuthToken() {
    localStorage.removeItem(AUTH_TOKEN);
  }
}