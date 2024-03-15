import { render, screen, fireEvent } from '@testing-library/react';
import JoinServer from '../components/JoinServer';

test('renders JoinServer component with title and input field', () => {
  render(<JoinServer />);
  const titleElement = screen.getByText(/join a server/i);
  const inputElement = screen.getByLabelText(/invite link/i);
  expect(titleElement).toBeInTheDocument();
  expect(inputElement).toBeInTheDocument();
});

test('displays error message when joining without entering an invite link', () => {
  render(<JoinServer />);
  const joinButton = screen.getByRole('button', { name: /join server/i });
  fireEvent.click(joinButton);
  const errorMessageElement = screen.getByText(/please enter an invite link/i);
  expect(errorMessageElement).toBeInTheDocument();
});

test('displays error message when joining with an invalid invite link', () => {
  render(<JoinServer />);
  const inputElement = screen.getByLabelText(/invite link/i);
  fireEvent.change(inputElement, { target: { value: 'invalid-link' } });
  const joinButton = screen.getByRole('button', { name: /join server/i });
  fireEvent.click(joinButton);
  const errorMessageElement = screen.getByText(/invalid invitation link/i);
  expect(errorMessageElement).toBeInTheDocument();
});

test('displays example invites', () => {
  render(<JoinServer />);
  const inviteExampleElement = screen.getByText(/invites should look like/i);
  expect(inviteExampleElement).toBeInTheDocument();
});

test('calls the goBackButton function when back button is clicked', () => {
  const mockGoBack = jest.fn();
  render(<JoinServer onBack={mockGoBack} />);
  const backButton = screen.getByText(/back/i);
  fireEvent.click(backButton);
  expect(mockGoBack).toHaveBeenCalled();
});

test('calls the joinServer function when join button is clicked with a valid invite link', () => {
  const mockJoinServer = jest.fn();
  render(<JoinServer />);
  const inputElement = screen.getByLabelText(/invite link/i);
  fireEvent.change(inputElement, { target: { value: 'valid-link' } });
  const joinButton = screen.getByRole('button', { name: /join server/i });
  fireEvent.click(joinButton);
  expect(mockJoinServer).toHaveBeenCalled();
});