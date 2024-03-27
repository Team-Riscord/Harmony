import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import FriendRequests from "../components/FriendRequests/FriendRequests";
import axios from "axios";

// Mock the onClose prop
const mockOnClose = jest.fn();

// Mock axios
jest.mock("axios");

describe("FriendRequests Component Tests", () => {
  beforeEach(() => {
    // Mock the axios.get response for fetching friend requests
    axios.get.mockResolvedValue({
      data: [
        {
          id: "1",
          senderId: "2",
          receiverId: "3",
          status: "PENDING",
          senderUsername: "friendUser1",
        },
        {
          id: "2",
          senderId: "3",
          receiverId: "2",
          status: "PENDING",
          senderUsername: "friendUser2",
        },
      ],
    });

    // Render the FriendRequests component before each test
    render(<FriendRequests onClose={mockOnClose} />);
  });

  test("fetches and displays friend requests", async () => {
    // Check if friend requests are fetched and displayed
    await waitFor(() => {
      expect(screen.getByText(/friendUser1/i)).toBeInTheDocument();
      expect(screen.getByText(/friendUser2/i)).toBeInTheDocument();
    });
  });

  test("accepts a friend request", async () => {
    // Mock the axios.post response for accepting a friend request
    axios.post.mockResolvedValueOnce({
      data: { success: true, message: "Friend request accepted" },
    });

    // Simulate accepting the first friend request
    const acceptButtons = screen.getAllByText(/✓/); // Assuming you use ✓ as the accept icon text
    fireEvent.click(acceptButtons[0]);

    // Assert onClose was called to refresh or handle post-acceptance logic
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("declines a friend request", async () => {
    // Mock the axios.post response for declining a friend request
    axios.post.mockResolvedValueOnce({
      data: { success: true, message: "Friend request declined" },
    });

    // Simulate declining the first friend request
    const declineButtons = screen.getAllByText(/✕/); // Assuming you use ✕ as the decline icon text
    fireEvent.click(declineButtons[0]);

    // Assert onClose was called or handle post-decline logic
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
