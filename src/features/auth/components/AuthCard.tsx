import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useSignupMutation } from "../auth.api";

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"COACH" | "PLAYER">("PLAYER");

  const navigate = useNavigate();

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({ email, password }).unwrap();
        navigate("/dashboard");
      } else {
        await signup({ email, password, role }).unwrap();
        setIsLogin(true);
      }
    } catch (error) {
      console.log("Authentication failed:", error);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-emerald-600 mb-4">
        {isLogin ? "Welcome back!" : "Create an account"}
      </h2>

      <form onSubmit={submitHandler} className="flex flex-col space-y-4">
        <input
          className="border border-gray-300 rounded-lg p-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          className="border border-gray-300 rounded-lg p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        {!isLogin && (
          <select
            className="border border-gray-300 rounded-lg p-2"
            value={role}
            onChange={(e) => setRole(e.target.value as "COACH" | "PLAYER")}
          >
            <option value="COACH">Coach</option>
            <option value="PLAYER">Player</option>
          </select>
        )}

        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition"
          type="submit"
          disabled={isLoggingIn || isSigningUp}
        >
          {isLogin
            ? isLoggingIn
              ? "Logging in..."
              : "Login"
            : isSigningUp
            ? "Signing up..."
            : "Sign up"}
        </button>
      </form>

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
