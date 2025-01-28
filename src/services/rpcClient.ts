import axios from 'axios';

const makeRpcCall = async <T>(method: string, params?: unknown): Promise<T> => {
  try {
    const response = await axios.post(import.meta.env.VITE_USER_SERVICE_URL, {
      jsonrpc: '2.0',
      method,
      params,
      id: Date.now(),
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

export const rpcClient = {
  makeRpcCall,
};
