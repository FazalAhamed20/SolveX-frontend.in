import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';


const authbaseUrl = import.meta.env.VITE_AUTHENTICATION_SERVICE as string;

export const AuthAxios: AxiosInstance = axios.create({
  baseURL: authbaseUrl,
  withCredentials: true,
});

AuthAxios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  console.log("request", request);
  return request;
});

AuthAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("response", response.data.data?.isBlocked);
    if (response.data.data?.isBlocked) {
      logout();
    }
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

function logout(): void {
  // Clear local storage
  localStorage.clear();
  

  
  // Redirect to login page
  window.location.href = '/login';
}


export default AuthAxios;





// Utility function to get email from persisted root data
// const getEmailFromPersistedData = () => {
//   try {
//     const persistRootData = localStorage.getItem('persist:root');
//     if (!persistRootData) {
//       console.error('No data found under persist:root key in local storage.');
//       return null;
//     }

//     const persistRootObject = JSON.parse(persistRootData);
//     const userPersistData = JSON.parse(persistRootObject.user);
//     const email = userPersistData?.user?.email;
//     console.log('Email from local storage:', email);
//     return email;
//   } catch (error) {
//     console.error('Error parsing or accessing persist:root data:', error);
//     return null;
//   }
// };

// const email = getEmailFromPersistedData();



// const refreshAccessToken = async () => {
  //   try {
  //     if (!email) {
  //       throw new Error('Email is not available for refreshing access token');
  //     }
  
  //     const response = await axios.post(`${authbaseUrl}/refresh-token`, {
  //       email,
  //     });
  //     const { accessToken } = response.data;
  //     console.log('New access token:', accessToken);
  //     return accessToken;
  //   } catch (error) {
  //     console.error('Failed to refresh access token:', error);
  //     throw error;
  //   }
  // };