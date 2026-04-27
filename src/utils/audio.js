let music = null;

const sfx = {
  bash: "/assets/audio/sfx/bash.wav",
  boingwizz: "/assets/audio/sfx/boingwizz.wav",
  boost: "/assets/audio/sfx/boost.wav",
  button: "/assets/audio/sfx/button.wav",
  cloud: "/assets/audio/sfx/cloud.wav",
  collect: "/assets/audio/sfx/collect.wav",
  collide: "/assets/audio/sfx/collide.wav",
  flyUp: "/assets/audio/sfx/fly-up.wav",
  gameOver: "/assets/audio/sfx/game-over.wav",
  jump: "/assets/audio/sfx/jump.wav",
  lose: "/assets/audio/sfx/lose.wav",
  match: "/assets/audio/sfx/match.wav",
  nomatch: "/assets/audio/sfx/nomatch.wav",
  ok: "/assets/audio/sfx/ok.wav",
  reveal: "/assets/audio/sfx/reveal.wav",
  select: "/assets/audio/sfx/select.wav",
  shoot: "/assets/audio/sfx/shoot.wav",
  spin: "/assets/audio/sfx/spin.wav",
  spring: "/assets/audio/sfx/spring.wav",
  start: "/assets/audio/sfx/start.wav",
  vent: "/assets/audio/sfx/vent.wav",
  win: "/assets/audio/sfx/win.wav",
};

export function playSound(name, volume = 0.5) {
  const src = sfx[name];
  if (!src) return;

  const audio = new Audio(src);
  audio.volume = volume;
  audio.play().catch(() => {});
}

export function playMusic(track = "ave-love.mp3", volume = 0.25) {
  stopMusic();

  music = new Audio(`/assets/audio/songs/${track}`);
  music.loop = true;
  music.volume = volume;
  music.play().catch(() => {});
}

export function stopMusic() {
  if (music) {
    music.pause();
    music.currentTime = 0;
    music = null;
  }
}

export function toggleMusic(track = "ave-love.mp3") {
  if (music && !music.paused) {
    stopMusic();
    return false;
  }

  playMusic(track);
  return true;
}