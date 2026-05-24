import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: '/api', // Change this to your actual API base URL if needed
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Show success toast if there's a specific message from backend
    if (response.data && response.data.message) {
      toast.success(response.data.message);
    } else if (['post', 'put', 'patch', 'delete'].includes(response.config.method)) {
      // Optional: default success message for data-modifying requests
      toast.success('Operation successful');
    }
    return response;
  },
  (error) => {
    // Handle error messages globally
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error(error.message || 'Something went wrong. Please try again.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
