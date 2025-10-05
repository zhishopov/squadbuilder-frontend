import { RouterProvider } from "react-router-dom";
import "./styles.css";
import { router } from "./router";

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
