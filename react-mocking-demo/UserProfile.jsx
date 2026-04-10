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