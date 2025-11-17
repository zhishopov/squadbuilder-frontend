import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full max-w-lg p-10 bg-white rounded-3xl shadow-xl shadow-emerald-100">
      <h2 className="text-3xl font-bold text-center text-emerald-600 mb-6">
        {isLogin ? "Welcome back!" : "Create an account"}
      </h2>

      {isLogin ? (
        <LoginForm />
      ) : (
        <SignupForm onSuccess={() => setIsLogin(true)} />
      )}

      <p className="text-sm text-center mt-6">
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
