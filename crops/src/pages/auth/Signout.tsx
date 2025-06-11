// src/pages/auth/Signout.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear token and other session data
    localStorage.removeItem("token");
    // Optional: remove user data, preferences, etc.
    // localStorage.clear();

    // Redirect to login
    navigate("/login");
  }, [navigate]);

  return null; // No UI needed
};

export default Signout;