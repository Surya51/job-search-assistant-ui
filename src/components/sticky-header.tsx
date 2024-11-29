"use client";

import React from 'react';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { useAuth } from './auth-context';
import { useRouter } from 'next/navigation';

const StickyHeader = () => {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    const loggingOut = async () => {
      const response = await authService.logout();
      if (response) {
        logout();
        router.push('/');
      }
    }

    loggingOut(); // calling function in a function to handle async
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="banner-height container mx-auto px-16 py-2 flex justify-between items-center">
        <Link href='/' className="text-xl text-indigo-700 font-bold">Interview Assistant</Link>
        <nav className="flex space-x-4">
          <Link href="/" className="text-indigo-700 hover:text-blue-500">Home</Link>
          {isLoggedIn ? (
            <>
              <a href="/upload" className="text-indigo-700 hover:text-blue-500">Assistant</a>
              <button onClick={handleLogout} className="text-indigo-700 hover:text-blue-500">Logout</button>
            </>
          ) : (
            <>
              <a href="/login" className="text-indigo-700 hover:text-blue-500">Login</a>
              <a href="/register" className="text-indigo-700 hover:text-blue-500">Sign Up</a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default StickyHeader;