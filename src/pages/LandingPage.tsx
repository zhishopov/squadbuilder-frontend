import AuthCard from "../features/auth/components/AuthCard";

export default function LandingPage() {
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">SquadBuilder</h1>
        <p className="text-gray-600">
          Plan fixtures, lineups, and availability.
        </p>
      </div>
      <AuthCard></AuthCard>
    </main>
  );
}
