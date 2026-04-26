export default function Shop() {
  const products = [
    {
      title: "The Bad Pancake",
      image: "/assets/books/bad-pancake-cover.png",
      text: "A mischievous pancake adventure full of fun and chaos.",
      link: "https://www.amazon.co.uk/Bad-Pancake-mischevious-magical-adventure/dp/B0DZC7THN5/ref=sr_1_1?crid=28NUP6XUD9EO7&dib=eyJ2IjoiMSJ9.9uKlY2R-EZ0VqB-buXa_X3oKavkd1FGK5fR-vHMdFSo.u1ZMN7ARUm3Exyr5tJLkHzFYOxHCrMtw0ODPEFVzAiU&dib_tag=se&keywords=the+bad+pancake&qid=1777214508&sprefix=the+bad+pancake%2Caps%2C120&sr=8-1",
      colour: "#fbbf24",
    },
    {
      title: "The Crazy Taco",
      image: "/assets/books/the-crazy-taco-cover.png",
      text: "A wild taco causes hilarious trouble at home.",
      link: "https://www.amazon.co.uk/Crazy-Taco-Aves-Adventures/dp/B0FW4ZP3YM/ref=sr_1_1?crid=3N70JUEJT3OIS&dib=eyJ2IjoiMSJ9.z6j4bvGELILlddVTpWoXAMLts2gLAqjrEis12ko34zUOTz7i2SBiGxfxnZw8xNQ-t_qvunNTCviCC9kNeL9yk1bDhvZCo0xnHKYWjYBcTiO4G-NvTuSGS2qxdeIVezaTPvAl82vDLOa20OUfeAi75wRMEX_1qr_kff8UcwGaSGu4QwBOGhhdtXHOVkPxT6PMG9CpSNNxXuBOLR2GO8kNm3mGkfYY_3WUNSQC7qu39wo.RShoyKXCYpBtLCwxIzaBcpokuEdciQ2os4p014wiU6M&dib_tag=se&keywords=the+crazy+taco&qid=1777214379&sprefix=the+crazy+taco%2Caps%2C115&sr=8-1",
      colour: "#fb7185",
    },
    {
      title: "The Gift of the Boba Tea",
      image: "/assets/books/gift-of-the-boba-tea-cover.png",
      text: "A heartwarming story about friendship and comfort.",
      link: "https://www.amazon.co.uk/Gift-Boba-Tea-Friendship-Favourite/dp/B0DXDK97HS/ref=sr_1_2?crid=3IL3VJLICII3T&dib=eyJ2IjoiMSJ9.KoPhA19myWyYgmd69S6Bu0X15qXPiydj-xTmnT0iZQ4OvjCJbTVCBzwhDvtlWVeftRCsVXjMXhj-qMNfru46oaZNLUM8aaUjd8ckORO_8d-au8Il0nIl09ETaUYyyFpUmgxVqx6jm5KELZOJgsYWI1ObRASjRAgFJKueidapsYdZjpOqsDpPJRBQC4L-2kwYYHOKmjsYfEFK4i604HR0JgSh_BRL61qfU5si7zMkVAU.wfgO2yd-6TKigGMR8yyjgyd6TO8b6U7ull1omwKYkxE&dib_tag=se&keywords=the+gift+of+the+boba+tea&qid=1777214595&sprefix=the+gift+of+the+boba+tea%2Caps%2C139&sr=8-2",
      colour: "#38bdf8",
    },
  ];

  return (
    <div className="shop-page">
      <section className="shop-panel">
        <p className="shop-kicker">Official Store</p>
        <h1>Shop the Books</h1>
        <p className="shop-subtitle">
          Support Taryn’s stories and bring the adventures home.
        </p>

        <div className="shop-grid">
          {products.map((item) => (
            <article
              key={item.title}
              className="shop-card"
              style={{ "--shop-colour": item.colour }}
            >
              <div className="shop-cover">
                <img src={item.image} alt={item.title} />
              </div>

              <h3>{item.title}</h3>
              <p>{item.text}</p>

              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="shop-button"
              >
                Buy on Amazon
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}