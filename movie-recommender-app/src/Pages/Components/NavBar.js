// NavBar Component
import { Link } from "react-router-dom";
import "./styles/NavBarStyles.css";
import Logo from "./images/Logo2.png";

const NavBar = ({ isHome }) => {
    return (
        <div className="container header">
            <Link to="/">
                <img src={Logo} className="logo" alt="Logo" />
            </Link>
            {/* If isHome, show the home button, otherwise link to the new page */}
            {isHome ? (
                <a href="/" className="header-btn1 bouncy">
                    <i className="fas fa-home"></i> Home
                </a>
            ) : (
                <Link to="/Chatbot" className="header-btn1 bouncy">
                    <i className="fas fa-link"></i> Chatbot
                </Link>
            )}
        </div>
    );
};

export default NavBar;
