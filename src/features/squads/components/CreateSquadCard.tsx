import { useState } from "react";
import { useCreateSquadMutation } from "../squads.api";
import { toast } from "sonner";

export default function CreateSquadCard() {
  const [squadName, setSquadName] = useState("");
  const [createSquad, { isLoading }] = useCreateSquadMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!squadName.trim()) {
      setErrorMessage("Please enter a squad name.");
      return;
    }

    try {
      const createdSquad = await createSquad({ name: squadName }).unwrap();
      toast.success(`Squad "${createdSquad.name}" created successfully!`);
      setSquadName("");
    } catch (error) {
      console.error("Create squad error:", error);
      setErrorMessage("Failed to create squad. Please try again.");
      toast.error("Failed to create squad");
    }
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-2 text-emerald-700">
        Create Your Squad
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        You don't have a squad yet. Create one to start managing players and
        fixtures.
      </p>

      <form onSubmit={submitHandler} className="space-y-3">
        <input
          type="text"
          placeholder="Enter squad name"
          value={squadName}
          onChange={(e) => setSquadName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {isLoading ? "Creating..." : "Create Squad"}
        </button>
      </form>
    </section>
  );
}
