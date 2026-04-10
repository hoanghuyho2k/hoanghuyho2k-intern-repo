export async function fetchUser() {
  const response = await fetch("https://example.com/api/user");

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}