import React from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/state/user/slice';
import { rpcClient } from '@/services/rpcClient';
import {CreateUserResponse, User} from '@/types';
import { Formik, Form } from 'formik';
import { userValidationSchema } from "@/validations/UserValidation";
import TextField from '@/components/textField';
import { useNavigate } from 'react-router-dom';
import {registrationFormFields} from "@/constants/registrationFormFields";

const UserRegistration: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (values: { firstName: string; lastName: string; userName: string; email: string }) => {
    const { firstName, lastName, userName, email } = values;

    try {
      const response: CreateUserResponse = await rpcClient.makeRpcCall<CreateUserResponse>('createUser', {
        firstName,
        lastName,
        userName,
        email,
      });

      if (response?.error) {
        alert(`Error: ${response.error}`);
      } else if (response?.result) {
        dispatch(setUser(response.result as User));
        alert('Registration successful!');
        navigate('/dashboard'); // Dummy redirect to dashboard
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
      <div
        className="w-full max-w-xl p-8 space-y-6 bg-black border border-luminousGreen rounded-2xl shadow-lg text-black">
        <h2 className="text-3xl font-bold text-white text-center">Register</h2>

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
          }}
          validationSchema={userValidationSchema}
          onSubmit={handleRegister}
        >
          {() => (
            <Form className="space-y-4">
              {registrationFormFields.map(({name, placeholder, type}) => (
                <TextField key={name} name={name} placeholder={placeholder} type={type}/>
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
