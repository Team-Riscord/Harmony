import { render, screen, fireEvent } from '@testing-library/react';
import AddServer from '../components/AddServer';

test('renders add server component', () => {
  const mockFetchData = jest.fn();
  const mockOnClose = jest.fn();
  render(<AddServer fetchData={mockFetchData} onClose={mockOnClose} />);
  const addServerTitle = screen.getByText(/customize your server/i);
  expect(addServerTitle).toBeInTheDocument();
});

test('displays error message when server name is not provided', () => {
  const mockFetchData = jest.fn();
  const mockOnClose = jest.fn();
  render(<AddServer fetchData={mockFetchData} onClose={mockOnClose} />);
  fireEvent.click(screen.getByText(/create/i));
  const errorMessage = screen.getByText(/please enter a name for your server/i);
  expect(errorMessage).toBeInTheDocument();
});

test('displays error message when server image is not provided', () => {
  const mockFetchData = jest.fn();
  const mockOnClose = jest.fn();
  render(<AddServer fetchData={mockFetchData} onClose={mockOnClose} />);
  fireEvent.change(screen.getByLabelText(/server image/i), {
    target: { files: [] },
  });
  fireEvent.click(screen.getByText(/create/i));
  const errorMessage = screen.getByText(/please select an icon for your server/i);
  expect(errorMessage).toBeInTheDocument();
});

test('calls createServer function when create button is clicked', () => {
  const mockFetchData = jest.fn();
  const mockOnClose = jest.fn();
  render(<AddServer fetchData={mockFetchData} onClose={mockOnClose} />);
  fireEvent.change(screen.getByLabelText(/server name/i), {
    target: { value: 'Test Server' },
  });
  fireEvent.change(screen.getByLabelText(/server image/i), {
    target: { files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })] },
  });
  fireEvent.click(screen.getByText(/create/i));
  expect(mockFetchData).toHaveBeenCalled();
});

test('calls onClose function when close button is clicked', () => {
  const mockFetchData = jest.fn();
  const mockOnClose = jest.fn();
  render(<AddServer fetchData={mockFetchData} onClose={mockOnClose} />);
  fireEvent.click(screen.getByLabelText(/close/i));
  expect(mockOnClose).toHaveBeenCalled();
});