"use client";
import { useState } from "react";
import InputField from "../common/Inputfield";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

interface FormData {
  username: string;
  password: string;
  email: string;
  confirmPassword: string;
}

interface Errors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();

  const validate = () => {
    const newErrors: Errors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    const { username, email } = formData;

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const isDuplicate = existingUsers.some(
      (user: FormData) => user.username === username || user.email === email
    );

    if (isDuplicate) {
      toast.error("Username or Email already registered!");
      return;
    }

    const updatedUsers = [...existingUsers, formData];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    toast.success("Registered successfully!");
    router.push("/login");
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
        <h2>Sign up</h2>

        <InputField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p className="errorText">{errors.username}</p>}

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

        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="errorText">{errors.confirmPassword}</p>
        )}

        <button type="submit" className="button">
          Register
        </button>
        <p className="linkText">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </motion.form>
    </motion.div>
  );
};

export default RegisterPage;
