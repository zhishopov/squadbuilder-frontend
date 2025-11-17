import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/auth/auth.api";
import { useDispatch } from "react-redux";
import { api } from "../utils/api";

const navigationLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Squad", to: "/squad" },
  { label: "Fixtures", to: "/fixtures" },
  { label: "Profile", to: "/settings" },
];

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function logoutHandler() {
    setErrorMessage(null);
    try {
      await logout().unwrap();
      dispatch(api.util.resetApiState());
      setIsMobileMenuOpen(false);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      setErrorMessage("Failed to logout. Please try again.");
    }
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen((previous) => !previous);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm shadow-xl shadow-emerald-100">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          to="/dashboard"
          onClick={closeMobileMenu}
          className="flex items-center gap-2"
        >
          <span className="text-lg font-bold tracking-tight text-slate-900">
            <span className="text-emerald-600">Squad</span>
            <span>Builder</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          {navigationLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="
        rounded-full px-4 py-1.5 text-sm font-medium text-slate-700
        bg-white/60 backdrop-blur-sm
        border border-emerald-200
        shadow-sm 
        transition-all duration-300
        hover:bg-white hover:border-emerald-400 hover:shadow-md
        hover:text-emerald-700 hover:-translate-y-0.5
      "
            >
              {item.label}
            </Link>
          ))}

          <button
            onClick={logoutHandler}
            disabled={isLoading}
            className="
      ml-2 rounded-full px-4 py-1.5 text-sm font-semibold text-white
      bg-emerald-600 shadow-sm
      transition-all duration-300
      hover:bg-emerald-700 hover:shadow-md hover:-translate-y-0.5
      disabled:opacity-60
    "
          >
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </nav>

        <button
          onClick={toggleMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-100 bg-white text-slate-800 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md md:hidden"
          aria-label="Toggle menu"
        >
          <span className="relative flex h-4 w-4 flex-col justify-between">
            <span
              className={`h-[2px] w-full rounded-full bg-slate-800 transition-transform duration-200 ${
                isMobileMenuOpen ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[2px] w-full rounded-full bg-slate-800 transition-opacity duration-200 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-[2px] w-full rounded-full bg-slate-800 transition-transform duration-200 ${
                isMobileMenuOpen ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-emerald-100 bg-white/90 backdrop-blur-sm md:hidden">
          <nav className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3">
            {navigationLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeMobileMenu}
                className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {item.label}
              </Link>
            ))}

            <button
              onClick={logoutHandler}
              disabled={isLoading}
              className="mt-2 rounded-full bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md disabled:opacity-60"
            >
              {isLoading ? "Logging out..." : "Logout"}
            </button>
          </nav>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 px-4 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
    </header>
  );
}
