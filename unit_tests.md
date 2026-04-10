
# Mocking API Calls in Jest

## Why is it important to mock API calls in tests?

Mocking API calls is important because it allows tests to run quickly and reliably without depending on real network requests or external services. It also makes it easier to test success and failure scenarios in a controlled way.

## What are some common pitfalls when testing asynchronous code?

Common pitfalls include forgetting to use `await`, checking the UI before async updates finish, and not mocking promises correctly. These mistakes can cause flaky tests or false failures.

## Practical Evidence

For this task, I created a React component that fetches user data from an API and displays the result.

### Files created

react-mocking-demo/api.js

```typescript
export async function fetchUser() {
  const response = await fetch("https://example.com/api/user");

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}
```

react-mocking-demo/UserProfile.jsx

```typescript
import React, { useEffect, useState } from "react";
import { fetchUser } from "./api";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchUser();
        setUser(data);
      } catch (err) {
        setError("Could not load user");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return <h1>{user.name}</h1>;
}
```

react-mocking-demo/UserProfile.test.jsx

```typescript
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
```

### API mocking approach
I used `jest.mock("./api")` to replace the real API module and mocked the `fetchUser` function with:
- `fetchUser.mockResolvedValue(...)` for a successful response
- `fetchUser.mockRejectedValue(...)` for an error response

### Example test run
```bash
npm test
```

Output:

```bash
> react-mocking-demo@1.0.0 test
> jest

 PASS  ./UserProfile.test.jsx
  ✓ renders user name after successful API call (20 ms)
  ✓ renders error message when API call fails (5 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.659 s
Ran all test suites.
```

## Reflection

Why is it important to mock API calls in tests?

Mocking API calls is important because it allows tests to run quickly and reliably without depending on real network requests or external services. It ensures consistent test results and makes it possible to simulate different scenarios, such as successful responses and failures, in a controlled environment. This improves test stability and helps isolate the component’s logic from external dependencies.

What are some common pitfalls when testing asynchronous code?

Common pitfalls include forgetting to use await or async utilities, which can cause tests to pass or fail incorrectly. Another issue is checking results before the asynchronous operation has completed, leading to flaky tests. Developers may also forget to properly mock promises, or not handle rejected promises, which can cause unhandled errors. Using the wrong testing methods (e.g., getByText instead of findByText) can also lead to incorrect assertions when testing asynchronous UI updates.
