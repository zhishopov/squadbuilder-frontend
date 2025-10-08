import Header from "../components/Header";
import MembersCard from "../features/dashboard/components/MembersCard";
import SquadCard from "../features/dashboard/components/SquadCard";

export default function Dashboard() {
  return (
    <>
      <Header></Header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <SquadCard></SquadCard>
        <MembersCard></MembersCard>
      </main>
    </>
  );
}
