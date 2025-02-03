import axios from 'axios';

const makeRpcCall = async <T>(method: string, params?: unknown): Promise<T> => {
  console.log("viteAuthServiceUrl: ", import.meta.env.VITE_AUTH_SERVICE_URL);
  try {
    const response = await axios.post(import.meta.env.VITE_AUTH_SERVICE_URL, {
      jsonrpc: '2.0',
      method,
      params,
      id: Date.now(),
    });

    if (response.status !== 200) {
      throw new Error(`RPC call failed with status: ${response.status}`);
    }

    console.log('response from auth service --->', response.data);
    return response.data as T;
  } catch (error) {
    console.error('RPC call failed:', error);
    throw error;
  }
};

export const authClient = {
  makeRpcCall,
};
