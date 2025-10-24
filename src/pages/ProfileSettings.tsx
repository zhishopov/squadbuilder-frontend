import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/auth/auth.api";
import { clearUser } from "../features/auth/auth.slice";
import type { RootState } from "../store";
import { api } from "../utils/api";
import Header from "../components/Header";

export default function ProfileSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  async function handleLogout() {
    try {
      await logout().unwrap();
    } catch (error) {
      console.log(error);
    }
    dispatch(clearUser());
    dispatch(api.util.resetApiState());
    navigate("/");
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Profile</h1>

        <section className="rounded-xl border bg-white p-4 space-y-3">
          <h2 className="text-lg font-medium">Account</h2>
          <label className="block text-sm">
            <span className="text-gray-600">Email</span>
            <input
              value={currentUser?.email ?? ""}
              readOnly
              className="mt-1 w-full rounded border px-3 py-2 text-sm bg-gray-50"
            />
          </label>
        </section>

        <section className="rounded-xl border bg-white p-4 space-y-3">
          <h2 className="text-lg font-medium">Change Password</h2>
          <input
            type="password"
            placeholder="Current password"
            disabled
            className="w-full rounded border px-3 py-2 text-sm bg-gray-50"
          />
          <input
            type="password"
            placeholder="New password"
            disabled
            className="w-full rounded border px-3 py-2 text-sm bg-gray-50"
          />
          <button
            disabled
            className="rounded-md bg-gray-300 px-3 py-2 text-sm text-gray-700"
          >
            Coming soon
          </button>
        </section>

        <section className="rounded-xl border bg-white p-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-md bg-red-600 px-3 py-2 text-white text-sm disabled:opacity-60"
          >
            {isLoggingOut ? "Logging out…" : "Logout"}
          </button>
        </section>
      </main>
    </>
  );
}
