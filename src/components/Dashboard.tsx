import React, { useEffect, useState } from 'react';
import { userClient } from '@/services/userClient';
import { GetUserResponse, User, Message } from '@/types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/state/store';
import { setAllUsers } from '@/state/user/slice';
import RegisteredUsers from './RegisteredUsers';
import Messages from './Messages';;
import Chat from "@/components/Chat";
import { messageClient } from "@/services/messageClient";
const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const allUsers = useSelector((state: RootState) => state.user.allUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userClient.makeRpcCall<GetUserResponse[]>('getAllUsers', {});
        if (response.result) {
          dispatch(setAllUsers(response.result));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [dispatch]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !currentUser) return;

      setLoading(true);
      try {
        const response = await messageClient.getMessages(
          currentUser.id,
          selectedUser.id
        );

        setMessages(response.result);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser, currentUser]);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleSendMessage = (message: string) => {
    // TODO: Alvin, handle send messages in dashboard?
  };

  const handleNewMessage = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="flex w-11/12 items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-full h-[800px] p-8 bg-black text-white rounded-2xl flex relative border-2 border-lime-500">
        {/* Left Panel - Registered Users */}
        <RegisteredUsers
          users={allUsers}
          currentUser={currentUser}
          onUserClick={handleUserClick}
        />

        {/* Vertical Divider */}
        <div className="absolute inset-y-0 left-1/3 w-[2px] bg-lime-500"></div>

        {/* Right Panel - Chat Area */}
        <div className="w-2/3 pl-8 flex flex-col h-full">
          {/* Header - Display the selected user's name and profile icon */}
          <div className="flex items-center justify-center mb-2 bg-lime-500 p-2 rounded-md">
            {selectedUser && (
              <>
                <div className="w-12 h-12 flex items-center justify-center bg-black text-lime-500 rounded-full text-2xl font-bold mr-4">
                  {selectedUser.firstName[0].toUpperCase()} {/* Initial icon */}
                </div>
                <div className="text-xl text-white">
                  {selectedUser.firstName} {selectedUser.lastName}
                </div>
              </>
            )}
            {!selectedUser && (
              <div className="text-white">Select a user to chat with</div>
            )}
          </div>

          {/* Messages Component */}
          {selectedUser && (
            <div className="flex-grow overflow-y-auto max-h-[calc(100%_-_120px)]">
              <Messages selectedUser={ selectedUser } messages={messages} loading={loading} />
            </div>
          )}

          {/* Chat Component */}
          {selectedUser && (
            <Chat
              sender={ currentUser as User }
              recipient={selectedUser}
              onSendMessage={handleSendMessage}
              onNewMessage={handleNewMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
