import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import MessagingComponent from "../components/MessagingComponent/MessagingComponent";

// Update the mock to correctly simulate the socket.io-client factory function
jest.mock('socket.io-client', () => {
    return () => ({
        emit: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
    });
});
describe('MessagingComponent', () => {
    let mockSocket;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        mockSocket = require('socket.io-client')(); // Get the mocked version of the socket

        // Set up the mock implementation for receiving a message
        mockSocket.on.mockImplementation((event, callback) => {
            if (event === 'receive_message') {
                callback({ sender_id: 1, receiver_id: 2, message_text: 'Hello World', created_at: new Date().toISOString() });
            }
        });

        // Mocking local storage for userData
        const userData = JSON.stringify({ id: 1, username: 'testUser' });
        Storage.prototype.getItem = jest.fn(() => userData);
    });

    it('renders correctly', () => {
        render(
          <Router>
            <MessagingComponent />
          </Router>
        );
        expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
    });

    it('clears input after sending a message', async () => {
        render(
          <Router>
            <MessagingComponent />
          </Router>
        );
        const input = screen.getByPlaceholderText('Type your message...');
        const sendButton = screen.getByRole('button', { name: 'Send' });

        // Simulate user typing a message and clicking the send button
        fireEvent.change(input, { target: { value: 'Test message' } });
        fireEvent.click(sendButton);

        await waitFor(() => {
            // Check if the input field is cleared after sending a message
            expect(input.value).toBe('');
        });
    });

});
