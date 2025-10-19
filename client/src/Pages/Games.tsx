import { useNavigate } from "react-router-dom";

function Games() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Games</h1>

      <div onClick={() => navigate("/games/game1")}>
        <h2>Game1</h2>
      </div>
      <div onClick={() => navigate("/games/game2")}>
        <h2>Game2</h2>
      </div>
      <div onClick={() => navigate("/games/game3")}>
        <h2>Game3</h2>
      </div>
      <div onClick={() => navigate("/games/game4")}>
        <h2>Game4</h2>
      </div>
      <div onClick={() => navigate("/games/game5")}>
        <h2>Game5</h2>
      </div>
    </div>
  );
}

export default Games;
