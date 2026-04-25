import { useState } from "react";
import { heroSlides } from "../data/siteData";

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const slide = heroSlides[active];

  const nextSlide = () => {
    setActive((current) => (current + 1) % heroSlides.length);
  };

  const previousSlide = () => {
    setActive((current) =>
      current === 0 ? heroSlides.length - 1 : current - 1
    );
  };

  return (
    <section className="px-4 pb-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-100 via-pink-50 to-yellow-100 shadow-xl border border-pink-100 min-h-[430px]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80 transition-all duration-700"
          style={{ backgroundImage: `url(${slide.background})` }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/85 via-pink-50/80 to-pink-100/80" />

        <button
          onClick={previousSlide}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 px-4 py-3 text-2xl text-pink-500 shadow-md hover:bg-white"
        >
          ‹
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 px-4 py-3 text-2xl text-pink-500 shadow-md hover:bg-white"
        >
          ›
        </button>

        <div className="relative z-10 grid min-h-[430px] grid-cols-1 items-center gap-8 px-8 py-10 lg:grid-cols-[1fr_1.1fr_0.9fr] lg:px-14">
          <div className="flex justify-center lg:justify-start">
            <img
              src={slide.characterImage}
              alt={slide.characterAlt}
              className="max-h-[360px] object-contain drop-shadow-2xl"
            />
          </div>

          <div className="text-center">
            <h1 className="text-5xl font-black leading-tight text-pink-500 drop-shadow-sm md:text-6xl">
              {slide.titleLineOne}
              <span className="block text-purple-700">{slide.titleLineTwo}</span>
              <span className="block text-pink-500">{slide.titleLineThree}</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-xl font-semibold leading-relaxed text-purple-900">
              {slide.description}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#adventures"
                className="rounded-full bg-pink-500 px-7 py-4 font-bold text-white shadow-lg hover:bg-pink-600"
              >
                🎮 Play Adventures
              </a>

              <a
                href="#books"
                className="rounded-full border-2 border-pink-400 bg-white/80 px-7 py-4 font-bold text-pink-500 shadow-md hover:bg-pink-50"
              >
                📖 Shop Books
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative rounded-3xl bg-white/80 p-5 shadow-2xl ring-1 ring-pink-100">
              {slide.badge && (
                <div className="absolute -left-5 -top-5 rounded-full bg-pink-500 px-4 py-3 text-center text-sm font-black uppercase text-white shadow-lg">
                  {slide.badge}
                </div>
              )}

              <img
                src={slide.bookImage}
                alt={slide.bookTitle}
                className="h-[250px] w-[250px] rounded-2xl object-cover shadow-lg"
              />
            </div>

            <h2 className="mt-5 text-center text-2xl font-black text-purple-900">
              {slide.bookTitle}
            </h2>

            <p className="mt-2 text-center font-semibold text-purple-700">
              {slide.bookSubtitle}
            </p>

            <a
              href={slide.amazonUrl}
              className="mt-5 rounded-full bg-pink-500 px-7 py-3 font-black text-white shadow-lg hover:bg-pink-600"
            >
              Buy on Amazon
            </a>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`h-3 w-3 rounded-full transition ${
                index === active ? "bg-pink-500" : "bg-pink-200"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
