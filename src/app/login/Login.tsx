"use client";
import { useState } from "react";
import InputField from "../common/Inputfield";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

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
        window.location.href = "/notes";
        toast.success("Login Successful!");
      } else {
        toast.error("Invalid credentials");
      }
    } else {
      alert("No user found. Please register.");
    }
  };

  return (
    <motion.div
      className="pageWrapper"
      initial={{ opacity: 0, y: -50 }} // Start hidden & above
      animate={{ opacity: 1, y: 0 }} // Animate to visible & in place
      transition={{ duration: 0.5, ease: "easeOut" }} // Duration 0.5 sec
    >
      <motion.form
        onSubmit={handleSubmit}
        className="container"
        initial={{ scale: 0.9, opacity: 0 }} // Form starts small & hidden
        animate={{ scale: 1, opacity: 1 }} // Form grows & fades in
        transition={{ delay: 0.3, duration: 0.5 }} // Slight delay for form
      >
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

        <motion.button
          type="submit"
          className="button"
          whileHover={{ scale: 1.05 }} // Button scales on hover
          whileTap={{ scale: 0.95 }} // Button shrinks slightly when clicked
        >
          Login
        </motion.button>

        <p className="linkText">
          Don&apos;t have an account?{" "}
          <Link href="/register">Register here</Link>
        </p>
      </motion.form>
    </motion.div>
  );
};

export default LoginPage;
