import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddFriend from '../components/AddFriend';
import { get, ref, push } from 'firebase/database';
import db from '../utils/firebase';

jest.mock('firebase/database', () => ({
  get: jest.fn(),
  ref: jest.fn(),
  push: jest.fn(),
}));

test('renders add friend component', () => {
  const mockOnClose = jest.fn();
  render(<AddFriend onClose={mockOnClose} />);
  const addFriendTitle = screen.getByText(/add friend/i);
  expect(addFriendTitle).toBeInTheDocument();
});

test('displays error message when friend username is not provided', () => {
  const mockOnClose = jest.fn();
  render(<AddFriend onClose={mockOnClose} />);
  fireEvent.click(screen.getByText(/send friend request/i));
  const errorMessage = screen.getByText(/please enter a username to add as a friend/i);
  expect(errorMessage).toBeInTheDocument();
});

test('displays error message when trying to add oneself as friend', () => {
  const mockOnClose = jest.fn();
  render(<AddFriend onClose={mockOnClose} />);
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'testUser' },
  });
  fireEvent.click(screen.getByText(/send friend request/i));
  const errorMessage = screen.getByText(/you cannot add yourself as friend/i);
  expect(errorMessage).toBeInTheDocument();
});

test('displays error message when user does not exist', async () => {
  const mockOnClose = jest.fn();
  render(<AddFriend onClose={mockOnClose} />);
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'nonExistentUser' },
  });
  fireEvent.click(screen.getByText(/send friend request/i));
  await waitFor(() => {
    const errorMessage = screen.getByText(/user does not exist/i);
    expect(errorMessage).toBeInTheDocument();
  });
});

test('calls addFriend function when send friend request button is clicked', async () => {
  const mockOnClose = jest.fn();
  render(<AddFriend onClose={mockOnClose} />);
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'existingUser' },
  });
  fireEvent.click(screen.getByText(/send friend request/i));
  expect(get(ref(db, 'Users/'))).toHaveBeenCalled();
  expect(push).toHaveBeenCalledTimes(2);
});

test('calls onClose function when close button is clicked', () => {
  const mockOnClose = jest.fn();
  render(<AddFriend onClose={mockOnClose} />);
  fireEvent.click(screen.getByLabelText(/close/i));
  expect(mockOnClose).toHaveBeenCalled();
});