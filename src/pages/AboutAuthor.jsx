export default function AboutAuthor() {
  return (
    <div className="author-page">
      <section className="author-hero">
        <div className="author-hero-bg">
          <img src="/assets/author/storybook-clouds.png" alt="" />
        </div>

        <div className="author-glow author-glow-one" />
        <div className="author-glow author-glow-two" />

        <div className="author-content">
          <p className="author-kicker">Meet the creator</p>

          <h1>About the Author</h1>

          <div className="author-feature-row">
            <div className="author-portrait-card">
              <div className="author-portrait-frame">
                <img
                  src="/assets/author/taryn-author.png"
                  alt="Taryn the author"
                />
              </div>

              <div className="author-portrait-badge">
                Young Creator ✨
              </div>
            </div>

            <div className="author-card">
              <h2>Hi, I’m Taryn!</h2>

              <p>
                I’m 8 years old, the youngest of three siblings, and I’m
                always bursting with ideas for stories, characters and
                adventures.
              </p>

              <p>
                I started making books on coloured paper. I wrote the
                stories, drew the pictures, clipped the pages together
                and carried them everywhere. They got a bit battered
                because I loved them so much!
              </p>

              <p>
                My dad saw how proud I was, so we turned my stories into
                real digital books. We used technology and AI to help
                bring the characters to life, and the first book looked
                so good that we decided to publish it on Amazon.
              </p>

              <p>
                I want my stories to make kids smile, feel understood and
                remember that growing up can be tricky sometimes — but
                they are never alone.
              </p>

              <div className="author-dreams">
                <span>Author</span>
                <span>Teacher</span>
                <span>Baker</span>
                <span>Basketball Player</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="author-details">
        <div className="author-detail-card">
          <h3>Things I Love</h3>
          <p>
            Cooking, gaming, coding club, acting, performing arts,
            plays, musicals and dance routines.
          </p>
        </div>

        <div className="author-detail-card">
          <h3>Favourite Snacks</h3>
          <p>
            Avocado, nori sheets, strawberries and crisps —
            especially cheese and onion!
          </p>
        </div>

        <div className="author-detail-card">
          <h3>Favourite Games</h3>
          <p>
            Tomodachi Life, Animal Crossing: New Horizons and
            Toca Boca.
          </p>
        </div>
      </section>
    </div>
  );
}