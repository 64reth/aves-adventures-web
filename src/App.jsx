import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Adventures from "./pages/Adventures";
import Characters from "./pages/Characters";
import Shop from "./pages/Shop";
import AboutAuthor from "./pages/AboutAuthor";
import MusicToggle from "./components/MusicToggle";
import "./App.css";

const navItems = [
  { id: "home", label: "Home" },
  { id: "books", label: "Books" },
  { id: "adventures", label: "Adventures" },
  { id: "characters", label: "Characters" },
  { id: "shop", label: "Shop" },
  { id: "about-author", label: "About the Author" },
];

const pageMusic = {
  home: "ave-love.mp3",
  books: "rainbow-pocket.mp3",
  adventures: "bubblegum-banger.mp3",
  characters: "flower-confetti.mp3",
  shop: "cream-soda.mp3",
  "about-author": "star-confetti.mp3",
};

export default function App() {
  const [activePage, setActivePage] = useState(() => {
    const savedPage = localStorage.getItem("aves-active-page");
    return navItems.some((item) => item.id === savedPage) ? savedPage : "home";
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("aves-active-page", activePage);
    setMenuOpen(false);
  }, [activePage]);

  const goToPage = (page) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  const pages = {
    home: <Home onNavigate={setActivePage} />,
    books: <Books />,
    adventures: <Adventures />,
    characters: <Characters />,
    shop: <Shop />,
    "about-author": <AboutAuthor />,
  };

  return (
    <div className="app">
      <header className="site-header">
        <button
          type="button"
          className="brand-button"
          onClick={() => goToPage("home")}
        >
          <img
            src="/assets/brand/aves-adventures-logo-main.png"
            alt="Ave's Adventures"
            className="site-logo"
          />
        </button>

        <button
          type="button"
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`site-nav ${menuOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`nav-button ${activePage === item.id ? "active" : ""}`}
              onClick={() => goToPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <MusicToggle track={pageMusic[activePage]} />

      </header>

      <main className="site-main">
        <div key={activePage} className="page-transition">
          {pages[activePage]}
        </div>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Ave’s Adventures</p>
        <small>Stories, games and characters by Taryn ✨</small>
      </footer>
    </div>
  );
}