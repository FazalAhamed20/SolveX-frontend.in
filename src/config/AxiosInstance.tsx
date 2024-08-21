// src/config/AxiosInstance.ts
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { getGlobalDispatch } from '../redux/dispatchStore';
import { Logout } from '../redux/actions/AuthActions';
import { toast } from 'react-toastify';

interface ErrorResponse {
  message: string;
 
}

const authbaseUrl = import.meta.env.VITE_AUTHENTICATION_SERVICE as string;
const problemUrl = import.meta.env.VITE_PROBLEM_SERVICE as string;
const practiceUrl = import.meta.env.VITE_PRACTICE_SERVICE as string;
const submissionUrl = import.meta.env.VITE_SUBMISSION_SERVICE as string;
const clanUrl = import.meta.env.VITE_CLAN_SERVICE as string;
const paymentUrl = import.meta.env.VITE_PAYMENT_SERVICE as string;
const chatUrl = import.meta.env.VITE_CHAT_SERVICE as string;
// const user = useSelector((state: any) => state.user.user);

const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
  });

  instance.interceptors.request.use((request: InternalAxiosRequestConfig) => {
    console.log('request', request);
    return request;
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log('response from config', response);
      
      return response;
    },
    async (error: AxiosError<ErrorResponse>) => {
     
      if (!error.config) {
        return Promise.reject(error);
      }

      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 403) {
        console.log('Forbidden (403) error:', error.response);
        
       console.log(error.response.data)
        if (error.response.data && error.response.data.message === 'User is blocked') {
         handleLogout();
          toast.error('Your account has been blocked. Please contact support.');
          return Promise.reject(error);
        }
      }

      if (error.response?.status === 401) {
        console.log('Unauthorized (401) error:', error.response);
        try {
          const newAccessToken = await refreshAccessToken();
          console.log('New access token:', newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          handleLogout();
          return Promise.reject(refreshError);
        }
      }
      if (error.response?.status === 500) {
        console.error('Internal Server Error (500):', error.response);
        
        throw error;
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

const AuthAxios = createAxiosInstance(authbaseUrl);
const AdminAxios = createAxiosInstance(authbaseUrl);
const ProblemAxios = createAxiosInstance(problemUrl);
const PracticeAxios = createAxiosInstance(practiceUrl);
const SubmissionAxios = createAxiosInstance(submissionUrl);
const ClanAxios = createAxiosInstance(clanUrl);
const PaymentAxios = createAxiosInstance(paymentUrl);
const ChatAxios = createAxiosInstance(chatUrl);
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

export function handleLogout(): void {
  const dispatch = getGlobalDispatch();
  if (dispatch) {
    dispatch(Logout());
  }
  localStorage.clear();
  window.location.href = '/login';
  
}

export default AuthAxios;
export {
  AdminAxios,
  ProblemAxios,
  PracticeAxios,
  SubmissionAxios,
  ClanAxios,
  PaymentAxios,
  ChatAxios
};
