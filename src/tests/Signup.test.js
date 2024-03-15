import { render, screen, fireEvent } from '@testing-library/react';
import Signup from '../components/Signup';

test('renders signup page', () => {
  render(<Signup />);
  const signupTitle = screen.getByText(/welcome to harmony/i);
  const signupSubtitle = screen.getByText(/let's get you started!/i);
  const fullnameLabel = screen.getByText(/enter your full name/i);
  const emailLabel = screen.getByText(/enter your email/i);
  const usernameLabel = screen.getByText(/choose a username/i);
  const passwordLabel = screen.getByText(/enter your password/i);
  const signupButton = screen.getByText(/signup/i);
  const loginLink = screen.getByText(/already have an account? click to login!/i);

  expect(signupTitle).toBeInTheDocument();
  expect(signupSubtitle).toBeInTheDocument();
  expect(fullnameLabel).toBeInTheDocument();
  expect(emailLabel).toBeInTheDocument();
  expect(usernameLabel).toBeInTheDocument();
  expect(passwordLabel).toBeInTheDocument();
  expect(signupButton).toBeInTheDocument();
  expect(loginLink).toBeInTheDocument();
});

test('shows error message if any field is empty', () => {
  render(<Signup />);
  const signupButton = screen.getByText(/signup/i);

  fireEvent.click(signupButton);

  const fullnameError = screen.getByText(/please enter your name/i);
  const emailError = screen.getByText(/please enter your email/i);
  const usernameError = screen.getByText(/please enter your username/i);
  const passwordError = screen.getByText(/please enter a password/i);

  expect(fullnameError).toBeInTheDocument();
  expect(emailError).toBeInTheDocument();
  expect(usernameError).toBeInTheDocument();
  expect(passwordError).toBeInTheDocument();
});

test('shows error message for invalid email format', () => {
  render(<Signup />);
  const signupButton = screen.getByText(/signup/i);

  fireEvent.change(screen.getByLabelText(/enter your email/i), { target: { value: 'invalidemail' } });
  fireEvent.click(signupButton);

  const emailError = screen.getByText(/please enter a valid email/i);

  expect(emailError).toBeInTheDocument();
});

test('shows error message if email already exists', () => {
  // Mock Firebase behavior to simulate existing email
  const mockOnValue = jest.fn();
  const mockRef = jest.fn(() => ({ onValue: mockOnValue }));
  jest.mock('../utils/firebase', () => ({
    ref: mockRef,
    push: () => {},
  }));
  mockOnValue.mockImplementationOnce((path, callback) => {
    callback({
      forEach: (cb) => {
        cb({
          val: () => ({ email: 'existingemail@example.com' }),
        });
      },
    });
  });

  render(<Signup />);
  fireEvent.change(screen.getByLabelText(/enter your email/i), { target: { value: 'existingemail@example.com' } });
  fireEvent.click(screen.getByText(/signup/i));

  const emailError = screen.getByText(/email already exists/i);
  expect(emailError).toBeInTheDocument();
});

test('shows error message if username already exists', () => {
  // Mock Firebase behavior to simulate existing username
  const mockOnValue = jest.fn();
  const mockRef = jest.fn(() => ({ onValue: mockOnValue }));
  jest.mock('../utils/firebase', () => ({
    ref: mockRef,
    push: () => {},
  }));
  mockOnValue.mockImplementationOnce((path, callback) => {
    callback({
      forEach: (cb) => {
        cb({
          val: () => ({ username: 'existingusername' }),
        });
      },
    });
  });

  render(<Signup />);
  fireEvent.change(screen.getByLabelText(/choose a username/i), { target: { value: 'existingusername' } });
  fireEvent.click(screen.getByText(/signup/i));

  const usernameError = screen.getByText(/username already exists/i);
  expect(usernameError).toBeInTheDocument();
});