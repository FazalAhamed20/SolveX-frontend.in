import * as Yup from 'yup'


export const userSignupValidation=Yup.object({
    name: Yup.string()
    .min(4, "Name must be greater than 3 characters")
    .required("Please enter your name"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Please enter your email")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
  
  password: Yup.string()
    .required("Please enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "8 characters,uppercase letter,lowercase letter,number,special character"
    ),
    terms:Yup.boolean()
    .oneOf([true],'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
  
  otp: Yup.string(),

})


