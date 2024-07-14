import "./topbar.css";
import SearchIcon from "@mui/icons-material/Search";

export default function Topbar() {
  return (

    <div className="topbarContainer">
      <div className="topbarLeft">
        <span className="logo">Admin pannel</span>
      </div>

      <div className="topbarCenter">
        <div className="searchbar">
          <SearchIcon className="searchIcon" />
          <input placeholder="Rechercher une plante.."className="searchInput"/>
        </div>
      </div>

      <div className="topbarRight">
        <img src="https://picsum.photos/200/200" alt="User Icon" className="profilePicture" />
      </div>
    </div>

  );
}
