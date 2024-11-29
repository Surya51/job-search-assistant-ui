"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/domain/entities";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

const LoginOrRegister = ({ isLogin }: { isLogin: boolean }) => {
  const title = isLogin ? 'Login' : 'Sign Up';

  const { isLoggedIn, login } = useAuth();

  const [userData, setUserData] = useState<User>({
    name: '',
    username: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<User>({
    name: '',
    username: '',
    password: ''
  });
  const [errorMsg, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/upload');
    }
  }, [isLoggedIn, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors: User = {};

    if (!isLogin) {
      if (!userData.name) {
        errors.name = "Name is required.";
      }
    }

    if (!userData.username) {
      errors.username = "Email is required.";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userData.username)) {
      errors.username = "Invalid email address.";
    }

    // Password validation
    if (!userData.password) {
      errors.password = "Password is required.";
    } else if (!isLogin && userData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFormErrors(errors);
    return !errors.name && !errors.username && !errors.password;
  };

  const loginOrRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const response = await authService.loginOrRegister(isLogin, userData);

    if (response.success) {
      if (isLogin) {
        login();
      } else {
        router.push('/login');
      }
    }
    else {
      setErrorMessage(response.error);
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">{title}</h2>
      <form onSubmit={loginOrRegister}>
        {!isLogin &&
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Name*
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              onChange={handleChange}
            />
            {formErrors.name && <p className="absolute text-xs text-red-500">{formErrors.name}</p>}
          </div>
        }
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 font-medium mb-2"
          >
            Email*
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
            onChange={handleChange}
          />
          {formErrors.username && <p className="absolute text-xs text-red-500">{formErrors.username}</p>}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2"
          >
            Password*
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
            onChange={handleChange}
          />
          {formErrors.password && <p className="absolute text-xs text-red-500">{formErrors.password}</p>}
        </div>
        <button
          type="submit"
          className="w-full mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          {title}
        </button>
        {errorMsg && <div className="mt-1 -mb-6 text-center text-sm text-red-500">{errorMsg}</div>}
      </form>
    </>
  );
}

export default LoginOrRegister;