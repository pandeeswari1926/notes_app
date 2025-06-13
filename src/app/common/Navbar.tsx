"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log(
      "localStorage.getItem(loggedIn)",
      localStorage.getItem("loggedIn")
    );
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    console.log("loggedIn", loggedIn);
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setIsLoggedIn(false);
    // Optional: redirect to home or login
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="left">MyApp</div>
      <div className="right">
        <Link href="/about">About</Link>
        <Link href="/notes">Notes</Link>
        <Link href="/account">Account</Link>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="Navbutton">
            Logout
          </button>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
