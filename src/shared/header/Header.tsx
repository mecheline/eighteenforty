import "./Header.css"
import ThemeToggle from "../theme/ThemeToggle";

const Header = () => {
  return (
    <nav className="nav">
      <div>
        <img src="./logoblack.svg" alt="logo" width={70} height={70} />
      </div>
      <div>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Header;
