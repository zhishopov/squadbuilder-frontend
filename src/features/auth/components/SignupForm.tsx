import { useState } from "react";
import { useSignupMutation } from "../auth.api";
import { toast } from "sonner";
import { getErrorMessage, showErrorToast } from "../../../utils/error";

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
      const message = getErrorMessage(error);
      setFormError(message);
      showErrorToast(error);
      console.error("Signup error:", error);
    }
  }

  return (
    <form onSubmit={submitHandler} className="flex flex-col space-y-3">
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        autoComplete="email"
        className="
          w-full rounded-xl border border-gray-300 bg-white/90
          px-3 py-2.5 text-sm
          placeholder:text-gray-400
          shadow-sm
          hover:border-emerald-300
          focus:outline-none
          focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500
          focus:shadow-lg focus:shadow-emerald-200/70
          focus:-translate-y-0.5
          transition-all duration-300
        "
      />

      <input
        type="password"
        placeholder="Create a password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        autoComplete="new-password"
        className="
          w-full rounded-xl border border-gray-300 bg-white/90
          px-3 py-2.5 text-sm
          placeholder:text-gray-400
          shadow-sm
          hover:border-emerald-300
          focus:outline-none
          focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500
          focus:shadow-lg focus:shadow-emerald-200/70
          focus:-translate-y-0.5
          transition-all duration-300
        "
      />

      <select
        value={role}
        onChange={(event) =>
          setRole(event.target.value === "COACH" ? "COACH" : "PLAYER")
        }
        className="
          w-full rounded-xl border border-gray-300 bg-white/90
          px-3 py-2.5 text-sm
          shadow-sm
          hover:border-emerald-300
          focus:outline-none
          focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500
          focus:shadow-lg focus:shadow-emerald-200/70
          focus:-translate-y-0.5
          transition-all duration-300
        "
      >
        <option value="COACH">Coach</option>
        <option value="PLAYER">Player</option>
      </select>

      {formError && <p className="text-red-500 text-sm">{formError}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="
          bg-emerald-600 hover:bg-emerald-700
          disabled:opacity-70
          text-white font-semibold py-2.5 rounded-xl
          shadow-md shadow-emerald-100
          flex justify-center
          transition-all duration-300
          hover:shadow-emerald-200 hover:-translate-y-0.5
        "
      >
        {isLoading ? <span className="animate-spin">🔄</span> : "Sign up"}
      </button>
    </form>
  );
}
