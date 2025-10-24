import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApiFetch } from "../stores/apiFetchStore";

function User() {
  const { id } = useParams();
  const array = useApiFetch((state) => state.data);
  const fetchApi = useApiFetch((state) => state.apiFetchAsync);

  useEffect(() => {
    fetchApi(
      "get", //fetches with get
      `user/${id}`
    ); //fetches localhost:3000/user/:id
  }, [fetchApi]);
  console.log(array);
  return (
    <div>
      <h1>User id: {id} </h1>
      {/*       <h2>{array[0]}</h2> */}
      <div>
        {array.map((item: unknown, index: number) => (
          <div key={index}>{JSON.stringify(item)}</div>
        ))}
      </div>
    </div>
  );
}

export default User;
