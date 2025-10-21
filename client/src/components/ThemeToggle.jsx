// client/src/components/ThemeToggle.jsx
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      className="btn btn--ghost"
      aria-label="Toggle theme"
      onClick={toggle}
      title={theme === "dark" ? "Kalo në Light" : "Kalo në Dark"}
      style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}
    >
      {theme === "dark" ? (
        <>
          <span aria-hidden>🌙</span>
          Dark
        </>
      ) : (
        <>
          <span aria-hidden>☀️</span>
          Light
        </>
      )}
    </button>
  );
}
