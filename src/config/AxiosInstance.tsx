// src/config/AxiosInstance.ts
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { getGlobalDispatch } from '../redux/dispatchStore';
import { Logout } from '../redux/actions/AuthActions';

const authbaseUrl = import.meta.env.VITE_AUTHENTICATION_SERVICE as string;
const problemUrl=import.meta.env.VITE_PROBLEM_SERVICE as string;
const submissionUrl=import.meta.env.VITE_SUBMISSION_SERVICE as string;
export const AuthAxios: AxiosInstance = axios.create({
  baseURL: authbaseUrl,
  withCredentials: true,
});

AuthAxios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  console.log('request', request);
  return request;
});

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
    console.log('Email from local storage:', email);
    return email;
  } catch (error) {
    console.error('Error parsing or accessing persist:root data:', error);
    return null;
  }
};

const refreshAccessToken = async () => {
  try {
    const email = getEmailFromPersistedData();
    if (!email) {
      throw new Error('Email is not available for refreshing access token');
    }

    const response = await axios.post(
      `${authbaseUrl}/refresh-token`,
      { email },
      { withCredentials: true },
    );
    const { accessToken } = response.data;
    console.log('New access token:', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw error;
  }
};

AuthAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('response', response);
    if (response.data.data?.isBlocked) {
      const dispatch = getGlobalDispatch();
      if (dispatch) {
        dispatch(Logout());
      }
      handleLogout();
    }
    return response;
  },
  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status === 401) {
      console.log('res', error.response?.status);
      try {
        const newAccessToken = await refreshAccessToken();
        console.log('.......', newAccessToken);
        console.log('....', originalRequest);
        return AuthAxios(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        handleLogout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
export function handleLogout(): void {
  localStorage.clear();
  window.location.href = '/login';
}

export const AdminAxios: AxiosInstance = axios.create({
  baseURL: authbaseUrl,
  withCredentials: true,
});

export default AuthAxios;

export const ProblemAxios: AxiosInstance = axios.create({
  baseURL:  problemUrl,
  withCredentials: true,
});

export const SubmissionAxios: AxiosInstance = axios.create({
  baseURL:  submissionUrl,
  withCredentials: true,
});
