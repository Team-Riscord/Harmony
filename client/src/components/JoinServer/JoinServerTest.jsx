import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import JoinServer from './JoinServer';

describe('JoinServer component', () => {
  it('renders properly', () => {
    const { getByText, getByLabelText } = render(<JoinServer />);
    expect(getByText('join a server')).toBeInTheDocument();
    expect(getByLabelText('Invite Link')).toBeInTheDocument();
  });

  it('displays error message when joining with empty invite link', async () => {
    const { getByText } = render(<JoinServer />);
    const joinButton = getByText('Join Server');
    fireEvent.click(joinButton);
    await waitFor(() => {
      expect(getByText('* please enter an invite link')).toBeInTheDocument();
    });
  });

  it('displays error message for invalid invite link format', async () => {
    const { getByText, getByLabelText } = render(<JoinServer />);
    const inviteInput = getByLabelText('Invite Link');
    const joinButton = getByText('Join Server');

    fireEvent.change(inviteInput, { target: { value: 'invalid-link' } });
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(getByText('* invalid invitation link format')).toBeInTheDocument();
    });
  });

  it('calls the onClose function when the "Back" button is clicked', () => {
    const onCloseMock = jest.fn();
    const { getByText } = render(<JoinServer onClose={onCloseMock} />);
    const backButton = getByText('Back');
    fireEvent.click(backButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('successfully joins server when valid invite link is provided', async () => {
    const onCloseMock = jest.fn();
    const { getByText, getByLabelText } = render(<JoinServer onClose={onCloseMock} />);
    const inviteInput = getByLabelText('Invite Link');
    const joinButton = getByText('Join Server');

    // Mock axios post request
    jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: { message: 'Successfully joined the server' } });

    fireEvent.change(inviteInput, { target: { value: 'https://riscord.gg/valid-link' } });
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  it('displays error message when joining server fails', async () => {
    const { getByText, getByLabelText } = render(<JoinServer />);
    const inviteInput = getByLabelText('Invite Link');
    const joinButton = getByText('Join Server');

    // Mock axios post request to simulate failure
    jest.spyOn(axios, 'post').mockRejectedValueOnce({ message: 'Error joining server' });

    fireEvent.change(inviteInput, { target: { value: 'https://riscord.gg/valid-link' } });
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(getByText('* invalid invitation link or you are already a part of the server')).toBeInTheDocument();
    });
  });
});
