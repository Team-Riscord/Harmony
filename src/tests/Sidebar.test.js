import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import db from '../utils/firebase';

test('renders sidebar with default icons', () => {
  render(<Sidebar />);
  const directMessagesIcon = screen.getByLabelText(/direct messages/i);
  const addServerIcon = screen.getByLabelText(/add a server/i);
  const exploreServersIcon = screen.getByLabelText(/explore discoverable servers/i);
  const downloadAppsIcon = screen.getByLabelText(/download apps/i);

  expect(directMessagesIcon).toBeInTheDocument();
  expect(addServerIcon).toBeInTheDocument();
  expect(exploreServersIcon).toBeInTheDocument();
  expect(downloadAppsIcon).toBeInTheDocument();
});

test('renders server icons fetched from database', async () => {
  // Mock Firebase behavior to return server data
  const mockGet = jest.fn(() => ({
    val: () => ({
      serverName: 'Test Server',
      serverIcon: 'test-icon-url',
    }),
  }));
  jest.spyOn(db, 'get').mockImplementation(mockGet);

  render(<Sidebar />);
  await waitFor(() => {
    const serverIcon = screen.getByAltText(/test server/i);
    expect(serverIcon).toBeInTheDocument();
    expect(serverIcon.src).toContain('test-icon-url');
  });
});

test('shows add server component when add server icon is clicked', () => {
  render(<Sidebar />);
  fireEvent.click(screen.getByLabelText(/add a server/i));
  const addServerComponent = screen.getByText(/add server/i);
  expect(addServerComponent).toBeInTheDocument();
});

test('shows download apps component when download apps icon is clicked', () => {
  render(<Sidebar />);
  fireEvent.click(screen.getByLabelText(/download apps/i));
  const downloadAppsComponent = screen.getByText(/download apps/i);
  expect(downloadAppsComponent).toBeInTheDocument();
});

test('renders sidebar icons with hover indicators and overlay text', () => {
  render(<Sidebar />);
  const directMessagesIcon = screen.getByLabelText(/direct messages/i);

  fireEvent.mouseOver(directMessagesIcon);
  const overlayText = screen.getByText(/direct messages/i);
  expect(overlayText).toBeInTheDocument();

  fireEvent.mouseOut(directMessagesIcon);
  expect(overlayText).not.toBeInTheDocument();
});

test('toggles active icon on click', () => {
  render(<Sidebar />);
  const directMessagesIcon = screen.getByLabelText(/direct messages/i);
  const addServerIcon = screen.getByLabelText(/add a server/i);

  fireEvent.click(directMessagesIcon);
  expect(directMessagesIcon).toHaveClass('active');

  fireEvent.click(addServerIcon);
  expect(directMessagesIcon).not.toHaveClass('active');
  expect(addServerIcon).toHaveClass('active');
});

test('toggles add server component visibility on add server icon click', () => {
  render(<Sidebar />);
  fireEvent.click(screen.getByLabelText(/add a server/i));
  const addServerComponent = screen.getByText(/add server/i);
  expect(addServerComponent).toBeInTheDocument();
});

test('toggles download apps component visibility on download apps icon click', () => {
  render(<Sidebar />);
  fireEvent.click(screen.getByLabelText(/download apps/i));
  const downloadAppsComponent = screen.getByText(/download apps/i);
  expect(downloadAppsComponent).toBeInTheDocument();
});