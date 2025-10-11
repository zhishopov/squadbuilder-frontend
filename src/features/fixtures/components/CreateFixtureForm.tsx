import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { useCreateFixtureMutation } from "../fixtures.api";
import { toast } from "sonner";

type CreateFixtureFormProps = {
  squadId: number;
  onCreated?: () => void;
};

export default function CreateFixtureForm({
  squadId,
  onCreated,
}: CreateFixtureFormProps) {
  const currentUserRole =
    useSelector((state: RootState) => state.auth.user?.role) ?? null;

  const [createFixture, { isLoading }] = useCreateFixtureMutation();

  const [opponent, setOpponent] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (currentUserRole !== "COACH") return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!opponent.trim()) {
      setErrorMessage("Opponent name is required.");
      return;
    }
    if (!date.trim()) {
      setErrorMessage("Please select a date and time.");
      return;
    }

    try {
      await createFixture({
        squadId,
        opponent: opponent.trim(),
        date,
        location: location.trim() || undefined,
      }).unwrap();

      toast.success("Fixture created successfully!");
      setOpponent("");
      setDate("");
      setLocation("");
      onCreated?.();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create fixture");
      setErrorMessage("Failed to create fixture. Please try again.");
    }
  }

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Create Fixture</h2>

      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          type="text"
          placeholder="Opponent name"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
        />

        <input
          type="datetime-local"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location (optional)"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-emerald-600 px-3 py-2 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
        >
          {isLoading ? "Creating…" : "Create Fixture"}
        </button>
      </form>
    </section>
  );
}
