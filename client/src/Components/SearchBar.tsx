import { useEffect, useState } from "react";
import { createApiFetch } from "../stores/apiFetchStore";
import type { UserSchema } from "../types/tableTypes";
import { useNavigate } from "react-router-dom";

const useFetchSearch = createApiFetch();

function SearchBar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [displayResults, setDisplayResults] = useState<string>("hideResults");

  const users = useFetchSearch((state) => state.data as UserSchema[] | null);
  //const error = useFetchUsers((state) => state.error);
  const getUsers = useFetchSearch((state) => state.apiFetchAsync);

  useEffect(() => {
    if (search !== "") {
      getUsers("get", `search?q=${search}`);
      setDisplayResults("");
    } else {
      setDisplayResults("hideResults");
    }
  }, [getUsers, search]);
  //console.log(users);
  //console.log(search);

  return (
    <div className="searchBar">
      <div>
        <label htmlFor="searchBar">Search</label>
        <input
          type="text"
          id="search"
          placeholder="Search for user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className={displayResults}>
        {users?.map((user) => (
          <ul key={user.id}>
            <li onClick={() => navigate(`/user/${user.id}`)}>
              {user.firstName} {user.lastName}
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
