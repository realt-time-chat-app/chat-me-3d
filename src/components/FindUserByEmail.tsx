import React from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/state/user/slice';
import { userClient } from '@/services/userClient';
import { CreateUserResponse, User } from '@/types';
import { Formik, Form } from 'formik';
import TextField from '@/components/textField';
import { useNavigate } from 'react-router-dom';

const FindUserByEmail: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFindUser = async (values: { email: string }) => {
    try {
      const response = await userClient.makeRpcCall<CreateUserResponse>('findUserByEmail', {
        email: values.email,
      });
      if (response?.error) {
        alert(`Error: ${response.error}`);
      } else if (response?.result) {
        dispatch(setUser(response.result));
        alert('User found');
        navigate('/dashboard');
      } else {
        alert('User not found.');
      }
    } catch (error) {
      console.error('An error occurred fetching email', error);
      alert('An error occurred fetching email.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-black border border-lime-500 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">email</h2>

        <Formik
          initialValues={{ email: '' }}
          onSubmit={handleFindUser}
        >
          {() => (
            <Form className="space-y-4">
              <TextField name="email" placeholder="Enter your email" type="email" />
              <button
                type="submit"
                className="w-full px-4 py-2 font-semibold text-white bg-lime-500 rounded-lg hover:bg-lime-600"
              >
                Continue
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default FindUserByEmail;
