import { useParams } from "react-router-dom";

export default function FixtureDetails() {
  const { id } = useParams();

  return <div>Fixture Details Page {id}</div>;
}
