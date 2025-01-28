import * as Yup from 'yup';

export const userValidationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  userName: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
});
