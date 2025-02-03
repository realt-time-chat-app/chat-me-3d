import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/state/user/slice';
import { userClient } from '@/services/userClient';
import { authClient } from '@/services/authClient';
import { CreateUserResponse, User } from '@/types';
import { Formik, Form } from 'formik';
import { userValidationSchema } from "@/validations/userValidation";
import TextField from '@/components/textField';
import { useNavigate } from 'react-router-dom';
import { registrationFormFields } from "@/constants/registrationFormFields";


const UserRegistration: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (values: {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const { firstName, lastName, userName, email, password } = values;

    try {
      const response: CreateUserResponse = await userClient.makeRpcCall<CreateUserResponse>('createUser', {
        firstName,
        lastName,
        userName,
        email,
      });

      if (response?.error) {
        alert(`Error: ${response.error}`);
        return;
      }

      if (response?.result) {
        const user = response.result as User;
        dispatch(setUser(user));

        const authResponse = await authClient.makeRpcCall<{ success: boolean; error?: string }>('createUser', {
          userId: user.id,
          password,
        });

        if (authResponse?.error) {
          alert(`Auth Error: ${authResponse.error}`);
        } else {
          alert('Registration successful!');
          navigate('/');
        }
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred during registration:', error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-xl p-8 space-y-6 bg-black border border-luminousGreen rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">Register</h2>

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={userValidationSchema}
          onSubmit={handleRegister}
        >
          {() => (
            <Form className="space-y-4">
              {registrationFormFields.map(({ name, placeholder, type, dataTestId }) => (
                <TextField key={name} name={name} placeholder={placeholder} type={type} dataTestId={dataTestId} />
              ))}

              <button
                type="submit"
                className="w-full px-4 py-2 font-semibold text-white bg-lime-500 rounded-lg hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-500"
              >
                Register
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UserRegistration;
