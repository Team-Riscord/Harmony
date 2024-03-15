import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../components/Login';

test('renders login page', () => {
  render(<Login />);
  const loginTitle = screen.getByText(/welcome back to harmony/i);
  const loginSubtitle = screen.getByText(/we're so excited to see you!/i);
  const emailOrUsernameLabel = screen.getByText(/enter your email or username/i);
  const passwordLabel = screen.getByText(/enter your password/i);
  const loginButton = screen.getByText(/login/i);
  const signUpLink = screen.getByText(/don't have an account? click to sign up!/i);

  expect(loginTitle).toBeInTheDocument();
  expect(loginSubtitle).toBeInTheDocument();
  expect(emailOrUsernameLabel).toBeInTheDocument();
  expect(passwordLabel).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
  expect(signUpLink).toBeInTheDocument();
});

test('shows error message if email or username is empty', () => {
  render(<Login />);
  const loginButton = screen.getByText(/login/i);

  fireEvent.click(loginButton);

  const emailOrUsernameError = screen.getByText(/please enter your email or username/i);
  const passwordError = screen.queryByText(/please enter your password/i);

  expect(emailOrUsernameError).toBeInTheDocument();
  expect(passwordError).toBeNull();
});

test('shows error message if password is empty', () => {
  render(<Login />);
  const loginButton = screen.getByText(/login/i);

  fireEvent.change(screen.getByLabelText(/enter your email or username/i), { target: { value: 'test@example.com' } });
  fireEvent.click(loginButton);

  const passwordError = screen.getByText(/please enter your password/i);
  const emailOrUsernameError = screen.queryByText(/please enter your email or username/i);

  expect(passwordError).toBeInTheDocument();
  expect(emailOrUsernameError).toBeNull();
});

test('shows error message for invalid email format', () => {
  render(<Login />);
  const loginButton = screen.getByText(/login/i);

  fireEvent.change(screen.getByLabelText(/enter your email or username/i), { target: { value: 'invalidemail' } });
  fireEvent.click(loginButton);

  const emailOrUsernameError = screen.getByText(/please enter a valid email/i);
  const passwordError = screen.queryByText(/please enter your password/i);

  expect(emailOrUsernameError).toBeInTheDocument();
  expect(passwordError).toBeNull();
});

test('shows error message for incorrect email/username or password', () => {
  render(<Login />);
  const loginButton = screen.getByText(/login/i);

  fireEvent.change(screen.getByLabelText(/enter your email or username/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/enter your password/i), { target: { value: 'invalidpassword' } });
  fireEvent.click(loginButton);

  const errorMessages = screen.getAllByText(/incorrect email\/username or password/i);

  expect(errorMessages.length).toBe(2);
});