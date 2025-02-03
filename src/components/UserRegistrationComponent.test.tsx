import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '@/state/store';
import UserRegistrationComponent from './UserRegistrationComponent';
import { registrationFormFields } from "@/constants/registrationFormFields";
import { userClient } from '@/services/userClient';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authClient } from "@/services/authClient";

vi.mock('@/services/userClient', () => ({
  userClient: {
    makeRpcCall: vi.fn(),
  },
}));

vi.mock('@/services/authClient', () => ({
  authClient: {
    makeRpcCall: vi.fn(),
  }
}))

beforeEach(() => {
  vi.clearAllMocks();
});

describe('UserRegistrationComponent', () => {
  it('renders the registration form', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserRegistrationComponent />
        </MemoryRouter>
      </Provider>
    );

    const fields = ['first-name', 'last-name', 'user-name', 'email', 'password', 'confirm'];
    fields.forEach((field) => {
      expect(screen.getByTestId(new RegExp(field, 'i'))).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  it('submits the form with valid input', async () => {
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
          <UserRegistrationComponent />
        </MemoryRouter>
      </Provider>
    );

    const mockInputData = {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'johndoe',
      email: 'john@doe.com',
      password: 'password',
      confirmPassword: 'password',
    };

    registrationFormFields.forEach(({ name, dataTestId }) => {
      fireEvent.change(screen.getByTestId(new RegExp(dataTestId, 'i')), {
        target: { value: mockInputData[name as keyof typeof mockInputData] },
      });
    });


    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Registration successful!');
    });

    await expect(userClient.makeRpcCall).toHaveBeenCalledWith('createUser', {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'johndoe',
      email: 'john@doe.com',
    });

    await expect(authClient.makeRpcCall).toHaveBeenCalledWith('createUser', {
      userId: '1234',
      password: 'password',
    });

    alertSpy.mockRestore();
  });
});
