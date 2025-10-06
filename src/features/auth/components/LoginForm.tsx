import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../auth.api";
import { useState } from "react";

type Props = {
  onSuccess?: () => void;
};

export default function LoginForm({ onSuccess }: Props) {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    try {
      await login({ email, password }).unwrap();
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      setFormError("Invalid email or password");
      console.log(error);
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
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

      {formError && <p>{formError}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
