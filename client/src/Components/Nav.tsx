import { Link } from "react-router-dom";
import type { UserSchema } from "../types/tableTypes";
import { useEffect, useState } from "react";

function Nav() {
  const [activeUserId, setActiveUser] = useState<number>(1);

  useEffect(() => {
    const storedUser = localStorage.getItem("activeUser");
    if (storedUser !== null) {
      const activeUser: UserSchema = JSON.parse(storedUser);
      setActiveUser(activeUser.id);
    }
  }, []);

  const profileNavLink = `/user/${activeUserId}`;
  return (
    <div className="nav">
      <ul>
        <li>
          <Link to={profileNavLink}>Profile</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/games">Games</Link>
        </li>
      </ul>
    </div>
  );
}
export default Nav;
