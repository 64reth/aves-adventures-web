import { useState } from "react";

const books = [
  {
    title: "The Bad Pancake",
    image: "/assets/books/bad-pancake-cover.png",
    colour: "#fbbf24",
    short: "A wild pancake causes chaos wherever he goes.",
    description:
      "Meet Pancake, a funny and energetic friend who always means well... but somehow leaves a mess behind.",
    link: "#",
    previewPages: [
      "/assets/books/bad-pancake-page1.png",
      "/assets/books/bad-pancake-page2.png",
    ],
  },
  {
    title: "The Gift of the Boba Tea",
    image: "/assets/books/gift-of-the-boba-tea-cover.png",
    colour: "#f9a8d4",
    short: "A magical gift becomes Ave’s first special friend.",
    description:
      "When Adam gives Ave a mysterious present, something amazing happens. Add water... and Boba comes to life!",
    link: "#",
    previewPages: [
      "/assets/books/bob-tea-page1.png",
      "/assets/books/boba-tea-page2.png",
    ],
  },
  {
    title: "The Crazy Taco",
    image: "/assets/books/the-crazy-taco-cover.png",
    colour: "#fb923c",
    short: "A taco with too much energy tries to help.",
    description:
      "Taco is funny, fast and full of ideas. But every time he helps around the house, things get wonderfully out of control.",
    link: "#",
    previewPages: [
      "/assets/books/crazy-taco-page1.png",
      "/assets/books/crazy-taco-page2.png",
    ],
  },
];

export default function Books() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [previewPageIndex, setPreviewPageIndex] = useState(0);
  const [flipKey, setFlipKey] = useState(0);

  const openBook = (book) => {
    setSelectedBook(book);
    setPreviewPageIndex(0);
    setFlipKey(0);
  };

  const closeBook = () => {
    setSelectedBook(null);
    setPreviewPageIndex(0);
    setFlipKey(0);
  };

  const changePage = (direction) => {
    if (!selectedBook) return;

    const pageCount = selectedBook.previewPages.length;

    setPreviewPageIndex((current) => {
      if (direction === "next") {
        return (current + 1) % pageCount;
      }

      return (current - 1 + pageCount) % pageCount;
    });

    setFlipKey((current) => current + 1);
  };

  return (
    <div className="books-page">
      <div className="books-floaters">
        <span>📚</span>
        <span>✨</span>
        <span>🌈</span>
        <span>⭐</span>
      </div>

      <section className="books-panel">
        <h1>Books</h1>
        <p>Tap a story to read more and preview pages.</p>

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
              <p>{book.short}</p>

              <button type="button" onClick={() => openBook(book)}>
                Read More ✨
              </button>
            </article>
          ))}
        </div>
      </section>

      {selectedBook && (
        <div className="book-modal-backdrop" onClick={closeBook}>
          <div
            className="book-modal book-page-turn-modal"
            style={{ "--book-colour": selectedBook.colour }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="book-close" onClick={closeBook}>
              ✕
            </button>

            <div className="book-modal-topline">
              <div className="book-cover-mini">
                <img src={selectedBook.image} alt={selectedBook.title} />
              </div>

              <div className="book-modal-heading">
                <span className="book-label">Story Preview</span>
                <h2>{selectedBook.title}</h2>
                <p>{selectedBook.description}</p>
              </div>
            </div>

            <div className="book-page-stage">
              <button
                type="button"
                className="book-page-arrow left"
                onClick={() => changePage("prev")}
                aria-label="Previous preview page"
              >
                ‹
              </button>

              <div className="book-page-frame">
                <img
                  key={flipKey}
                  src={selectedBook.previewPages[previewPageIndex]}
                  alt={`${selectedBook.title} preview page ${
                    previewPageIndex + 1
                  }`}
                  className="book-preview-page-active"
                />
              </div>

              <button
                type="button"
                className="book-page-arrow right"
                onClick={() => changePage("next")}
                aria-label="Next preview page"
              >
                ›
              </button>
            </div>

            <div className="book-page-controls">
              <button type="button" onClick={() => changePage("prev")}>
                Previous Page
              </button>

              <span>
                Page {previewPageIndex + 1} of {selectedBook.previewPages.length}
              </span>

              <button type="button" onClick={() => changePage("next")}>
                Next Page
              </button>
            </div>

            <a
              className="shop-button"
              href={selectedBook.link}
              target="_blank"
              rel="noreferrer"
            >
              View on Amazon
            </a>
          </div>
        </div>
      )}
    </div>
  );
}