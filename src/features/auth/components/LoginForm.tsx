import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../auth.api";
import { useState } from "react";
import { toast } from "sonner";

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
      toast.success("Logged in successfully!");
      if (onSuccess) onSuccess();
      else navigate("/dashboard", { replace: true });
    } catch (error) {
      const status = (error as { status?: number })?.status;
      if (status === 400 || status === 401) {
        setFormError("Invalid email or password.");
      } else {
        setFormError("Something went wrong. Please try again.");
      }
      toast.error(formError ?? "Login failed");
      console.error("Login error:", error);
    }
  }

  return (
    <form onSubmit={submitHandler} className="flex flex-col space-y-3">
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border border-gray-300 rounded-lg p-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border border-gray-300 rounded-lg p-2"
      />

      {formError && <p className="text-red-500 text-sm">{formError}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition flex justify-center"
      >
        {isLoading ? <span className="animate-spin">🔄</span> : "Login"}
      </button>
    </form>
  );
}
