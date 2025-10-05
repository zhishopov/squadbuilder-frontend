import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Squad from "./pages/Squad";
import Fixtures from "./pages/Fixtures";
import FixtureDetails from "./pages/FixtureDetails";
import Lineup from "./pages/Lineup";
import ProfileSettings from "./pages/ProfileSettings";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage></LandingPage> },
  {
    element: <ProtectedRoute></ProtectedRoute>,
    children: [
      { path: "/dashboard", element: <Dashboard></Dashboard> },
      { path: "/squad", element: <Squad></Squad> },
      { path: "/fixtures", element: <Fixtures></Fixtures> },
      { path: "/fixtures/:id", element: <FixtureDetails></FixtureDetails> },
      { path: "/lineup/:fixtureId", element: <Lineup></Lineup> },
      { path: "/settings", element: <ProfileSettings></ProfileSettings> },
    ],
  },
]);
