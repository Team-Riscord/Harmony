import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import FriendRequests from '../components/FriendRequests';
import { onValue, get, remove, push } from 'firebase/database';
import db from '../utils/firebase';

jest.mock('firebase/database', () => ({
  onValue: jest.fn(),
  get: jest.fn(),
  remove: jest.fn(),
  push: jest.fn(),
}));

test('renders friend requests component', () => {
  render(<FriendRequests onClose={() => {}} />);
  const friendRequestsTitle = screen.getByText(/Friend Requests/i);
  expect(friendRequestsTitle).toBeInTheDocument();
});

test('displays close icon', () => {
  render(<FriendRequests onClose={() => {}} />);
  const closeIcon = screen.getByTestId('close-icon');
  expect(closeIcon).toBeInTheDocument();
});

test('fetches friend requests data', async () => {
  get.mockImplementationOnce(() => Promise.resolve({ val: () => ({ 'request1': { userId: '123' }, 'request2': { userId: '456' } }) }));
  get.mockImplementationOnce(() => Promise.resolve({ val: () => ({ username: 'User1', profileImage: 'image1.jpg' }) }));
  get.mockImplementationOnce(() => Promise.resolve({ val: () => ({ username: 'User2', profileImage: 'image2.jpg' }) }));

  render(<FriendRequests onClose={() => {}} />);
  
  await waitFor(() => {
    expect(screen.getByText(/User1/i)).toBeInTheDocument();
    expect(screen.getByText(/User2/i)).toBeInTheDocument();
  });
});

test('displays accept and decline buttons for each request', async () => {
  render(<FriendRequests onClose={() => {}} />);
  
  await waitFor(() => {
    const acceptButtons = screen.getAllByRole('button', { name: /Accept/i });
    const declineButtons = screen.getAllByRole('button', { name: /Decline/i });
    expect(acceptButtons.length).toBe(1);
    expect(declineButtons.length).toBe(1);
  });
});

test('accepts friend request', async () => {
  push.mockResolvedValueOnce({});
  push.mockResolvedValueOnce({});
  remove.mockResolvedValueOnce({});
  remove.mockResolvedValueOnce({});

  render(<FriendRequests onClose={() => {}} />);
  
  fireEvent.click(screen.getByRole('button', { name: /Accept/i }));

  await waitFor(() => {
    expect(push).toHaveBeenCalledTimes(2);
    expect(remove).toHaveBeenCalledTimes(2);
  });
});

test('declines friend request', async () => {
  remove.mockResolvedValueOnce({});
  remove.mockResolvedValueOnce({});

  render(<FriendRequests onClose={() => {}} />);
  
  fireEvent.click(screen.getByRole('button', { name: /Decline/i }));

  await waitFor(() => {
    expect(remove).toHaveBeenCalledTimes(2);
  });
});