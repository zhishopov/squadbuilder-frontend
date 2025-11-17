import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="
        w-full max-w-lg
        rounded-3xl bg-white p-10
        shadow-xl shadow-emerald-100
        transition-transform transition-shadow duration-300
        hover:-translate-y-1 hover:shadow-emerald-200
      "
    >
      <h2 className="mb-6 text-center text-3xl font-bold text-emerald-600">
        {isLogin ? "Welcome back!" : "Create an account"}
      </h2>

      {isLogin ? (
        <LoginForm />
      ) : (
        <SignupForm onSuccess={() => setIsLogin(true)} />
      )}

      <p className="mt-6 text-center text-sm">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          className="
            relative font-semibold text-emerald-700
            transition-all duration-300
            hover:text-emerald-900
            before:absolute before:inset-0 before:rounded-lg
            before:bg-gradient-to-r before:from-emerald-400/40 before:to-indigo-400/40
            before:opacity-0 before:blur-md
            before:transition-all before:duration-300
            hover:before:opacity-100 hover:before:blur-lg
          "
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Sign up" : "Login"}
        </button>
      </p>
    </div>
  );
}
