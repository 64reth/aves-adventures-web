import { useState } from "react";
import GameWindow from "../components/GameWindow";

const games = [
  {
    title: "Cake Matcher",
    text: "Match cakes and score sweet combos!",
    image: "/assets/characters/cake/cake-character.png",
    bg: "/assets/games/cake-matcher-bg.png",
    gameId: "cake-matcher",
    badge: "NEW",
  },
  {
    title: "Rainbow Run",
    text: "Run, jump and collect stars!",
    image: "/assets/characters/ave/ave-character.png",
    bg: "/assets/games/rainbow-run-bg.png",
    gameId: "rainbow-run",
    badge: "HOT",
  },
  {
    title: "Boba Catch",
    text: "Catch the falling boba pearls!",
    image: "/assets/characters/boba/boba-character.png",
    bg: "/assets/games/boba-catch-bg.png",
    gameId: "boba-catch",
    badge: "FUN",
  },
  {
    title: "Pancake Panic",
    text: "Dodge obstacles on the garden path!",
    image: "/assets/characters/pancake/pancake-character.png",
    bg: "/assets/games/pancake-panic-bg.png",
    gameId: "pancake-panic",
    badge: "FAST",
  },
];

export default function Adventures() {
  const [activeGame, setActiveGame] = useState(null);

  return (
    <div className="adventures-page">
      <section className="adventure-hero">
        <div className="adventure-hero-overlay">
          <h1>Arcade Adventures</h1>
          <p>Choose a game and play in Ave’s magical arcade world ✨</p>
        </div>
      </section>

      <section className="adventure-panel">
        <div className="game-grid">
          {games.map((game) => (
            <article className="game-card" key={game.title}>
              <span className="game-badge">{game.badge}</span>

              <div
                className="game-image-wrap"
                style={{ backgroundImage: `url(${game.bg})` }}
              >
                <img src={game.image} alt={game.title} />
              </div>

              <div className="game-card-content">
                <h3>{game.title}</h3>
                <p>{game.text}</p>

                <button
                  type="button"
                  onClick={() => setActiveGame(game.gameId)}
                >
                  🎮 Play Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <GameWindow gameId={activeGame} onClose={() => setActiveGame(null)} />
    </div>
  );
}