"use client";

import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const redirectPage = () => {
    router.push(isLoggedIn ? '/upload' : '/login');
  }

  return (
    <div className="flex items-center justify-center min-height bg-gray-100">
      <div className="text-center px-4 sm:px-8 md:px-16">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
          Welcome to Interview Assistant
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-600">
          Explore the Interview Assistant by uploading your resume and job description.
        </p>
        <button onClick={redirectPage} className="px-6 py-2 mt-6 text-white bg-blue-500 rounded-md hover:bg-blue-600">
          Get Started
        </button>
      </div>
    </div>
  );
}
