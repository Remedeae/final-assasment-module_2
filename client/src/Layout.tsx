import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Nav from "./components/Nav";

function Layout() {
  return (
    <div className="container">
      <Header />
      <div className="bottom-section">
        <Nav />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
