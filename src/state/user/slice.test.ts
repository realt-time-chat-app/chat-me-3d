import userReducer, { setUser } from './slice';
import { User } from "@/types";
import { describe, it, expect } from 'vitest'; // Use Vitest utilities

describe('User slice', () => {
  const initialState: User | null = null; // State should start as null

  it('sets the user correctly', () => {
    const newUser = { id: '1', firstName: 'John', lastName: 'Doe', userName: 'johndoe', email: 'john@example.com' };
    const state = userReducer(initialState, setUser(newUser));

    expect(state).toEqual(newUser);
  });
});
