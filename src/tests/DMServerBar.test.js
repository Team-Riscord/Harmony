import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DMServerBar from '../components/DMServerBar';
import { get } from 'firebase/database';
import db from '../utils/firebase';

jest.mock('firebase/database', () => ({
  get: jest.fn(),
}));

test('renders direct message server bar component', () => {
  render(<DMServerBar />);
  const directMessagesTitle = screen.getByText(/direct messages/i);
  expect(directMessagesTitle).toBeInTheDocument();
});

test('displays add friend button', () => {
  render(<DMServerBar />);
  const addFriendButton = screen.getByText(/add friend/i);
  expect(addFriendButton).toBeInTheDocument();
});

test('displays friend requests button', () => {
  render(<DMServerBar />);
  const friendRequestsButton = screen.getByText(/friend requests/i);
  expect(friendRequestsButton).toBeInTheDocument();
});

test('displays direct messages title', () => {
  render(<DMServerBar />);
  const directMessagesTitle = screen.getByText(/direct messages/i);
  expect(directMessagesTitle).toBeInTheDocument();
});

test('displays create DM button when hovering over direct messages title', async () => {
  render(<DMServerBar />);
  fireEvent.mouseOver(screen.getByText(/direct messages/i));
  await waitFor(() => {
    const createDMButton = screen.getByText(/create dm/i);
    expect(createDMButton).toBeInTheDocument();
  });
});

test('opens add friend component when add friend button is clicked', async () => {
  render(<DMServerBar />);
  fireEvent.click(screen.getByText(/add friend/i));
  await waitFor(() => {
    expect(screen.getByText(/add friend/i)).toBeInTheDocument();
  });
});

test('opens friend requests component when friend requests button is clicked', async () => {
  render(<DMServerBar />);
  fireEvent.click(screen.getByText(/friend requests/i));
  await waitFor(() => {
    expect(screen.getByText(/friend requests/i)).toBeInTheDocument();
  });
});

test('opens friends list component when create DM button is clicked', async () => {
  render(<DMServerBar />);
  fireEvent.click(screen.getByText(/create dm/i));
  await waitFor(() => {
    expect(screen.getByText(/friends list/i)).toBeInTheDocument();
  });
});