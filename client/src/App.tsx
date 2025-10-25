import { BrowserRouter, Route, Routes } from "react-router-dom";
import Users from "./Pages/Users";
import SignUp from "./Pages/SignUp";
import UserStats from "./Pages/UserStats";
import Games from "./Pages/Games";
import Game from "./Pages/Game";
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
          <Route path="/games" element={<Games />} />
          <Route path="/game/:id" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
