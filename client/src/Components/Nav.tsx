import { Link } from "react-router-dom";

function Nav() {
  const placeholderUserId = 3; //Grab from local storage
  const profileNavLink = `/user/${placeholderUserId}`;
  return (
    <div>
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
