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
        const passwordInput = screen.getByLabelText('Password'); // Changed for specificity
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password');
    });

    test('allows toggling of password visibility', () => {
        render(<Login />);
        const passwordInput = screen.getByLabelText('Password'); // Changed for specificity
        const showPasswordCheckbox = screen.getByLabelText(/Show Password/i);
        // Initially, the password should be of type 'password' (hidden)
        expect(passwordInput).toHaveAttribute('type', 'password');
        // Toggle the checkbox to show the password
        fireEvent.click(showPasswordCheckbox);
        expect(passwordInput).toHaveAttribute('type', 'text');
        // Toggle again to hide the password
        fireEvent.click(showPasswordCheckbox);
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('displays an error message for incorrect credentials', async () => {
        axios.post.mockResolvedValueOnce({ data: { message: "Incorrect email/username or password" } });

        render(<Login />);
        fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } }); // Changed for specificity
        fireEvent.click(screen.getByText(/Login/i));

        await waitFor(() => screen.getByText('* Incorrect email/username or password'));
    });

    test('allows a user to log in with correct credentials', async () => {
        axios.post.mockResolvedValueOnce({ data: { message: "Login successful", user: { username: 'ronak123', password: '12345678' } } });

        render(<Login />);
        fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: 'ronak123' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: '12345678' } }); // Changed for specificity
        fireEvent.click(screen.getByText(/Login/i));

        await waitFor(() => expect(axios.post).toHaveBeenCalledWith("http://localhost:8800/login", { emailOrUsername: 'ronak123', password: '12345678' }));
    });
});
