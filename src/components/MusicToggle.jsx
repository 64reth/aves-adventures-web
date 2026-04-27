import { useEffect, useState } from "react";
import { playMusic, stopMusic, playSound } from "../utils/audio";

export default function MusicToggle({ track }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (playing) {
      playMusic(track);
    }
  }, [track, playing]);

  const handleToggle = () => {
    playSound("button", 0.35);

    if (playing) {
      stopMusic();
      setPlaying(false);
    } else {
      playMusic(track);
      setPlaying(true);
    }
  };

  return (
    <button
      type="button"
      className={`music-toggle ${playing ? "active" : ""}`}
      onClick={handleToggle}
      aria-label="Toggle music"
    >
      {playing ? "🔊 Music On" : "🔇 Music Off"}
    </button>
  );
}