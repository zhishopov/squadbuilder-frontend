import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-emerald-600 mb-4">
        {isLogin ? "Welcome back!" : "Create an account"}
      </h2>

      {isLogin ? (
        <LoginForm />
      ) : (
        <SignupForm onSuccess={() => setIsLogin(true)} />
      )}

      <p className="text-sm text-center mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          className="text-emerald-600 hover:underline font-semibold"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Sign up" : "Login"}
        </button>
      </p>
    </div>
  );
}
