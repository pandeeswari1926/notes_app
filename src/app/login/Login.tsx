"use client";
import { useState } from "react";
import InputField from "../common/Inputfield";
import Link from "next/link";

interface FormData {
  email: string;
  password: string;
  username: string;
}

interface Errors {
  email?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    username: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const validate = () => {
    const newErrors: Errors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    // returns true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const storedUsers = localStorage.getItem("users");

    if (storedUsers) {
      const users = JSON.parse(storedUsers) as FormData[];

      const matchedUser = users.find(
        (user) =>
          user.email === formData.email && user.password === formData.password
      );

      if (matchedUser) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", matchedUser.username);
        alert("Login successful!");
        window.location.href = "/notes";
      } else {
        alert("Invalid credentials");
      }
    } else {
      alert("No user found. Please register.");
    }
  };

  return (
    <div className="pageWrapper">
      <form onSubmit={handleSubmit} className="container">
        <h2>Login</h2>

        <InputField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="errorText">{errors.email}</p>}

        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="errorText">{errors.password}</p>}

        <button type="submit" className="button">
          Login
        </button>

        <p className="linkText">
          Don&apos;t have an account?{" "}
          <Link href="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
