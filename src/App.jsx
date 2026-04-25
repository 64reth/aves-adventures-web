import { useState } from "react";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Adventures from "./pages/Adventures";
import Characters from "./pages/Characters";
import Shop from "./pages/Shop";
import AboutAve from "./pages/AboutAve";
import "./App.css";

const pages = {
  home: <Home />,
  books: <Books />,
  adventures: <Adventures />,
  characters: <Characters />,
  shop: <Shop />,
  "about-ave": <AboutAve />,
};

const navItems = [
  { id: "home", label: "Home" },
  { id: "books", label: "Books" },
  { id: "adventures", label: "Adventures" },
  { id: "characters", label: "Characters" },
  { id: "shop", label: "Shop" },
  { id: "about-ave", label: "About Ave" },
];

export default function App() {
  const [activePage, setActivePage] = useState("home");

  return (
    <div className="app">
      <header className="site-header">
        <button className="brand-button" onClick={() => setActivePage("home")}>
          <img
            src="/assets/brand/aves-adventures-logo-main.png"
            alt="Ave's Adventures"
            className="site-logo"
          />
        </button>

        <nav className="site-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="site-main">{pages[activePage]}</main>
    </div>
  );
}
