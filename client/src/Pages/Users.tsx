import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createApiFetch } from "../stores/apiFetchStore";
import type { UserSchema } from "../types/tableTypes";
import defaultPic from "../assets/user.png";

const useFetchUsers = createApiFetch();

function Users() {
  const navigate = useNavigate();
  const users = useFetchUsers((state) => state.data as UserSchema[] | null); //Here we call the type of our data
  const error = useFetchUsers((state) => state.error);
  const fetchApi = useFetchUsers((state) => state.apiFetchAsync);

  useEffect(() => {
    fetchApi<UserSchema[]>("get", "users"); //fetches using get and the /users page
  }, [fetchApi]);
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div>
      <div>
        {users?.map((user) => (
          <div key={user.id} onClick={() => navigate(`/user/${user.id}`)}>
            <img
              src={user.profilePic ? user.profilePic : defaultPic}
              alt="Profile picture"
            />
            <p>{user.firstName}</p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/")}>Add user</button>
    </div>
  );
}

export default Users;
