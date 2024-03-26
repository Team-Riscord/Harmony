import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AddServer from '../components/AddServer/AddServer';

jest.mock('axios');

describe('AddServer Component', () => {
  test('adds a new server when form is submitted', async () => {
    axios.post.mockResolvedValueOnce({ status: 201, data: { message: 'Server added successfully', serverID: '3' } });
    const onAddMock = jest.fn();
    const onCloseMock = jest.fn();
    const { getByLabelText, getByText } = render(<AddServer onAdd={onAddMock} onClose={onCloseMock} />);
    
    fireEvent.change(getByLabelText('Server Name'), { target: { value: 'Test Server' } });
    fireEvent.change(getByLabelText('Server Image'), { target: { files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })] } });
    fireEvent.click(getByText('Create'));
    
    await waitFor(() => {
      expect(onAddMock).toHaveBeenCalledTimes(1);
      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8800/add-server', expect.any(FormData), {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      expect(getByText('Server added successfully')).toBeInTheDocument();
    });
  });
});
