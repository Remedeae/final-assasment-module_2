import { useState } from "react";

function SearchBar() {
  const [search, setSearch] = useState<string>();
  return (
    <div className="searchBar">
      <form>
        <label htmlFor="searchBar">Search</label>
        <input
          type="text"
          id="search"
          placeholder="Search for user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
    </div>
  );
}

export default SearchBar;
