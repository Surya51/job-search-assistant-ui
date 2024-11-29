import LoginOrRegister from "@/components/login-or-register"

export default function LoginForm() {
  return (
    <div className="min-height flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <LoginOrRegister isLogin={true} />
        <div className="text-center text-gray-600 text-sm mt-6">
          Don&apos;t have an account? <a href="/register" className="text-blue-500 hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  );
}
