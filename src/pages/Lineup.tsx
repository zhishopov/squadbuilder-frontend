import { useParams } from "react-router-dom";

export default function Lineup() {
  const { fixtureId } = useParams();

  return <div>Lineup Page {fixtureId}</div>;
}
