import { useEffect, useState } from "react";
import GameWindow from "../components/GameWindow";

const heroSlides = [
  {
    bg: "/assets/backgrounds/hero-bg.png",
    left: "/assets/characters/ave/ave-character.png",
    right: "/assets/characters/cake/cake-character.png",
    leftAlt: "Ave",
    rightAlt: "Cake",
    title: <>Big Dreams.<br /><span>Brave Hearts.</span><br />Endless Adventures.</>,
    text: "Join Ave and her friends on magical adventures full of fun, friendship and imagination!",
  },
  {
    bg: "/assets/backgrounds/adams-lab-bg.png",
    left: "/assets/characters/adam/adam-character.png",
    right: "/assets/characters/boba/boba-character.png",
    leftAlt: "Adam",
    rightAlt: "Boba",
    title: <>Science Sparks.<br /><span>Boba Magic.</span><br />Big Discoveries.</>,
    text: "Step inside Adam’s lab where experiments, inventions and magical boba come alive.",
  },
  {
    bg: "/assets/backgrounds/lolas-bakery-bg.png",
    left: "/assets/characters/lola/lola-character.png",
    right: "/assets/characters/pancake/pancake-character.png",
    leftAlt: "Lola",
    rightAlt: "Pancake",
    title: <>Sweet Treats.<br /><span>Big Feelings.</span><br />Bakery Chaos.</>,
    text: "Bake, laugh and solve tasty trouble with Lola and the dramatic Pancake.",
  },
  {
    bg: "/assets/backgrounds/pastel-street-bg.png",
    left: "/assets/characters/zara/zara-character.png",
    right: "/assets/characters/taco/taco-character.png",
    leftAlt: "Zara",
    rightAlt: "Taco",
    title: <>Street Quests.<br /><span>Funny Friends.</span><br />New Surprises.</>,
    text: "Explore the pastel streets with Zara and Taco on a bright new adventure.",
  },
];

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

const promoLinks = [
  {
    icon: "📖",
    title: "Amazing Books",
    text: "Fun stories that inspire and entertain!",
    button: "Shop Now →",
    page: "shop",
  },
  {
    icon: "🎨",
    title: "Cute Artwork",
    text: "Meet the characters and explore the world!",
    button: "View Characters →",
    page: "characters",
  },
  {
    icon: "🎁",
    title: "Fun Products",
    text: "Books, stories and more from Taryn’s world!",
    button: "Visit Shop →",
    page: "shop",
  },
  {
    icon: "💌",
    title: "Stay Connected",
    text: "Learn more about the young author behind the stories!",
    button: "About the Author →",
    page: "about-author",
  },
];

export default function Home({ onNavigate }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeGame, setActiveGame] = useState(null);

  const slide = heroSlides[activeSlide];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-page">
      <section
        className="home-hero-card"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(255, 222, 239, 0.7), rgba(255, 244, 250, 0.45)), url(${slide.bg})`,
        }}
      >
        <div className="hero-characters">
          <img src={slide.left} alt={slide.leftAlt} className="hero-ave-img" />
          <img src={slide.right} alt={slide.rightAlt} className="hero-cake-img" />
        </div>

        <div className="hero-copy">
          <h1>{slide.title}</h1>
          <p>{slide.text}</p>

          <div className="hero-actions">
            <button onClick={() => onNavigate("adventures")}>
              🎮 Explore Adventures
            </button>

            <button
              className="secondary"
              onClick={() => onNavigate("shop")}
            >
              📖 Shop Books
            </button>
          </div>

          <div className="hero-dots">
            {heroSlides.map((item, index) => (
              <button
                key={item.leftAlt}
                className={activeSlide === index ? "active" : ""}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show ${item.leftAlt} slide`}
              />
            ))}
          </div>
        </div>

        <div className="hero-book-card">
          <div className="book-badge">NEW BOOK!</div>

          <img
            src="/assets/books/gift-of-the-boba-tea-cover.png"
            alt="Ave's Adventures Book"
          />

          <h3>Ave’s Adventures</h3>
          <p>The latest adventure is out now!</p>

          <button onClick={() => onNavigate("shop")}>
            Buy on Amazon
          </button>
        </div>
      </section>

      <section className="adventure-panel">
        <h2>⭐ Choose Your Adventure! ⭐</h2>
        <p>Play fun games with Ave and friends</p>

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

              <button onClick={() => setActiveGame(game.gameId)}>
                🎮 Play
              </button>
            </article>
          ))}
        </div>

        <button
          className="view-all-btn"
          onClick={() => onNavigate("adventures")}
        >
          View All Adventures ☆
        </button>
      </section>

      <section className="home-link-strip">
        {promoLinks.map((item) => (
          <article key={item.title}>
            <span>{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>

            <button onClick={() => onNavigate(item.page)}>
              {item.button}
            </button>
          </article>
        ))}
      </section>

      <GameWindow
        gameId={activeGame}
        onClose={() => setActiveGame(null)}
      />
    </div>
  );
}