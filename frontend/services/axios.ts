import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

if (typeof window !== "undefined" && !process.env.NEXT_PUBLIC_API_URL) {
  if (process.env.NODE_ENV === "production") {
    console.error("Warning: NEXT_PUBLIC_API_URL environment variable is missing in production! API requests will fail or fallback to localhost.");
  } else {
    console.info("NEXT_PUBLIC_API_URL is not set; falling back to http://localhost:3000/api for local development.");
  }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  xsrfCookieName: "csrfToken",
  xsrfHeaderName: "X-CSRF-Token",
});

// Helper to extract a cookie value by name on the client side
const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
};

// Request interceptor to attach Bearer token and CSRF token manually
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // 1. Attach JWT token (fallback if cookies are not used)
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 2. Attach CSRF token (bypasses Axios cross-origin / cross-port safeguard)
      const csrfToken = getCookie("csrfToken");
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authorization errors and execute silent token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 Unauthorized and we haven't retried this request yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Call the refresh endpoint to obtain a new access token
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        if (refreshResponse.data.success) {
          const newAccessToken = refreshResponse.data.data.accessToken;
          localStorage.setItem("token", newAccessToken);
          
          // Re-attach the new token to the headers and retry
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Session refresh failed or expired:", refreshError);
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
