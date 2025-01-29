import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './types';

interface UserState {
  currentUser: User | null;
  allUsers: User[];
}

const initialState: UserState = {
  currentUser: null,
  allUsers: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    setAllUsers(state, action: PayloadAction<User[]>) {
      state.allUsers = action.payload;
    },
    clearUser(state) {
      state.currentUser = null;
      state.allUsers = [];
    },
  },
});

export const { setUser, setAllUsers, clearUser } = userSlice.actions;
export default userSlice.reducer;
