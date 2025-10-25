import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useApiFetch } from "../stores/apiFetchStore";
import Timer from "../components/Timer";
import type { GameSchema } from "../types/tableTypes";
import kittenWatch from "../assets/gamePic/kitten-watch-icon.jpg";
import watchKitten from "../assets/gamePic/watch-the-kitten-icon.jpg";
import forest from "../assets/gamePic/forest-meditation-icon.jpg";
import stare from "../assets/gamePic/stare-contest-icon.jpg";

function Game() {
  const { id } = useParams();
  const game = useApiFetch((state) => state.data as GameSchema | null); //here we call the type of data
  const error = useApiFetch((state) => state.error);
  const fetchGame = useApiFetch((state) => state.apiFetchAsync);

  useEffect(() => {
    fetchGame(
      "get", //fetches with get
      `game/${id}`
    ); //fetches localhost:3000/game/:id
  }, [fetchGame, id]); //re-renders if the fetch or id changes
  console.log(game);
  if (error) {
    return <p>{error}</p>;
  }
  if (game) {
    const gamePic =
      game.name === "Watch the Kitten"
        ? watchKitten
        : game.name === "Kitten Watch"
        ? kittenWatch
        : game.name === "Forest Meditation"
        ? forest
        : game.name === "The Staring Contest"
        ? stare
        : undefined;
    return (
      <div className="gameBody">
        <img src={gamePic} alt="Game picture" />
        <h2>{game.name}</h2>
        <Timer />
      </div>
    );
  }
}

export default Game;
