import * as Yup from 'yup';

export const userLoginValidation = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Please enter your email')
    .matches(/^[A-Z0-9]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email format'),

  password: Yup.string()
    .required('Please enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      '8 characters,uppercase letter,lowercase letter,number,special character',
    ),
});
