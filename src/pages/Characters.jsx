import { useState } from "react";

const characters = [
  {
    name: "Ave",
    age: 14,
    role: "The Adventurer",
    image: "/assets/characters/ave/ave-character.png",
    colour: "#ff8fd8",
    short: "Brave, curious and full of ideas.",
    details:
      "Ave loves pink, adventures, puzzles and helping her friends. She is confident, creative and always ready to explore something new.",
    likes: ["Pink outfits", "Rainbows", "Coding games", "Solving mysteries"],
  },
  {
    name: "Zara",
    age: 14,
    role: "The Kind Explorer",
    image: "/assets/characters/zara/zara-character.png",
    colour: "#b794f4",
    short: "Warm, kind and adventurous.",
    details:
      "Zara loves purple and lilac, kitten motifs and cute accessories. She is a loyal friend who brings kindness and calm to every adventure.",
    likes: ["Purple", "Lilac", "Cat handbags", "Helping friends"],
  },
  {
  name: "Boba",
  age: "Magic",
  role: "The Heart of Friendship",
  image: "/assets/characters/boba/boba-character.png",
  colour: "#f6ad55",
  short: "Ave’s first  magical friend",
  details:
    "Boba came to life in Ave’s very first adventure and became her first magical friend. He represents the pure joy of friendship, the bonds we build with people we care about, and the comfort of knowing someone special is by your side. His presence lights up every room, and when he is away he is deeply missed.",
  likes: [
    "Friendship",
    "Warm hugs",
    "Happy moments",
    "Making people smile",
    "Being there for Ave",
  ],
},
  {
    name: "Pancake",
    age: "Freshly Made",
    role: "The Chaotic Runner",
    image: "/assets/characters/pancake/pancake-character.png",
    colour: "#fbbf24",
    short: "A wild pancake who runs before he thinks.",
    details:
      "Pancake is excitable, dramatic and always in motion. He wants to be helpful, but usually causes a syrupy mess first.",
    likes: ["Syrup", "Running", "Garden paths", "Big reactions"],
  },
];

export default function Characters() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  return (
    <div className="characters-page">
      <div className="floating-bg">
        <span>☁️</span>
        <span>⭐</span>
        <span>🌈</span>
        <span>✨</span>
        <span>☁️</span>
        <span>⭐</span>
      </div>

      <section className="characters-panel">
        <h1>Characters</h1>
        <p>Tap a card to reveal their adventure profile.</p>

        <div className="characters-grid">
          {characters.map((character) => (
            <article
              className="character-card"
              key={character.name}
              style={{ "--character-colour": character.colour }}
              onClick={() => setSelectedCharacter(character)}
            >
              <div className="character-image-wrap">
                <img src={character.image} alt={character.name} />
              </div>

              <div className="character-card-content">
                <h3>{character.name}</h3>
                <span>{character.role}</span>
                <p>{character.short}</p>
                <button type="button">View Profile ✨</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {selectedCharacter && (
        <div
          className="character-showcase-backdrop"
          onClick={() => setSelectedCharacter(null)}
        >
          <div
            className="character-showcase"
            style={{ "--character-colour": selectedCharacter.colour }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="showcase-close"
              onClick={() => setSelectedCharacter(null)}
            >
              ✕
            </button>

            <div className="showcase-sparkles">
              <span>✦</span>
              <span>✧</span>
              <span>★</span>
              <span>✨</span>
            </div>

            <div className="showcase-image">
              <img
                src={selectedCharacter.image}
                alt={selectedCharacter.name}
              />
            </div>

            <div className="showcase-info">
              <p className="showcase-label">Character Profile</p>
              <h2>{selectedCharacter.name}</h2>
              <h3>{selectedCharacter.role}</h3>

              <div className="showcase-age">
                Age: <strong>{selectedCharacter.age}</strong>
              </div>

              <p>{selectedCharacter.details}</p>

              <div className="character-likes">
                {selectedCharacter.likes.map((like) => (
                  <span key={like}>{like}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}