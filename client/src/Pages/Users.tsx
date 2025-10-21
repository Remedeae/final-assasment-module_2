import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApiFetch } from "../stores/apiFetchStore";

function Users() {
  const navigate = useNavigate();
  const array = useApiFetch((state) => state.data);
  const fetchApi = useApiFetch((state) => state.apiFetchAsync);

  useEffect(() => {
    fetchApi();
  }, [fetchApi]);
  return (
    <div>
      <div>
        {array.map((item: unknown, index: number) => (
          <div key={index}>{JSON.stringify(item)}</div>
        ))}
      </div>
      <button onClick={() => navigate("/")}>Add user</button>
    </div>
  );
}

export default Users;
