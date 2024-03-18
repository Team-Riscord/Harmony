import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login/Login';
import axios from 'axios';

jest.mock('axios');

describe('Login Component', () => {
    test('allows a user to type in the input boxes', () => {
        render(<Login />);
        const usernameInput = screen.getByLabelText(/Email or Username/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password');
    });

    test('displays an error message for incorrect credentials', async () => {
        axios.post.mockResolvedValueOnce({ data: { message: "Incorrect email/username or password" } });

        render(<Login />);
        fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByText(/Login/i));

        await waitFor(() => screen.getByText('* Incorrect email/username or password'));
    });

    test('allows a user to log in with correct credentials', async () => {
        axios.post.mockResolvedValueOnce({ data: { message: "Login successful", user: { username: 'ronak123', password: '12345678' } } });

        render(<Login />);
        fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: 'ronak123' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '12345678' } });
        fireEvent.click(screen.getByText(/Login/i));

        await waitFor(() => expect(axios.post).toHaveBeenCalledWith("http://localhost:8800/login", { emailOrUsername: 'ronak123', password: '12345678' }));
    });
});
