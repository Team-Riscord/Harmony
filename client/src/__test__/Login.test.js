import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from "axios";
import Login from '../components/Login/Login';

jest.mock('axios');

describe('Login Component', () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({ status: 200, data: { message: 'Login successful', user: { userId: '123', username: 'test_user' } } });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders form elements [Login]', () => {
    const { getByLabelText, getByText } = render(<Login />);
    expect(getByLabelText('enter your email or username')).toBeInTheDocument();
    expect(getByLabelText('enter your password')).toBeInTheDocument();
    expect(getByText('login')).toBeInTheDocument();
  });

  test('displays error messages for empty inputs [Login]', async () => {
    const { getByText } = render(<Login />);
    fireEvent.click(getByText('login'));
    await waitFor(() => {
      expect(getByText('* please enter your email or username')).toBeInTheDocument();
      expect(getByText('* please enter your password')).toBeInTheDocument();
    });
  });

  test('toggles show password functionality [Login]', () => {
    const { getByLabelText } = render(<Login />);
    const passwordInput = getByLabelText('enter your password');
    const showPasswordCheckbox = getByLabelText('show password');
    expect(passwordInput.type).toBe('password');
    fireEvent.click(showPasswordCheckbox);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(showPasswordCheckbox);
    expect(passwordInput.type).toBe('password');
  });

  test('submits form successfully [Login]', async () => {
    const { getByLabelText, getByText } = render(<Login />);
    
    fireEvent.change(getByLabelText('enter your email or username'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('enter your password'), { target: { value: 'test password' } });
    
    fireEvent.click(getByText('login'));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:8800/login", {
        emailOrUsername: 'test@example.com',
        password: 'test password'
      });
      expect(localStorage.getItem('userData')).toEqual('{"userId":"123","username":"test_user"}');
    });
  });

  test('displays error message for wrong email/username or password [Login]', async () => {
    axios.post.mockRejectedValueOnce({});
    
    const { getByLabelText, getAllByText } = render(<Login />);
    
    fireEvent.change(getByLabelText('enter your email or username'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('enter your password'), { target: { value: 'test password' } });
    
    fireEvent.click(screen.getByText('login'));

    await waitFor(() => {
      expect(getAllByText('* wrong email/username or password').length).toBeGreaterThanOrEqual(1);
    });
  });  
});