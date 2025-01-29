import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '@/state/store';
import FindUserByEmail from './FindUserByEmail';
import { userClient } from '@/services/userClient';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/userClient', () => ({
  userClient: {
    makeRpcCall: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('FindUserByEmail', () => {
  it('renders the email form', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FindUserByEmail />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
  });

  it('submits the form with valid email', async () => {
    const mockResponseData = {
      result: {
        id: '1234',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
      },
    };

    vi.mocked(userClient.makeRpcCall).mockResolvedValueOnce(mockResponseData);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FindUserByEmail />
        </MemoryRouter>
      </Provider>
    );

    const mockInputData = { email: 'john@doe.com' };

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: mockInputData.email },
    });

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('User found');
    });

    await expect(userClient.makeRpcCall).toHaveBeenCalledWith('findUserByEmail', mockInputData);

    alertSpy.mockRestore();
  });

  it('displays an error message when the user is not found', async () => {
    const mockResponseData = { error: 'User not found' };

    vi.mocked(userClient.makeRpcCall).mockResolvedValueOnce(mockResponseData);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FindUserByEmail />
        </MemoryRouter>
      </Provider>
    );

    const mockInputData = { email: 'nonexistent@doe.com' };

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: mockInputData.email },
    });

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error: User not found');
    });

    alertSpy.mockRestore();
  });

  it('handles errors during submission', async () => {
    const mockError = new Error('Network error');
    vi.mocked(userClient.makeRpcCall).mockRejectedValueOnce(mockError);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FindUserByEmail />
        </MemoryRouter>
      </Provider>
    );

    const mockInputData = { email: 'john@doe.com' };

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: mockInputData.email },
    });

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('An error occurred fetching email.');
    });

    alertSpy.mockRestore();
  });
});
