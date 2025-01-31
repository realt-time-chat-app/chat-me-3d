import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '@/state/store';
import Dashboard from '@/components/Dashboard';
import { userClient } from '@/services/userClient';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { messageClient } from "@/services/messageClient";
import setCurrentUser, { setUser } from '@/state/user/slice';
import {User} from "@/types";

vi.mock('@/services/userClient', () => ({
  userClient: {
    makeRpcCall: vi.fn(),
  },
}));

vi.mock('@/services/messageClient', () => ({
  messageClient: {
    getMessages: vi.fn(),
  },
}));

const mockUsers = [
  { id: '1', firstName: 'John', lastName: 'Doe', userName: 'johndoe' },
  { id: '2', firstName: 'Jane', lastName: 'Smith', userName: 'janesmith' },
];

const mockMessages = [
  { id: '101', senderId: '1', recipientId: '2', content: 'Hello!', timestamp: Date.now() },
  { id: '102', senderId: '2', recipientId: '1', content: 'Hey there!', timestamp: Date.now() },
];

const mockCurrentUser: User = {
  id: 'user-123',
  firstName: 'Test',
  lastName: 'User',
  userName: 'testuser',
  email: 'test@user.com',
};

beforeEach(() => {
  vi.clearAllMocks();
});

beforeEach(() => {
  store.dispatch(setUser(mockCurrentUser));
});


describe('Dashboard Component', () => {
  it('renders Dashboard correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Select a user to chat with/i)).toBeInTheDocument();
  });

  it('fetches and displays users', async () => {
    vi.mocked(userClient.makeRpcCall).mockResolvedValueOnce({ result: mockUsers });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => expect(userClient.makeRpcCall).toHaveBeenCalledTimes(1));

    mockUsers.forEach(({ firstName, lastName }) => {
      expect(screen.getByText(new RegExp(`${firstName} ${lastName}`, 'i'))).toBeInTheDocument();
    });
  });

  it('selects a user and fetches messages', async () => {
    const mockUsersResponse = { result: mockUsers };
    const mockMessagesResponse = { result: mockMessages };

    vi.mocked(userClient.makeRpcCall).mockResolvedValueOnce(mockUsersResponse);
    vi.mocked(messageClient.getMessages).mockResolvedValueOnce(mockMessagesResponse);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    const userElement = await screen.findByText('Jane Smith');
    fireEvent.click(userElement);

    await waitFor(() => expect(messageClient.getMessages).toHaveBeenCalledTimes(1));

    // await waitFor(() => expect(screen.getAllByTestId('orbs')).toHaveLength(5), { timeout: 1000 });
    //
    // const messageInput = screen.getByRole('textbox');
    // fireEvent.change(messageInput, { target: { value: 'Test message' } });
    // fireEvent.click(screen.getByText('Send'));
    //
    // await waitFor(() => expect(screen.getAllByTestId('orbs')).toHaveLength(10), { timeout: 1000 });
    //
    // await waitFor(() => expect(screen.queryAllByTestId('orbs')).toHaveLength(0), { timeout: 6000 });
  });
});
