import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '@/state/store';
import UserRegistrationComponent from './UserRegistrationComponent';
import { registrationFormFields } from "@/constants/registrationFormFields";
import { rpcClient } from '@/services/rpcClient';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/rpcClient', () => ({
  rpcClient: {
    makeRpcCall: vi.fn(),
  },
}));

// vi.stubGlobal('alert', vi.fn());

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

    const fields = ['First Name', 'Last Name', 'Username', 'Email'];
    fields.forEach((field) => {
      expect(screen.getByPlaceholderText(new RegExp(field, 'i'))).toBeInTheDocument();
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

    vi.mocked(rpcClient.makeRpcCall).mockResolvedValueOnce(mockResponseData);
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
    };

    registrationFormFields.forEach(({ name, placeholder }) => {
      fireEvent.change(screen.getByPlaceholderText(new RegExp(placeholder, 'i')), {
        target: { value: mockInputData[name as keyof typeof mockInputData] },
      });
    });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Registration successful!');
    });

    await expect(rpcClient.makeRpcCall).toHaveBeenCalledWith('createUser', mockInputData);

    alertSpy.mockRestore();
  });
});
