import LoginOrRegister from "@/components/login-or-register";

export default function RegisterForm() {
  return (
    <div className="min-height flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <LoginOrRegister isLogin={false} />
        <div className="text-center text-gray-600 text-sm mt-6">
          If you have an account, please <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </div>
      </div>
    </div>
  );
}