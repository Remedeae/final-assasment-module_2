import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { createApiFetch } from "../stores/apiFetchStore";
import type { UserSchema } from "../types/tableTypes";
import defaultPic from "../assets/user.png";
import UserAllGames from "../components/graphs/UserGraphs/AllGames";
import UserPercentTime from "../components/graphs/UserGraphs/PercentTime";
import AllUsersAllGames from "../components/graphs/AllUsersGraphs/AllUserGames";
import LeaderBoard from "../components/graphs/AllUsersGraphs/LeaderBoard";
import AllUserSessionData from "../components/graphs/AllUsersGraphs/SessionData";

const useFetchUser = createApiFetch();
const useFetchTimePlayed = createApiFetch();

function UserStats() {
  const { id } = useParams();

  const user = useFetchUser((state) => state.data as UserSchema | null); //here we call the type of data
  const userError = useFetchUser((state) => state.error);
  const getUser = useFetchUser((state) => state.apiFetchAsync);

  const time = useFetchTimePlayed((state) => state.data as number);
  const timeError = useFetchTimePlayed((state) => state.error);
  const getTimePlayed = useFetchTimePlayed((state) => state.apiFetchAsync);

  useEffect(() => {
    getUser("get", `user/${id}`);
    getTimePlayed("get", `user/${id}/totalTime`);
  }, [getUser, getTimePlayed, id]);
  //console.log(time);

  if (userError) {
    return <p>{userError}</p>;
  }
  if (timeError) {
    return <p>{timeError}</p>;
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
        <UserAllGames playerName={user.firstName} />
        <UserPercentTime />
        <div className="userStats__totalTime">
          <p>
            {user.firstName} have played for a total of {time} minutes
          </p>
        </div>
        <AllUsersAllGames />
        <AllUserSessionData />
        <LeaderBoard />
      </div>
    );
  }
}

export default UserStats;
