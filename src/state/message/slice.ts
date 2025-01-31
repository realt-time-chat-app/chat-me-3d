import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MessageState } from './types';
import { messageClient } from '@/services/messageClient';

const initialState: MessageState = {
  messages: [],
  loading: false,
  error: null,
};

// Async thunk for fetching messages by conversationId
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      return await messageClient.getMessages(conversationId);
    } catch (error) {
      return rejectWithValue('Failed to fetch messages');
    }
  }
);

// Message slice
const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
