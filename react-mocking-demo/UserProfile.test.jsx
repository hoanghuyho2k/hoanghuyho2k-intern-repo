import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfile from "./UserProfile";
import { fetchUser } from "./api";

jest.mock("./api", () => ({
  fetchUser: jest.fn(),
}));

test("renders user name after successful API call", async () => {
  fetchUser.mockResolvedValue({ name: "Huy Ho" });

  render(<UserProfile />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  const userName = await screen.findByText("Huy Ho");
  expect(userName).toBeInTheDocument();
});

test("renders error message when API call fails", async () => {
  fetchUser.mockRejectedValue(new Error("API error"));

  render(<UserProfile />);

  const errorMessage = await screen.findByText("Could not load user");
  expect(errorMessage).toBeInTheDocument();
});