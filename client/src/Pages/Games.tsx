import { useNavigate } from "react-router-dom";

function Games() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Games</h1>

      <div onClick={() => navigate("/game/1")}>
        <h2>Game1</h2>
      </div>
      <div onClick={() => navigate("/game/2")}>
        <h2>Game2</h2>
      </div>
      <div onClick={() => navigate("/game/3")}>
        <h2>Game3</h2>
      </div>
      <div onClick={() => navigate("/game/4")}>
        <h2>Game4</h2>
      </div>
    </div>
  );
}

export default Games;
