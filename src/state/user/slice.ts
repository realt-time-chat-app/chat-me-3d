import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './types';

interface UserState {
  currentUser: User | null;
  allUsers: User[];
}

// Retrieve currentUser from sessionStorage if it exists
const initialState: UserState = {
  currentUser: JSON.parse(sessionStorage.getItem('currentUser') || 'null'),
  allUsers: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      // Persist the currentUser to sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    setAllUsers(state, action: PayloadAction<User[]>) {
      state.allUsers = action.payload;
    },
    clearUser(state) {
      state.currentUser = null;
      state.allUsers = [];
      // Remove currentUser from sessionStorage
      sessionStorage.removeItem('currentUser');
    },
  },
});

export const { setUser, setAllUsers, clearUser } = userSlice.actions;
export default userSlice.reducer;
