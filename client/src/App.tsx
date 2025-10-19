import { BrowserRouter, Route, Routes } from "react-router-dom";
import Users from "./Pages/Users";
import SignUp from "./Pages/SignUp";
import Statistics from "./Pages/Statistics";
import User from "./Pages/User";
import Games from "./Pages/Games";
import Game1 from "./Pages/Games/Game1";
import Game2 from "./Pages/Games/Game2";
import Game3 from "./Pages/Games/Game3";
import Game4 from "./Pages/Games/Game4";
import Game5 from "./Pages/Games/Game5";
import Nav from "./Nav";

function App() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/users" element={<Users />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/games" element={<Games />}>
            {" "}
            {/* Could be used to route go games/:id where the id is the game id */}
            <Route path="game1" element={<Game1 />} />
            <Route path="game2" element={<Game2 />} />
            <Route path="game3" element={<Game3 />} />
            <Route path="game4" element={<Game4 />} />
            <Route path="game5" element={<Game5 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
