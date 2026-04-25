import { useState } from "react";
import GameWindow from "../components/GameWindow";

const games = [
  {
    title: "Cake Matcher",
    text: "Match cakes and score sweet combos!",
    image: "/assets/characters/cake/cake-character.png",
    bg: "/assets/games/cake-matcher-bg.png",
    gameId: "cake-matcher",
  },
  {
    title: "Rainbow Run",
    text: "Run, jump and collect stars!",
    image: "/assets/characters/ave/ave-character.png",
    bg: "/assets/games/rainbow-run-bg.png",
    gameId: "rainbow-run",
  },
  {
    title: "Boba Catch",
    text: "Catch the falling boba pearls!",
    image: "/assets/characters/boba/boba-character.png",
    bg: "/assets/games/boba-catch-bg.png",
    gameId: "boba-catch",
  },
  {
    title: "Pancake Panic",
    text: "Dodge obstacles on the garden path!",
    image: "/assets/characters/pancake/pancake-character.png",
    bg: "/assets/games/pancake-panic-bg.png",
    gameId: "pancake-panic",
  },
];

export default function Adventures() {
  const [activeGame, setActiveGame] = useState(null);

  return (
    <div className="adventures-page">
      <section className="adventure-panel">
        <h1>Adventures</h1>
        <p>Pick a game and jump into Ave’s world.</p>

        <div className="game-grid">
          {games.map((game) => (
            <article className="game-card" key={game.title}>
              <div
                className="game-image-wrap"
                style={{ backgroundImage: `url(${game.bg})` }}
              >
                <img src={game.image} alt={game.title} />
              </div>

              <h3>{game.title}</h3>
              <p>{game.text}</p>
              <button type="button" onClick={() => setActiveGame(game.gameId)}>
                🎮 Play
              </button>
            </article>
          ))}
        </div>
      </section>

      <GameWindow gameId={activeGame} onClose={() => setActiveGame(null)} />
    </div>
  );
}