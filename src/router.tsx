import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CoachRoute from "./components/CoachRoute";
import Dashboard from "./pages/Dashboard";
import Squad from "./pages/Squad";
import Fixtures from "./pages/Fixtures";
import FixtureDetails from "./pages/FixtureDetails";
import Lineup from "./pages/Lineup";
import ProfileSettings from "./pages/ProfileSettings";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/squad", element: <Squad /> },
      { path: "/fixtures", element: <Fixtures /> },
      { path: "/fixtures/:id", element: <FixtureDetails /> },
      {
        path: "/lineup/:fixtureId",
        element: (
          <CoachRoute>
            <Lineup />
          </CoachRoute>
        ),
      },
      { path: "/settings", element: <ProfileSettings /> },
    ],
  },
]);
