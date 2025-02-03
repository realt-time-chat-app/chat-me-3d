import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/state/user/slice';
import { userClient } from '@/services/userClient';
import { CreateUserResponse } from '@/types';
import { Formik, Form } from 'formik';
import TextField from '@/components/textField';
import { useNavigate, Link } from 'react-router-dom';

const FindUserByEmail: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userNotFound, setUserNotFound] = useState(false);

  const handleFindUser = async (values: { email: string }) => {
    try {
      setUserNotFound(false);
      const { result } = await userClient.makeRpcCall<CreateUserResponse>(
        'findUserByEmail', { email: values.email }
      );

      console.log("response from find user by email ", result);
      console.log("error", result.error);

      if (result.error) {
        alert(`Error: ${result.error.message}`);
        if (result.code === 404) {
          console.log('User not found.');
          setUserNotFound(true);
        }
      } else {
        if (result) {
          dispatch(setUser(result.result));
        }

        alert('User found');
        navigate('/sign-in');
      }
    } catch (error) {
      console.error('An error occurred fetching email', error);
      alert('An error occurred fetching email.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-black border border-lime-500 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">Enter Email</h2>

        <Formik initialValues={{ email: '' }} onSubmit={handleFindUser}>
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

        { userNotFound && (
          <p className="text-center text-red-400">
            No user found with that email.{' '}
            <Link to="/" className="text-lime-400 hover:underline">
              Register?
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default FindUserByEmail;
