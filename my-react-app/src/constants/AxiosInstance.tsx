import axios from 'axios'
export const authbaseUrl = String(
    import.meta.env.VITE_AUTHENTICATION_SERVICE
  );
  console.log(authbaseUrl);
  

  export const AuthAxios = axios.create({
    baseURL: authbaseUrl,
    withCredentials: true,
  });