import React from 'react';
import { render } from '@testing-library/react';
import Signup from '../components/Signup/Signup';

it('renders without crashing', () => {
  render(<Signup />);
});