import { render, screen } from '@testing-library/react';
import Harmony from '../components/Harmony';

test('renders Riscord page with Sidebar and DMServerBar', () => {
  render(<Harmony />);
  const sidebarElement = screen.getByText(/sidebar/i);
  const dmServerBarElement = screen.getByText(/direct messages/i);
  expect(sidebarElement).toBeInTheDocument();
  expect(dmServerBarElement).toBeInTheDocument();
});