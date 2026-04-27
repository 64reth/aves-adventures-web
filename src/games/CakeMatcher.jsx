import { useEffect, useState } from "react";
import { playSound } from "../utils/audio";

const cardImages = [
  "/assets/characters/cake/cake-character.png",
  "/assets/characters/boba/boba-character.png",
  "/assets/characters/taco/taco-character.png",
  "/assets/characters/pancake/pancake-character.png",
  "/assets/characters/ave/ave-portrait-bust.png",
  "/assets/characters/zara/zara-portrait-bust.png",
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function CakeMatcher({ onBack }) {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  function startGame() {
    playSound("start", 0.35);

    const deck = shuffle(
      [...cardImages, ...cardImages].map((image, index) => ({
        id: index,
        image,
        matched: false,
      }))
    );

    setCards(deck);
    setSelected([]);
    setMoves(0);
    setHasWon(false);
  }

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    const complete = cards.length > 0 && cards.every((card) => card.matched);

    if (complete && !hasWon) {
      playSound("win", 0.55);
      setHasWon(true);
    }
  }, [cards, hasWon]);

  function chooseCard(card) {
    if (selected.length === 2 || card.matched || selected.includes(card.id)) {
      return;
    }

    playSound("reveal", 0.3);

    const nextSelected = [...selected, card.id];
    setSelected(nextSelected);

    if (nextSelected.length === 2) {
      setMoves((m) => m + 1);

      const [firstId, secondId] = nextSelected;
      const first = cards.find((c) => c.id === firstId);
      const second = cards.find((c) => c.id === secondId);

      if (first.image === second.image) {
        playSound("match", 0.45);

        setCards((current) =>
          current.map((c) =>
            c.image === first.image ? { ...c, matched: true } : c
          )
        );

        setSelected([]);
      } else {
        playSound("nomatch", 0.35);
        setTimeout(() => setSelected([]), 800);
      }
    }
  }

  const complete = cards.length > 0 && cards.every((card) => card.matched);

  return (
    <section className="cake-matcher">
      <div className="cake-game-header">
        <div>
          <h1>Cake Matcher</h1>
          <p>Match the pairs before the bakery gets too busy!</p>
        </div>

        <div className="cake-game-actions">
          <span>Moves: {moves}</span>

          <button type="button" onClick={startGame}>
            Restart
          </button>

          {onBack && (
            <button
              type="button"
              onClick={() => {
                playSound("button", 0.35);
                onBack();
              }}
            >
              Back
            </button>
          )}
        </div>
      </div>

      {complete && <div className="cake-win">🎉 Sweet match! You won!</div>}

      <div className="cake-grid">
        {cards.map((card) => {
          const flipped = selected.includes(card.id) || card.matched;

          return (
            <button
              type="button"
              className={`cake-card ${flipped ? "flipped" : ""}`}
              key={card.id}
              onClick={() => chooseCard(card)}
            >
              {flipped ? <img src={card.image} alt="" /> : <span>?</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}