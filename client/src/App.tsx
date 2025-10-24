import { BrowserRouter, Route, Routes } from "react-router-dom";
import Users from "./Pages/Users";
import SignUp from "./Pages/SignUp";
import UserStats from "./Pages/UserStats";
import Games from "./Pages/Games";
import Game1 from "./Pages/games/Game1";
import Game2 from "./Pages/games/Game2";
import Game3 from "./Pages/games/Game3";
import Game4 from "./Pages/games/Game4";
import Nav from "./components/Nav";
import Header from "./components/Header";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Nav />
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/users" element={<Users />} />
          <Route path="/user/:id" element={<UserStats />} />
          <Route path="/games" element={<Games />} />{" "}
          <Route path="/game1" element={<Game1 />} />
          <Route path="/game2" element={<Game2 />} />
          <Route path="/game3" element={<Game3 />} />
          <Route path="/game4" element={<Game4 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
