import axios from "axios";

// Create a custom axios instance for auth validation that suppresses 401 errors
export const authAxios = axios.create();

// Intercept responses to suppress 401 errors for validation endpoint
authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Completely suppress 401 errors for validation - don't log anything
    if (error.response?.status === 401) {
      return Promise.reject({ ...error, suppressed: true });
    }
    return Promise.reject(error);
  }
);

export default axios;
 
