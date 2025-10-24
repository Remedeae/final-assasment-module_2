import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApiFetch } from "../stores/apiFetchStore";
import type { UserSchema } from "../types/tableTypes";
import defaultPic from "../assets/20181202-_M7A7061.jpg";

function Users() {
  const navigate = useNavigate();
  const users = useApiFetch((state) => state.data as UserSchema[] | null); //Here we call the type of our data
  const error = useApiFetch((state) => state.error);
  const fetchApi = useApiFetch((state) => state.apiFetchAsync);

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
          <div key={user.id}>
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
