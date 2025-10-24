import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApiFetch } from "../stores/apiFetchStore";
import type { User } from "../types/tableTypes";

function User() {
  const { id } = useParams();
  const user = useApiFetch((state) => state.data as User | null); //here we call the type of data
  const error = useApiFetch((state) => state.error);
  const fetchApi = useApiFetch((state) => state.apiFetchAsync);

  useEffect(() => {
    fetchApi(
      "get", //fetches with get
      `user/${id}`
    ); //fetches localhost:3000/user/:id
  }, [fetchApi]);
  console.log(user);
  return (
    <div>
      <h1>User id: {id} </h1>
      {error ? <p>{error}</p> : <h2>{user?.firstName}</h2>}
    </div>
  );
}

export default User;
