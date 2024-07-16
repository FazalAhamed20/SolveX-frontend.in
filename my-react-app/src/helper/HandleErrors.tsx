
export const handleErrors = (error: any | Error) => {
    if (error.response && error.response.data && error.response.data.message) {
      console.log(error.response.data.status);
      
      
      return { message: error.response.data.message };
    } else {
      
      return { message: error.message };
    }
  };