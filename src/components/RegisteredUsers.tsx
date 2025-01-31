import React from 'react';
import { User } from '@/types';

interface RegisteredUsersProps {
  users: User[];
  currentUser: User | null;
  onUserClick: (user: User) => void;  // Callback to handle user selection
}

const RegisteredUsers: React.FC<RegisteredUsersProps> = ({ users, currentUser, onUserClick }) => {
  return (
    <div className="w-full max-w-[calc(33.333%_-_2rem)] p-4 space-y-4 flex-shrink-0 overflow-y-auto">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto flex items-center justify-center bg-lime-500 text-white rounded-full text-2xl font-bold">
          {currentUser?.firstName[0].toUpperCase()}
        </div>
        <h2 className="mt-4 text-xl">{currentUser?.firstName} {currentUser?.lastName}</h2>
      </div>

      <h3 className="text-xl font-semibold text-center mt-8">Registered Users</h3>

      <div className="space-y-4 max-h-[calc(100%_-_200px)] overflow-y-auto">
        {users.map((user) => (
          <button
            key={user.userName}
            onClick={() => onUserClick(user)}
            className="flex items-center bg-gray-800 p-4 rounded-lg shadow-md w-full text-left hover:bg-gray-700"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-lime-500 text-white rounded-full text-lg font-bold">
              {user.firstName[0].toUpperCase()}
            </div>
            <span className="ml-4">{user.firstName} {user.lastName}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegisteredUsers;
