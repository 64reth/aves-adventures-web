import { useState } from "react";

const books = [
  {
    title: "The Bad Pancake",
    image: "/assets/books/bad-pancake-cover.png",
    colour: "#fbbf24",
    blurb:
      "A mischievous pancake causes chaos in a sweet and funny adventure.",
    full:
      "A playful story full of laughs, surprises and silly trouble. Perfect for readers who love funny characters and exciting moments.",
  },
  {
    title: "The Crazy Taco",
    image: "/assets/books/the-crazy-taco-cover.png",
    colour: "#fb7185",
    blurb:
      "A wild taco arrives at dinner and turns the house upside down.",
    full:
      "What starts as taco night becomes a hilarious adventure. Full of energy, mess and lovable chaos.",
  },
  {
    title: "The Gift of the Boba Tea",
    image: "/assets/books/gift-of-the-boba-tea-cover.png",
    colour: "#38bdf8",
    blurb:
      "Ave discovers a magical boba tea who becomes her first true friend.",
    full:
      "A warm story about friendship, comfort and connection. Boba brings joy wherever he goes and reminds us how special friendship can be.",
  },
];

export default function Books() {
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <div className="books-page">
      <div className="books-floaters">
        <span>📚</span>
        <span>⭐</span>
        <span>✨</span>
        <span>🌈</span>
      </div>

      <section className="books-panel">
        <h1>Books</h1>
        <p>Stories created from imagination, love and adventure.</p>

        <div className="books-grid">
          {books.map((book) => (
            <article
              key={book.title}
              className="book-card"
              style={{ "--book-colour": book.colour }}
            >
              <div className="book-cover-wrap">
                <img src={book.image} alt={book.title} />
              </div>

              <h3>{book.title}</h3>
              <p>{book.blurb}</p>

              <button
                type="button"
                onClick={() => setSelectedBook(book)}
              >
                Read More ✨
              </button>
            </article>
          ))}
        </div>
      </section>

      {selectedBook && (
        <div
          className="book-modal-backdrop"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="book-modal"
            style={{ "--book-colour": selectedBook.colour }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="book-close"
              onClick={() => setSelectedBook(null)}
            >
              ✕
            </button>

            <div className="book-modal-cover">
              <img
                src={selectedBook.image}
                alt={selectedBook.title}
              />
            </div>

            <div className="book-modal-info">
              <p className="book-label">Story Book</p>
              <h2>{selectedBook.title}</h2>
              <p>{selectedBook.full}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}