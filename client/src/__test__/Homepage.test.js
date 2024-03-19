import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Homepage from '../components/Homepage/Homepage';

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('Homepage navigation', () => {
  test('navigates to the signup page when the sign up button is clicked', () => {
    renderWithRouter(<Homepage />);
    const signupButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signupButton);
    expect(window.location.pathname).toBe('/signup');
  });

  test('navigates to the login page when the login button is clicked', () => {
    renderWithRouter(<Homepage />);
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    expect(window.location.pathname).toBe('/login');
  });
});