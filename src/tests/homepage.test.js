import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Homepage from '../components/Homepage';

describe('Homepage navigation tests', () => {
  test('Navigates to the Signup page when the Sign Up button is clicked', () => {
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
    userEvent.click(signUpButton);
  });

  test('Navigates to the Login page when the Login button is clicked', () => {
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole('button', { name: /Login/i });
    userEvent.click(loginButton);
  });
});
