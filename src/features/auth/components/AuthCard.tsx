import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useSignupMutation } from "../auth.api";

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"coach" | "player">("player");

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
    <div>
      <h2>{isLogin ? "Welcome back!" : "Create an account"}</h2>

      <form onSubmit={submitHandler}>
        <input
          type="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        {isLogin && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "coach" | "player")}
          >
            <option value="coach">Coach</option>
            <option value="player">Player</option>
          </select>
        )}

        <button type="submit" disabled={isLoggingIn || isSigningUp}>
          {isLogin
            ? isLoggingIn
              ? "Logging in..."
              : "Login"
            : isSigningUp
            ? "Signing up..."
            : "Sign up"}
        </button>
      </form>

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign up" : "Login"}
        </button>
      </p>
    </div>
  );
}
