import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import JoinServer from '../components/JoinServer/JoinServer';

jest.mock('axios');

describe('JoinServer Component', () => {
  test('joins server when join button is clicked', async () => {
    axios.post.mockResolvedValueOnce({ status: 200, data: { message: 'Joined server successfully' } });
    const { getByText } = render(<JoinServer userId="123" serverId="1" />);
    
    fireEvent.click(getByText('Join'));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8800/join-server', { userId: '123', serverId: '1' });
      expect(getByText('Joined server successfully')).toBeInTheDocument();
    });
  });
});
