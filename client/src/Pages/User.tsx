import { useParams } from "react-router-dom";

function User() {
  const { id } = useParams();
  const user = useApiFetch((state) => state.data);
  const fetchApi = useApiFetch((state) => state.apiFetchAsync);

  useEffect(() => {
    fetchApi();
  }, [fetchApi]);
  return (
    <div>
      <h1>User id: {id} </h1>
    </div>
  );
}

export default User;
