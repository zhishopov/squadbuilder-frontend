import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/auth/auth.api";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { api } from "../utils/api";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function logoutHandler() {
    setErrorMessage(null);
    try {
      await logout().unwrap();
      dispatch(api.util.resetApiState());
      console.log("Logout successful");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      setErrorMessage("Failed to logout. Please try again.");
    }
  }

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="font-semibold text-emerald-700">
          SquadBuilder
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-sm hover:underline">
            Dashboard
          </Link>
          <Link to="/squad" className="text-sm hover:underline">
            Squad
          </Link>
          <Link to="/fixtures" className="text-sm hover:underline">
            Fixtures
          </Link>
          <Link to="/settings" className="text-sm hover:underline">
            Profile
          </Link>

          <button
            onClick={logoutHandler}
            disabled={isLoading}
            className="ml-2 rounded-md bg-emerald-600 px-3 py-1.5 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-2">
          {errorMessage}
        </div>
      )}
    </header>
  );
}
