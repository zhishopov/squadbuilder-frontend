import { useNavigate } from "react-router-dom";
import AuthCard from "../features/auth/components/AuthCard";
import { useAuth } from "../features/auth/useAuth";
import { useEffect } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screem flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-indigo-100 p-4">
      <div className="flex-1 text-center md:text-left md:pr-8 space-y-4 max-w-md">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-700">
          SquadBuilder
        </h1>
        <p className="text-gray-700 text-lg">
          Organize your football squad, manage fixtures, and track player
          availability — all in one place.
        </p>
        <ul className="list-disc list-inside text-gray-600">
          <li>Plan lineups with ease</li>
          <li>Track availability instantly</li>
          <li>Empower your team with clarity</li>
        </ul>
      </div>

      <div className="flex-1 max-w-md w-full mt-8 md:mt-0">
        <AuthCard></AuthCard>
      </div>
    </div>
  );
}
