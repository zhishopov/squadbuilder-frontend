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
          className="font-semibold text-emerald-700 hover:text-emerald-900 relative
                     transition-all duration-300
                     before:absolute before:inset-0 before:rounded-lg
                     before:bg-gradient-to-r before:from-emerald-400/40 before:to-indigo-400/40
                     before:opacity-0 before:blur-md before:transition-all before:duration-300
                     hover:before:opacity-100 hover:before:blur-lg"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Sign up" : "Login"}
        </button>
      </p>
    </div>
  );
}
