import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { useUpdateFixtureMutation } from "../fixtures.api";

type EditFixtureFormProps = {
  fixtureId: number;
  initialOpponent: string;
  initialKickoffISO: string;
  initialLocation?: string | null;
  initialNotes?: string | null;
  onSaved?: () => void;
  onCancel?: () => void;
};

type UpdateFixturePayload = {
  opponent?: string;
  kickoffAt?: string;
  location?: string | null;
  notes?: string | null;
  status?: "UPCOMING" | "COMPLETED" | "CANCELLED";
};

function toLocalInputValue(isoString: string) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  const formatTwoDigits = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = formatTwoDigits(date.getMonth() + 1);
  const day = formatTwoDigits(date.getDate());
  const hour = formatTwoDigits(date.getHours());
  const minutes = formatTwoDigits(date.getMinutes());
  return `${year}-${month}-${day}T${hour}:${minutes}`;
}

function localInputToISO(localValue: string): string | null {
  if (!localValue.trim()) return null;
  const date = new Date(localValue);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export default function EditFixtureForm({
  fixtureId,
  initialOpponent,
  initialKickoffISO,
  initialLocation,
  initialNotes,
  onSaved,
  onCancel,
}: EditFixtureFormProps) {
  const currentUserRole =
    useSelector((state: RootState) => state.auth.user?.role) ?? null;

  const [updateFixture, { isLoading: isSaving }] = useUpdateFixtureMutation();

  const [opponent, setOpponent] = useState(initialOpponent);
  const [dateTimeLocal, setDateTimeLocal] = useState(
    toLocalInputValue(initialKickoffISO)
  );
  const [location, setLocation] = useState(initialLocation ?? "");
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (currentUserRole !== "COACH") return null;

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!opponent.trim()) {
      setErrorMessage("Opponent name is required.");
      return;
    }

    const payload: UpdateFixturePayload = {};

    if (opponent.trim() !== initialOpponent) {
      payload.opponent = opponent.trim();
    }

    if (dateTimeLocal.trim()) {
      const iso = localInputToISO(dateTimeLocal);
      if (!iso) {
        setErrorMessage("Please choose a valid date and time.");
        return;
      }
      if (iso !== initialKickoffISO) {
        payload.kickoffAt = iso;
      }
    }

    if (location.trim() !== (initialLocation ?? "")) {
      payload.location = location.trim() || null;
    }

    if (notes.trim() !== (initialNotes ?? "")) {
      payload.notes = notes.trim() || null;
    }

    if (Object.keys(payload).length === 0) {
      onCancel?.();
      return;
    }

    try {
      await updateFixture({ fixtureId, body: payload }).unwrap();
      onSaved?.();
    } catch (err) {
      const status = (err as { status?: number })?.status;
      if (status === 400) setErrorMessage("Please check your inputs.");
      else if (status === 403)
        setErrorMessage("Only coaches can edit fixtures.");
      else setErrorMessage("Failed to save fixture. Please try again.");
    }
  }

  return (
    <section className="mt-3 rounded-md border bg-gray-50 p-3">
      <form onSubmit={submitHandler} className="grid gap-2">
        <input
          type="text"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Opponent"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
        />

        <input
          type="datetime-local"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={dateTimeLocal}
          onChange={(e) => setDateTimeLocal(e.target.value)}
        />

        <input
          type="text"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <textarea
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Notes (optional)"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-emerald-600 px-3 py-2 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
