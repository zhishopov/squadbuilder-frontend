import { useLoginMutation } from "../auth.api";
import { useState } from "react";

type Props = {
  onSuccess: () => void;
};

export default function LoginForm({ onSuccess }: Props) {
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    try {
      await login({ email, password }).unwrap();
      onSuccess();
    } catch (error) {
      console.error("Login failed:", error);
      setFormError("Invalid email or password");
    }
  }

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col space-y-4"
      autoComplete="on"
    >
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        className="border border-gray-300 rounded-lg p-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        className="border border-gray-300 rounded-lg p-2"
      />

      {formError && (
        <p className="text-red-600 text-sm text-center">{formError}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
