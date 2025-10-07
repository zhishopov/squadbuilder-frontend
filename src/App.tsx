import { RouterProvider } from "react-router-dom";
import "./styles.css";
import { router } from "./router";
import AppBootstrap from "./AppBootstrap";

function App() {
  return (
    <AppBootstrap>
      <RouterProvider router={router} />
    </AppBootstrap>
  );
}

export default App;
