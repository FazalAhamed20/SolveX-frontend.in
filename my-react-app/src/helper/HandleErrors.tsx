// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleErrors = (error: any | Error) => {
    if (error.response && error.response.data && error.response.data.message) {
      
      return { message: error.response.data.message };
    } else {
      
      return { message: error.message };
    }
  };