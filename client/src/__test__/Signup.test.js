import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from "axios";
import Signup from '../components/Signup/Signup';

jest.mock('axios');

describe('Signup Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: '<table><tr><td>Existing User Data</td></tr></table>' });
    axios.post.mockResolvedValueOnce({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders form elements [Signup]', () => {
    const { getByLabelText, getByText } = render(<Signup />);
    expect(getByLabelText('enter your full name')).toBeInTheDocument();
    expect(getByLabelText('enter your email')).toBeInTheDocument();
    expect(getByLabelText('enter a password')).toBeInTheDocument();
    expect(getByLabelText('choose a username')).toBeInTheDocument();
    expect(getByText('sign up')).toBeInTheDocument();
  });

  test('displays error messages for empty inputs [Signup]', async () => {
    const { getByText } = render(<Signup />);
    fireEvent.click(getByText('sign up'));
    await waitFor(() => {
      expect(getByText('* please enter your name')).toBeInTheDocument();
      expect(getByText('* please enter your email')).toBeInTheDocument();
      expect(getByText('* please enter a password')).toBeInTheDocument();
      expect(getByText('* please choose a username for yourself')).toBeInTheDocument();
    });
  });

  test('displays error message for invalid email format [Signup]', async () => {
    const { getByLabelText, getByText } = render(<Signup />);
    fireEvent.change(getByLabelText('enter your email'), { target: { value: 'invalidemail' } });
    fireEvent.click(getByText('sign up'));
    await waitFor(() => {
      expect(getByText('* please enter a valid email')).toBeInTheDocument();
    });
  });

  test('displays error message for name longer than 100 characters [Signup]', async () => {
    const { getByLabelText, getByText } = render(<Signup />);
    fireEvent.change(getByLabelText('enter your full name'), { target: { value: 'a'.repeat(101) } });
    fireEvent.click(getByText('sign up'));
    await waitFor(() => {
      expect(getByText('* name cannot be longer than 100 characters')).toBeInTheDocument();
    });
  });

  test('displays error message for email longer than 100 characters [Signup]', async () => {
    const { getByLabelText, getByText } = render(<Signup />);
    fireEvent.change(getByLabelText('enter your email'), { target: { value: 'a'.repeat(101) + '@example.com' } });
    fireEvent.click(getByText('sign up'));
    await waitFor(() => {
      expect(getByText('* email cannot be longer than 100 characters')).toBeInTheDocument();
    });
  });

  test('displays error message for password longer than 100 characters [Signup]', async () => {
    const { getByLabelText, getByText } = render(<Signup />);
    fireEvent.change(getByLabelText('enter a password'), { target: { value: 'a'.repeat(101) } });
    fireEvent.click(getByText('sign up'));
    await waitFor(() => {
      expect(getByText('* password cannot be longer than 100 characters')).toBeInTheDocument();
    });
  });

  test('displays error message for username longer than 10 characters [Signup]', async () => {
    const { getByLabelText, getByText } = render(<Signup />);
    fireEvent.change(getByLabelText('choose a username'), { target: { value: 'a'.repeat(11) } });
    fireEvent.click(getByText('sign up'));
    await waitFor(() => {
      expect(getByText('* username cannot be longer than 10 characters')).toBeInTheDocument();
    });
  });

  test('toggle show password functionality [Signup]', async () => {
    const { getByLabelText } = render(<Signup />);
    const passwordInput = getByLabelText('enter a password');
    const showPasswordCheckbox = getByLabelText('show password');
    expect(passwordInput.type).toBe('password');
    fireEvent.click(showPasswordCheckbox);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(showPasswordCheckbox);
    expect(passwordInput.type).toBe('password');
  });
  
  test('renders link to login page [Signup]', () => {
    render(<Signup />);
    const loginLink = screen.getByRole('link', { name: 'already have an account? click to login!' });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('displays error message for existing email or username [Signup]', async () => {
    axios.get.mockResolvedValueOnce({ data: '<table><tr><td>Email</td><td>Username</td></tr><tr><td>anitejsharmas@gmail.com</td><td>aisaaxs</td></tr></table>' });
  
    const { getByLabelText, getByText } = render(<Signup />);

    fireEvent.change(getByLabelText('enter your full name'), { target: { value: 'test name' } });
    fireEvent.change(getByLabelText('enter your email'), { target: { value: 'anitejsharmas@gmail.com' } });
    fireEvent.change(getByLabelText('enter a password'), { target: { value: 'test password' } });
    fireEvent.change(getByLabelText('choose a username'), { target: { value: 'aisaaxs' } });
  
    fireEvent.click(getByText('sign up'));
  
    await waitFor(() => {
      expect(getByText('* email already exists')).toBeInTheDocument();
      expect(getByText('* username already exists')).toBeInTheDocument();
    });
  });

  delete window.location;
  window.location = { href: '' };

  test('submits form successfully [Signup]', async () => {
    axios.post.mockResolvedValueOnce({});
    const { getByLabelText, getByText } = render(<Signup />);
    
    fireEvent.change(getByLabelText('enter your full name'), { target: { value: 'test name' } });
    fireEvent.change(getByLabelText('enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('enter a password'), { target: { value: 'test password' } });
    fireEvent.change(getByLabelText('choose a username'), { target: { value: 'test_user' } });
    
    fireEvent.click(getByText('sign up'));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:8800/userdata", {
        name: 'test name',
        email: 'test@example.com',
        password: 'test password',
        username: 'test_user',
        image: 'default-profile-image.png'
      });
      expect(window.location.href).toBe('/login');
    });
  });
});