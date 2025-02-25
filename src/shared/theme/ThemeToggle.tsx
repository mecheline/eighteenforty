import type React from "react";
import Switch from "react-switch";
import { useTheme } from "../../context/ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <Switch
        onChange={toggleTheme}
        checked={theme === "dark"}
        onColor="#86d3ff"
        onHandleColor="#000"
        handleDiameter={25}
        uncheckedIcon={<div className="switch-icon">☀️</div>}
        checkedIcon={<div className="switch-icon">🌙</div>}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        height={30}
        width={58}
        className="react-switch"
        id="material-switch"
      />
      {theme}
    </div>
  );
};

export default ThemeToggle;
