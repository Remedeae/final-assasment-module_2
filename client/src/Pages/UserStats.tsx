import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { createApiFetch } from "../stores/apiFetchStore";
import type { UserSchema } from "../types/tableTypes";
import defaultPic from "../assets/user.png";

const fetchUser = createApiFetch();

function UserStats() {
  const { id } = useParams();
  const user = fetchUser((state) => state.data as UserSchema | null); //here we call the type of data
  const error = fetchUser((state) => state.error);
  const getUser = fetchUser((state) => state.apiFetchAsync);

  useEffect(() => {
    getUser(
      "get", //fetches with get
      `user/${id}`
    ); //fetches localhost:3000/user/:id
  }, [getUser, id]); //re-renders if the fetch or id changes
  //console.log(user);
  if (error) {
    return <p>{error}</p>;
  }
  if (user) {
    return (
      <div className="userStats">
        <div className="userStats__info">
          <img
            src={user.profilePic ? user.profilePic : defaultPic}
            alt="Profile picture"
          />
          <h2>
            {user.firstName} {user.lastName}
          </h2>
        </div>
        <div className="userStats__timePlayed"></div>
        <div className="userStats__percentPlayed"></div>
        <div className="userStats__totalTime"></div>
        <div className="userStats__sessions"></div>
        <div className="userStats__allPlayers"></div>
      </div>
    );
  }
}

export default UserStats;
