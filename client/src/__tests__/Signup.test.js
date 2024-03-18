import React from 'react';
import { render } from '@testing-library/react';
import Signup from '../components/Signup/Signup';

describe('Signup Component', () => {
  test('renders form elements [Signup]', () => {
    const { getByLabelText, getByText } = render(<Signup />);
    expect(getByLabelText('enter your full name')).toBeInTheDocument();
    expect(getByLabelText('enter your email')).toBeInTheDocument();
    expect(getByLabelText('enter your password')).toBeInTheDocument();
    expect(getByLabelText('choose a username')).toBeInTheDocument();
    expect(getByText('sign up')).toBeInTheDocument();
  });
});