import axios from 'axios';

// Utility function to get email from persisted root data
const getEmailFromPersistedData = () => {
  try {
    const persistRootData = localStorage.getItem('persist:root');
    if (!persistRootData) {
      console.error('No data found under persist:root key in local storage.');
      return null;
    }

    const persistRootObject = JSON.parse(persistRootData);
    const userPersistData = JSON.parse(persistRootObject.user);
    const email = userPersistData?.user?.email;
    console.log("Email from local storage:", email);
    return email;
  } catch (error) {
    console.error('Error parsing or accessing persist:root data:', error);
    return null;
  }
};

const email = getEmailFromPersistedData();
const authbaseUrl = import.meta.env.VITE_AUTHENTICATION_SERVICE;

export const AuthAxios = axios.create({
  baseURL: authbaseUrl,
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    if (!email) {
      throw new Error('Email is not available for refreshing access token');
    }

    const response = await axios.post(`${authbaseUrl}/refresh-token`, { email });
    const { accessToken } = response.data;
    console.log("New access token:", accessToken);
    return accessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw error; 
  }
};

AuthAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        localStorage.setItem('accessToken', newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return AuthAxios(originalRequest);
      } catch (refreshError) {
        console.error('Interceptor error: Failed to refresh access token:', refreshError);
        return Promise.reject(refreshError); 
      }
    }
    return Promise.reject(error); 
  }
);

export default AuthAxios;
