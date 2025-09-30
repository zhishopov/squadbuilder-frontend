import { useEffect } from "react";
import "./styles.css";

function App() {
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://squadbuilder.online/health", {
        credentials: "include",
      });
      const result = await response.json();
      console.log(result);
    };
    fetchData();
  }, []);

  return (
    <>
      <h1 className="text-red-500">Hello</h1>
      <img src="logo2.webp" alt="" />
    </>
  );
}

export default App;
