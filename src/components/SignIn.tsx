import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { authClient } from '@/services/authClient';
import { Formik, Form } from 'formik';
import TextField from '@/components/textField';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  console.log(currentUser);

  const handleSignIn = async (values: { password: string }) => {
    console.log("currentUser --->", currentUser);
    if (!currentUser?.id) {
      alert('User not found. Please enter your email first.');
      navigate('/email');
      return;
    }

    try {
      const { result, error } = await authClient.makeRpcCall<{ result?: any; error?: string }>('loginUser', {
        userId: currentUser.id,
        password: values.password,
      });

      console.log("response in signin component: ", result );

      if (error) {
        alert(`Error: ${error.message}`);
      } else if (result) {
        const { token } = result;
        alert('Sign-in successful!');
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred during sign-in:', error);
      alert('An error occurred during sign-in.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-black border border-lime-500 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">Enter Password</h2>

        <Formik initialValues={{ password: '' }} onSubmit={handleSignIn}>
          {() => (
            <Form className="space-y-4">
              <TextField name="password" placeholder="Enter your password" type="password" />
              <button
                type="submit"
                className="w-full px-4 py-2 font-semibold text-white bg-lime-500 rounded-lg hover:bg-lime-600"
              >
                Sign In
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignIn;
