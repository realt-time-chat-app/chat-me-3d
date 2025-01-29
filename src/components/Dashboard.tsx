import React, { useEffect } from 'react';
import { userClient } from '@/services/userClient';
import { GetUserResponse, User } from '@/types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/state/store';
import { setAllUsers } from '@/state/user/slice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const allUsers = useSelector((state: RootState) => state.user.allUsers);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userClient.makeRpcCall<GetUserResponse[]>('getAllUsers', {});
        // TODO: Figure out how tacle Dashboard issues
        if (response.result) {
          dispatch(setAllUsers(response.result));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [dispatch]);

  return (
    <div className="flex space-x-8 p-8 bg-black text-white">
      <div className="flex flex-col items-center w-1/3">
        <div className="w-16 h-16 flex items-center justify-center bg-lime-500 text-white rounded-full text-2xl font-bold">
          {currentUser?.firstName[0].toUpperCase()}
        </div>
        <h2 className="mt-4">{currentUser?.firstName} {currentUser?.lastName}</h2>
      </div>
      <div className="w-2/3">
        <h3 className="text-2xl font-semibold">Registered Users</h3>
        <ul className="mt-4 space-y-4">
          {allUsers.map((user) => (
            <li key={user.userName} className="p-4 bg-gray-800 rounded-lg shadow-md flex items-center">
              <div className="w-8 h-8 flex items-center justify-center bg-lime-500 text-white rounded-full text-lg font-bold">
                {user.firstName[0].toUpperCase()}
              </div>
              <span className="ml-4">{user.firstName} {user.lastName}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
