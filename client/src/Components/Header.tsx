import SearchBar from "../Components/SearchBar";
import Weather from "../Components/Weather";

function Header() {
  return (
    <div className="header">
      <Weather />
      <SearchBar />
    </div>
  );
}

export default Header;
