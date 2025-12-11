// utils/axiosInstance.js
import axios from "axios"
import { toast } from "react-toastify"

const axiosInstance = axios.create({
  baseURL: "https://4043f31c1bf2.ngrok-free.app", // Updated base URL to avoid double /api/
  headers: {
    "Content-Type": "application/json",
    'ngrok-skip-browser-warning': 'true',
  },
})

// Add Authorization header from localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Debug logging to see exact URLs
  console.log('Making request to:', config.baseURL + config.url)
  if (config.url.includes("'")) {
    console.error('WARNING: URL contains quotes!', config.url)
    console.trace('Call stack for URL with quotes')
  }

  return config
})

// Handle expired token and other errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Session expired. Please log in again.")
      localStorage.clear()
      // Removed automatic redirect - let components handle authentication state
    } else if (error.response && error.response.status >= 500) {
      toast.error("Server error. Please try again later.")
    } else if (error.response && error.response.status === 400) {
      // Don't show generic error for 400 - let components handle field-specific errors
      console.log("Validation error:", error.response.data)
    }
    return Promise.reject(error) // Important to propagate error
  },
)

export default axiosInstance
