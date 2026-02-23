import axios, { AxiosError } from "axios";
import { toast } from "sonner";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 1. CRITICAL: Allows cookies/sessions
  withXSRFToken: true,   // 2. CRITICAL: Tells Axios to read the XSRF-TOKEN cookie
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // src/api/api.ts (inside your response interceptor)
if (status === 403) {
  const errorCode = error.response?.data?.code;

  if (errorCode === 'ACCOUNT_DISABLED') {
    localStorage.removeItem("token");
    toast.error("Your account has been deactivated.");
    window.location.href = "/banned"; 
  }
  else if(errorCode === 'PROFILE_DISABLED'){
    window.location.href = "/profile-disabled";

  } else {
    // Standard subscription expired redirect
    window.location.href = "/subscription-expired";
  }
}
    return Promise.reject(error);
  }
);

export default api;