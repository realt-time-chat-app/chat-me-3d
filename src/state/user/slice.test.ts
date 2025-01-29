import userReducer, { setUser } from './slice';
import { User } from "@/types";
import { describe, it, expect } from 'vitest';

describe('User slice', () => {
  const initialState = {
    currentUser: null,
    allUsers: [],
  };

  it('sets the user correctly', () => {
    const newUser: User = { id: '1', firstName: 'John', lastName: 'Doe', userName: 'johndoe', email: 'john@example.com' };
    const state = userReducer(initialState, setUser(newUser));

    expect(state.currentUser).toEqual(newUser);
  });
});
