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
    <div>
      <div>
        <h1>SquadBuilder</h1>
        <p>
          Organize your football squad, manage fixtures, and track player
          availability — all in one place.
        </p>
        <ul>
          <li>Plan lineups with ease</li>
          <li>Track availability instantly</li>
          <li>Empower your team with clarity</li>
        </ul>
      </div>

      <div>
        <AuthCard></AuthCard>
      </div>
    </div>
  );
}
