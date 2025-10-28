import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { createApiFetch } from "../stores/apiFetchStore";
import Timer from "../components/Timer";
import type { GameSchema } from "../types/tableTypes";
import kittenWatch from "../assets/gamePic/kitten-watch-icon.jpg";
import watchKitten from "../assets/gamePic/watch-the-kitten-icon.jpg";
import forest from "../assets/gamePic/forest-meditation-icon.jpg";
import stare from "../assets/gamePic/stare-contest-icon.jpg";
import ActiveUser from "../components/ActiveUser";

const useGetGame = createApiFetch();

function Game() {
  const { id } = useParams();

  const gameData = useGetGame((state) => state.data as GameSchema | null); //here we call the type of data
  const getError = useGetGame((state) => state.error);
  const getGame = useGetGame((state) => state.apiFetchAsync);

  useEffect(() => {
    getGame(
      "get", //fetches with get
      `game/${id}`
    ); //fetches localhost:3000/game/:id
  }, [getGame, id]); //re-renders if the fetch or id changes
  console.log(gameData);
  if (getError) {
    return <p>{getError}</p>;
  }
  if (gameData) {
    const gamePic =
      gameData.name === "Watch the Kitten"
        ? watchKitten
        : gameData.name === "Kitten Watch"
        ? kittenWatch
        : gameData.name === "Forest Meditation"
        ? forest
        : gameData.name === "The Staring Contest"
        ? stare
        : undefined;
    return (
      <div className="gameBody">
        <img src={gamePic} alt="Game picture" />
        <h2>{gameData.name}</h2>
        <Timer />
        <ActiveUser />
      </div>
    );
  }
}

export default Game;
