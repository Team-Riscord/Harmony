import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../SideBar/SideBar';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

jest.mock('../AddServer/AddServer', () => () => <div>AddServer Mock</div>);
jest.mock('../DownloadApps/DownloadApps', () => () => <div>DownloadApps Mock</div>);

describe('Sidebar Component', () => {
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset();
  });

  it('renders without crashing', () => {
    render(<Sidebar />);
    expect(screen.getByText('AddServer Mock')).toBeInTheDocument();
    expect(screen.getByText('DownloadApps Mock')).toBeInTheDocument();
  });

  it('fetches servers on component mount', async () => {
    mock.onGet("http://localhost:8800/servers").reply(200, [
      { id: '1', name: 'Test Server', serverIcon: '' }
    ]);

    render(<Sidebar />);

    await waitFor(() => {
      expect(screen.getByText('Test Server')).toBeInTheDocument();
    });
  });

  it('can join a server', async () => {
    // Mock the server list
    mock.onGet("http://localhost:8800/servers").reply(200, [
      { id: '1', name: 'Joinable Server', serverIcon: '' }
    ]);
    // Mock the join server response
    mock.onPost("http://localhost:8800/join-server").reply(200);

    render(<Sidebar />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Joinable Server'));
    });

    // Checks for a success message or updated state (depends on your implementation)
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Successfully joined the server!');
    });
  });
});
