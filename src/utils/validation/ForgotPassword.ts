import * as Yup from 'yup'


export const ForgotPasswordValidation=Yup.object({
 
  email: Yup.string()
    .email("Invalid email format")
    .required("Please enter your email")
    .matches(/^[A-Z0-9]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid email format"),
  
  
   

})