import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from "axios";
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
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

  const renderLoginComponent = () => {
    return render(
      <Router>
        <Login />
      </Router>
    );
  };

  test('renders form elements [Login]', () => {
    renderLoginComponent();
    expect(screen.getByLabelText('enter your email or username')).toBeInTheDocument();
    expect(screen.getByLabelText('enter your password')).toBeInTheDocument();
    expect(screen.getByText('login')).toBeInTheDocument();
  });

  test('displays error messages for empty inputs [Login]', async () => {
    renderLoginComponent();
    fireEvent.click(screen.getByText('login'));
    await waitFor(() => {
      expect(getByText('please enter your email or username')).toBeInTheDocument();
      expect(getByText('please enter your password')).toBeInTheDocument();
    });
  });

  test('toggles show password functionality [Login]', () => {
    renderLoginComponent();
    const passwordInput = screen.getByLabelText('enter your password');
    const showPasswordCheckbox = screen.getByLabelText('show password');
    expect(passwordInput.type).toBe('password');
    fireEvent.click(showPasswordCheckbox);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(showPasswordCheckbox);
    expect(passwordInput.type).toBe('password');
  });

  test('submits form successfully [Login]', async () => {
    renderLoginComponent();
    fireEvent.change(screen.getByLabelText('enter your email or username'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('enter your password'), { target: { value: 'test password' } });
    fireEvent.click(screen.getByText('login'));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:8800/login", {
        emailOrUsername: 'test@example.com',
        password: 'test password'
      });
      expect(localStorage.getItem('userData')).toEqual(JSON.stringify({ userId: '123', username: 'test_user' }));
    });
  });

  test('displays error message for wrong email/username or password [Login]', async () => {
    axios.post.mockRejectedValueOnce({});
    renderLoginComponent();
    fireEvent.change(screen.getByLabelText('enter your email or username'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('enter your password'), { target: { value: 'test password' } });
    fireEvent.click(screen.getByText('login'));
    await waitFor(() => {
      expect(getAllByText('wrong email/username or password').length).toBeGreaterThanOrEqual(1);
    });
  });
});
