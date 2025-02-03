import axios from 'axios';
import { Message } from "@/types";

// Function to make RPC calls to the message service
const makeRpcCall = async <T>(method: string, params?: unknown): Promise<T> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(import.meta.env.VITE_MESSAGE_SERVICE_URL, {
      jsonrpc: '2.0',
      method,
      params,
      id: Date.now(),
    }, {
      headers: {
        Authorization: token? `Bearer ${token}`: "",
      }
    });

    if (response.status !== 200) {
      throw new Error(`RPC call failed with status: ${response.status}`);
    }

    // Explicit type assertions
    return response.data as T;
  } catch (error) {
    console.error('RPC call failed:', error);
    throw error;
  }
};


export const messageClient = {
  makeRpcCall,

  // Method to retrieve messages for a user or chat
  getMessages: async (senderId: string, recipientId: string ): Promise<Message[]> => {
    return await makeRpcCall<Message[]>('getMessages', { senderId, recipientId });
  },

  // Method to send a new message
  sendMessage: async (message: Message): Promise<void> => {
    return await makeRpcCall<void>('sendMessage', {
      senderId: message.senderId,
      recipientId: message.recipientId,
      content: message.content });
  },
};
