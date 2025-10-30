import { useNavigate } from "react-router-dom";

function Games() {
  const navigate = useNavigate();
  return (
    <div className="games">
      <h1>Games</h1>
      <div>
        <div onClick={() => navigate("/game/1")}>
          <h2>Watch the Kitten!</h2>
          <p>
            Look out! The kitten is up to some thing mischievous, better keep an
            eye on it.
          </p>
        </div>
        <div onClick={() => navigate("/game/2")}>
          <h2>Kitten Watch</h2>
          <p>
            In Soviet Russia, kitten watches <strong>you</strong>!
          </p>
        </div>
        <div onClick={() => navigate("/game/3")}>
          <h2>Forest Meditation</h2>
          <p>Take a nice break and rest your eyes on a tranquil forest.</p>
        </div>
        <div onClick={() => navigate("/game/4")}>
          <h2>The Staring Contest</h2>
          <p>The cat challenges you! If you blink you loose.</p>
        </div>
      </div>
    </div>
  );
}

export default Games;
