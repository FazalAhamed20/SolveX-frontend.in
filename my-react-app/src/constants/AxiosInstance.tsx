import axios from 'axios';

// Utility function to get email from persisted root data
const getEmailFromPersistedData = () => {
  const persistRootData = localStorage.getItem('persist:root');
  if (!persistRootData) {
    console.error('No data found under persist:root key in local storage.');
    return null;
  }

  try {
    const persistRootObject = JSON.parse(persistRootData);
    const userPersistData = JSON.parse(persistRootObject.user);
    const email = userPersistData?.user?.email;
    console.log("Email from local storage:", email);
    return email;
  } catch (error) {
    console.error('Error parsing persist:root data:', error);
    return null;
  }
};

const email = getEmailFromPersistedData();

export const authbaseUrl = String(import.meta.env.VITE_AUTHENTICATION_SERVICE);
console.log(authbaseUrl);

export const AuthAxios = axios.create({
  baseURL: authbaseUrl,
  withCredentials: true,
});

const refreshAccessToken = async () => {
  if (!email) {
    throw new Error('Email is not available for refreshing access token');
  }

  try {
    const response = await axios.post(`${authbaseUrl}/refresh-token`, { email });
    const { accessToken } = response.data;
    console.log("New access token:", accessToken);
    return accessToken;
  } catch (error) {
    throw new Error('Failed to refresh access token');
  }
};

AuthAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AuthAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        localStorage.setItem('accessToken', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return AuthAxios(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing access token:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
