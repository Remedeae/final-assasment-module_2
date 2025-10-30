import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Users from "./Pages/Users";
import SignUp from "./Pages/SignUp";
import UserStats from "./Pages/UserStats";
import Games from "./Pages/Games";
import Game from "./Pages/Game";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<SignUp />} />
            <Route path="/users" element={<Users />} />
            <Route path="/user/:id" element={<UserStats />} />
            <Route path="/games" element={<Games />} />
            <Route path="/game/:id" element={<Game />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
