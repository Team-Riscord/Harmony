import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddFriend from "../components/AddFriend/AddFriend";
import axios from "axios";

// Mock the onClose prop
const mockOnClose = jest.fn();

// Directly use mockUserData instead of localStorage mock
const mockUserData = { username: "user123" };

// Mock axios
jest.mock("axios");

describe("AddFriend Component Tests", () => {
  beforeEach(() => {
    // Pass mockUserData as a prop to the component
    // This assumes your AddFriend component is adjusted to accept userData as a prop for testing
    render(<AddFriend onClose={mockOnClose} userData={mockUserData} />);
  });

  test("renders correctly", () => {
    expect(screen.getByText(/add friend/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You can add friends with their Harmony username./i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send friend request/i })
    ).toBeInTheDocument();
  });

  test("updates input value on change", () => {
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "friendUsername" } });
    expect(input.value).toBe("friendUsername");
  });

  test("calls addFriend on button click", async () => {
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "newFriend" } });

    axios.post.mockResolvedValue({ data: { status: "success" } });

    fireEvent.click(
      screen.getByRole("button", { name: /send friend request/i })
    );

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("displays error when trying to add oneself as a friend", () => {
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: mockUserData.username } }); // Use mockUserData.username directly

    fireEvent.click(
      screen.getByRole("button", { name: /send friend request/i })
    );

    expect(
      screen.getByText(/\* You cannot add yourself as friend/i)
    ).toBeInTheDocument();
  });
});
