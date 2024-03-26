import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from "axios";
import SideBar from '../components/SideBar/SideBar';

jest.mock('axios');

describe('Sidebar Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ status: 200, data: [{ id: '1', icon: 'server1_icon' }, { id: '2', icon: 'server2_icon' }] });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('displays server icons', async () => {
    const { getByTestId } = render(<SideBar />);
    await waitFor(() => {
      expect(getByTestId('add-server-icon')).toBeInTheDocument();
      expect(getByTestId('download-apps-icon')).toBeInTheDocument();
      expect(getByTestId('server-icon-1')).toBeInTheDocument();
      expect(getByTestId('server-icon-2')).toBeInTheDocument();
    });
  });

  test('joins server when server icon is clicked', async () => {
    axios.post.mockResolvedValueOnce({ status: 200, data: { message: 'Joined server successfully' } });
    const { getByTestId } = render(<SideBar />);
    fireEvent.click(getByTestId('server-icon-1'));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8800/join-server', { userId: '123', serverId: '1' });
      expect(screen.getByText('Joined server successfully')).toBeInTheDocument();
    });
  });

  test('fetches server data and displays error message if there is an error', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch server data'));
    const { getByText } = render(<SideBar />);
    await waitFor(() => {
      expect(getByText('Error fetching server data. Please try again later.')).toBeInTheDocument();
    });
  });

  test('toggles visibility of AddServer component when add server icon is clicked', async () => {
    const { getByTestId, queryByText } = render(<SideBar />);
    fireEvent.click(getByTestId('add-server-icon'));
    await waitFor(() => {
      expect(queryByText('Add Server')).toBeInTheDocument();
    });
  });
  
  test('toggles visibility of DownloadApps component when download apps icon is clicked', async () => {
    const { getByTestId, queryByText } = render(<SideBar />);
    fireEvent.click(getByTestId('download-apps-icon'));
    await waitFor(() => {
      expect(queryByText('Download Apps')).toBeInTheDocument();
    });
  });
  
});
