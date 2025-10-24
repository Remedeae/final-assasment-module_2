import SearchBar from "./SearchBar";
import Weather from "./Weather";

function Header() {
  return (
    <div className="header">
      <Weather />
      <SearchBar />
    </div>
  );
}

export default Header;
