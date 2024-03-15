import { render, screen, waitFor } from '@testing-library/react';
import FriendsList from '../components/FriendsList';
import { onValue, get } from 'firebase/database';
import db from '../utils/firebase';

jest.mock('firebase/database', () => ({
  onValue: jest.fn(),
  get: jest.fn(),
}));

test('renders friends list component', () => {
  render(<FriendsList onClose={() => {}} />);
  const friendsListTitle = screen.getByText(/Your Friends List/i);
  expect(friendsListTitle).toBeInTheDocument();
});

test('displays close icon', () => {
  render(<FriendsList onClose={() => {}} />);
  const closeIcon = screen.getByTestId('close-icon');
  expect(closeIcon).toBeInTheDocument();
});

test('fetches friends list data', async () => {
  get.mockImplementationOnce(() => Promise.resolve({ val: () => ({ 'friend1': { userId: '123' }, 'friend2': { userId: '456' } }) }));
  get.mockImplementationOnce(() => Promise.resolve({ val: () => ({ profileImage: 'image1.jpg', username: 'Friend1' }) }));
  get.mockImplementationOnce(() => Promise.resolve({ val: () => ({ profileImage: 'image2.jpg', username: 'Friend2' }) }));

  render(<FriendsList onClose={() => {}} />);
  
  await waitFor(() => {
    expect(screen.getByText(/Friend1/i)).toBeInTheDocument();
    expect(screen.getByText(/Friend2/i)).toBeInTheDocument();
  });
});

test('displays chat button for each friend', async () => {
  get.mockImplementationOnce(() => Promise.resolve({ val: () => ({ 'friend1': { userId: '123' } }) }));
  get.mockImplementationOnce(() => Promise.resolve({ val: () => ({ profileImage: 'image1.jpg', username: 'Friend1' }) }));

  render(<FriendsList onClose={() => {}} />);
  
  await waitFor(() => {
    const chatButtons = screen.getAllByRole('button', { name: /Chat/i });
    expect(chatButtons.length).toBe(1);
  });
});