import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";

function HomeButton({ onClick }) {
  return (
    <Link to="/" className="home-button" onClick={onClick}>
      <img
        src={logo}
        alt="Logo"
        style={{ width: "70px", height: "auto", borderRadius: "20px" }}
      />
    </Link>
  );
}

export default HomeButton;