import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Homepage from '../components/Homepage/Homepage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Homepage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Homepage component [Homepage]', async () => {
    const { container } = render(<Homepage />);    
    await waitFor(() => {
        expect(container.querySelector('.homepage-title')).toBeInTheDocument();
        expect(container.querySelector('.homepage-title')).toHaveTextContent('welcome to');
        
        const harmonySpan = container.querySelector('.homepage-title span');
        expect(harmonySpan).toBeInTheDocument();
        expect(harmonySpan.textContent).toBe('harmony');
      });
  });

  test('navigates to signup page when Sign Up button is clicked [Homepage]', () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
    
    const { getByText } = render(<Homepage />);
    fireEvent.click(getByText('Sign Up'));
    expect(navigate).toHaveBeenCalledWith('/signup');
  });

  test('navigates to login page when Login button is clicked [Homepage]', () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    const { getByText } = render(<Homepage />);
    fireEvent.click(getByText('Login'));
    expect(navigate).toHaveBeenCalledWith('/login');
  });
});
