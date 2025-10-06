import { useState } from "react";
import { useSignupMutation } from "../auth.api";
import { toast } from "sonner";

type Props = {
  onSuccess?: () => void;
};

export default function SignupForm({ onSuccess }: Props) {
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
      toast.success("Account created! Please log in.");
      if (onSuccess) onSuccess();
    } catch (error) {
      const status = (error as { status?: number })?.status;
      let message = "Something went wrong. Please try again.";
      if (status === 409) message = "Email already in use.";
      setFormError(message);
      toast.error(message);
      console.error("Signup error:", error);
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
        autoComplete="email"
        className="border border-gray-300 rounded-lg p-2"
      />

      <input
        type="password"
        placeholder="Create a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
        className="border border-gray-300 rounded-lg p-2"
      />

      <select
        value={role}
        onChange={(e) =>
          setRole(e.target.value === "COACH" ? "COACH" : "PLAYER")
        }
        className="border border-gray-300 rounded-lg p-2"
      >
        <option value="COACH">Coach</option>
        <option value="PLAYER">Player</option>
      </select>

      {formError && <p className="text-red-500 text-sm">{formError}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition flex justify-center"
      >
        {isLoading ? <span className="animate-spin">🔄</span> : "Sign up"}
      </button>
    </form>
  );
}
