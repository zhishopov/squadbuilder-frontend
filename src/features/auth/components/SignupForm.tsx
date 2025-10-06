import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "../auth.api";

type Props = {
  onSuccess?: () => void;
};

export default function SignupForm({ onSuccess }: Props) {
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"COACH" | "PLAYER">("PLAYER");
  const [formError, setFormError] = useState<string | null>(null);

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    try {
      await signup({ email, password, role }).unwrap();
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      setFormError("Signup failed. Try a different email.");
      console.error(error);
    }
  }

  return (
    <form onSubmit={submitHandler}>
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      <input
        type="password"
        placeholder="Create a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
      />

      <select
        value={role}
        onChange={(e) =>
          setRole(e.target.value === "COACH" ? "COACH" : "PLAYER")
        }
      >
        <option value="COACH">Coach</option>
        <option value="PLAYER">Player</option>
      </select>

      {formError && <p>{formError}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Signing up..." : "Sign up"}
      </button>
    </form>
  );
}
