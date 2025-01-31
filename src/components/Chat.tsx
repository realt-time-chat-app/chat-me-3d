import React, {useEffect, useState} from 'react';
import { messageClient } from '@/services/messageClient';
import { User, Message } from '@/types';
import { socketService } from "@/services/socketSerivce";

interface ChatProps {
  sender: User ;
  recipient: User;
  onSendMessage: (message: string) => void;
  onNewMessage: (newMessage: Message) => void;
}

const Chat: React.FC<ChatProps> = ({ sender, recipient, onSendMessage, onNewMessage }) => {
  const [message, setMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    // Connect socket on mount
    socketService.connect(sender.id);

    // Join a room for private messages
    const roomId = [sender.id, recipient.id].sort().join("-");
    socketService.joinRoom(roomId);

    // Listen for incoming messages
    socketService.onNewMessage((newMessage) => {
      // pass new message to dashboard for handling
      onNewMessage(newMessage);
    });

    return () => {
      socketService.disconnect();
    };
  }, [sender, recipient]);



  const handleSendMessage = async () => {
    if (message.trim()) {
      // Create the message object
      const newMessage = {
        senderId: sender.id,
        recipientId: recipient.id,
        content: message,
        id: Date.now(),
      };

      // Send message through the message client
      try {
        console.log("message about to be sent -> ", newMessage);
        console.log("recipient --->", recipient);
        await messageClient.sendMessage(newMessage);
        setMessage('');
        onSendMessage(message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="mt-auto flex items-center justify-between rounded-md">
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        placeholder="Type a message..."
        className="w-full p-2 rounded-md bg-white text-black"
      />
      <button
        onClick={handleSendMessage}
        className="ml-4 bg-blue text-white px-4 py-2 rounded-full"
      >
        Send
      </button>
    </div>
  );
};

export default Chat;
