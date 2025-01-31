import React, { useEffect, useState } from 'react';
import { Message, User } from '@/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

interface MessagesProps {
  selectedUser: User | null;
  messages: Message[];
  loading: boolean;
}

const Messages: React.FC<MessagesProps> = ({ selectedUser, messages, loading }) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">
          It's quiet here. Start a conversation!
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col p-4 rounded-lg shadow-md max-w-full w-auto ${
              message.senderId === currentUser?.id
                ? 'border border-gray-500 text-white ml-auto' // current user's messages on right
                : 'bg-blue text-white' // selected user's messages on left
            }`}
          >
            <div className="text-sm mb-1">
              {message.senderId === currentUser?.id
                ? currentUser?.userName
                : selectedUser?.userName}
            </div>

            <div className="text-lg">{message.content}</div>

            <div className="text-xs text-right italic mt-2">
              {new Date(message.timestamp).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Messages;
