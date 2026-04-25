import { useEffect, useRef, useState } from "react";

export default function RainbowRun() {
  const canvasRef = useRef(null);
  const keys = useRef({});
  const gameRef = useRef(null);
  const aveSpriteRef = useRef(null);
  const bgImageRef = useRef(null);

  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [status, setStatus] = useState("playing");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 900;
    canvas.height = 500;

    const aveSprite = new Image();
    aveSprite.src = "/assets/characters/ave/ave-sprite-sheet.png";
    aveSpriteRef.current = aveSprite;

    const bgImage = new Image();
    bgImage.src = "/assets/games/rainbow-run-bg.png";
    bgImageRef.current = bgImage;

    const game = {
      score: 0,
      hearts: 3,
      speed: 3,
      gravity: 0.7,
      status: "playing",
      invincible: 0,
      frame: 0,
      player: {
        x: 120,
        y: 330,
        w: 42,
        h: 54,
        vy: 0,
        grounded: false,
      },
      platforms: [
        { x: 0, y: 420, w: 900, h: 80 },
        { x: 420, y: 340, w: 150, h: 20 },
        { x: 720, y: 290, w: 150, h: 20 },
      ],
      stars: [],
      clouds: [],
    };

    gameRef.current = game;

    const spawnStar = () => {
      game.stars.push({
        x: canvas.width + 40,
        y: 180 + Math.random() * 180,
        r: 14,
        collected: false,
      });
    };

    const spawnCloud = () => {
      game.clouds.push({
        x: canvas.width + 40,
        y: 330 + Math.random() * 50,
        w: 62,
        h: 38,
      });
    };

    const drawRoundedRect = (x, y, w, h, r, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
    };

    const drawPlayer = () => {
      const p = game.player;
      const sprite = aveSpriteRef.current;

      ctx.save();

      if (game.invincible > 0 && Math.floor(game.frame / 5) % 2 === 0) {
        ctx.globalAlpha = 0.45;
      }

      if (sprite && sprite.complete && sprite.naturalWidth > 0) {
        const cols = 6;
        const rows = 2;
        const frameWidth = sprite.width / cols;
        const frameHeight = sprite.height / rows;

        const runFrame = Math.floor(game.frame / 8) % 6;
        const jumpFrame = game.player.vy < 0 ? 4 : 5;

        const frameX = game.player.grounded ? runFrame : jumpFrame;
        const frameY = game.player.grounded ? 1 : 0;

        ctx.drawImage(
          sprite,
          frameX * frameWidth,
          frameY * frameHeight,
          frameWidth,
          frameHeight,
          p.x - 28,
          p.y - 34,
          100,
          120
        );
      } else {
        drawRoundedRect(p.x, p.y, p.w, p.h, 16, "#ff8fd8");
      }

      ctx.restore();
    };

    const drawStar = (s) => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.fillStyle = "#ffe66d";
      ctx.strokeStyle = "#3b2a4a";
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? s.r : s.r / 2;
        const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const drawCloud = (c) => {
      ctx.fillStyle = "#8b8fa3";
      ctx.strokeStyle = "#3b2a4a";
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.arc(c.x + 16, c.y + 22, 16, 0, Math.PI * 2);
      ctx.arc(c.x + 34, c.y + 14, 20, 0, Math.PI * 2);
      ctx.arc(c.x + 52, c.y + 22, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#6d7088";
      ctx.fillRect(c.x + 10, c.y + 22, 54, 18);
    };

    const rectHit = (a, b) =>
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y;

    const circleHit = (p, s) => {
      const closestX = Math.max(p.x, Math.min(s.x, p.x + p.w));
      const closestY = Math.max(p.y, Math.min(s.y, p.y + p.h));
      const dx = s.x - closestX;
      const dy = s.y - closestY;
      return dx * dx + dy * dy < s.r * s.r;
    };

    const update = () => {
      if (game.status !== "playing") return;

      game.frame += 1;
      game.invincible = Math.max(0, game.invincible - 1);

      if (keys.current.ArrowLeft || keys.current.a) game.player.x -= 5;
      if (keys.current.ArrowRight || keys.current.d) game.player.x += 5;

      if (
        (keys.current.ArrowUp || keys.current.w || keys.current[" "]) &&
        game.player.grounded
      ) {
        game.player.vy = -14;
        game.player.grounded = false;
      }

      game.player.x = Math.max(20, Math.min(canvas.width - 80, game.player.x));
      game.player.vy += game.gravity;
      game.player.y += game.player.vy;
      game.player.grounded = false;

      for (const platform of game.platforms) {
        platform.x -= game.speed;

        if (
          game.player.x + game.player.w > platform.x &&
          game.player.x < platform.x + platform.w &&
          game.player.y + game.player.h > platform.y &&
          game.player.y + game.player.h < platform.y + platform.h + 18 &&
          game.player.vy >= 0
        ) {
          game.player.y = platform.y - game.player.h;
          game.player.vy = 0;
          game.player.grounded = true;
        }
      }

      const lastPlatform = game.platforms[game.platforms.length - 1];

      if (lastPlatform.x < canvas.width - 250) {
        game.platforms.push({
          x: canvas.width + Math.random() * 180,
          y: 280 + Math.random() * 120,
          w: 130 + Math.random() * 90,
          h: 20,
        });
      }

      game.platforms = game.platforms.filter((p) => p.x + p.w > -50);

      if (game.frame % 75 === 0) spawnStar();
      if (game.frame % 140 === 0) spawnCloud();

      for (const star of game.stars) star.x -= game.speed;
      for (const cloud of game.clouds) cloud.x -= game.speed + 1;

      for (const star of game.stars) {
        if (!star.collected && circleHit(game.player, star)) {
          star.collected = true;
          game.score += 1;

          if (game.score % 10 === 0) {
            game.speed *= 1.01;
          }

          setScore(game.score);
        }
      }

      for (const cloud of game.clouds) {
        if (game.invincible === 0 && rectHit(game.player, cloud)) {
          game.hearts -= 1;
          game.invincible = 90;
          setHearts(game.hearts);

          if (game.hearts <= 0) {
            game.status = "lost";
            setStatus("lost");
          }
        }
      }

      if (game.player.y > canvas.height + 80) {
        game.hearts -= 1;
        setHearts(game.hearts);

        game.player.x = 120;
        game.player.y = 240;
        game.player.vy = 0;
        game.invincible = 90;

        if (game.hearts <= 0) {
          game.status = "lost";
          setStatus("lost");
        }
      }

      if (game.score >= 30) {
        game.status = "won";
        setStatus("won");
      }

      game.stars = game.stars.filter((s) => s.x > -40 && !s.collected);
      game.clouds = game.clouds.filter((c) => c.x + c.w > -40);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bg = bgImageRef.current;

      if (bg && bg.complete && bg.naturalWidth > 0) {
        const scroll = game.frame * 0.5;
        const x1 = -(scroll % canvas.width);
        const x2 = x1 + canvas.width;

        ctx.drawImage(bg, x1, 0, canvas.width, canvas.height);
        ctx.drawImage(bg, x2, 0, canvas.width, canvas.height);
      } else {
        const fallback = ctx.createLinearGradient(0, 0, 0, canvas.height);
        fallback.addColorStop(0, "#b9f3ff");
        fallback.addColorStop(1, "#ffe3f6");
        ctx.fillStyle = fallback;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      for (const platform of game.platforms) {
        drawRoundedRect(platform.x, platform.y, platform.w, platform.h, 14, "#a98cff");
        drawRoundedRect(platform.x, platform.y - 8, platform.w, 10, 14, "#ffb3e6");
      }

      for (const star of game.stars) drawStar(star);
      for (const cloud of game.clouds) drawCloud(cloud);

      drawPlayer();

      ctx.fillStyle = "#3b2a4a";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(`Score: ${game.score}`, 24, 36);
      ctx.fillText(`Hearts: ${"💖".repeat(game.hearts)}`, 170, 36);

      if (game.status === "won" || game.status === "lost") {
        ctx.fillStyle = "rgba(255,255,255,0.86)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#3b2a4a";
        ctx.textAlign = "center";
        ctx.font = "bold 48px sans-serif";
        ctx.fillText(
          game.status === "won" ? "Rainbow Run Complete!" : "Try Again!",
          canvas.width / 2,
          220
        );

        ctx.font = "24px sans-serif";
        ctx.fillText("Press Restart to play again", canvas.width / 2, 270);
        ctx.textAlign = "left";
      }
    };

    let animationId;

    const loop = () => {
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    };

    const down = (e) => {
      if (
        e.key === " " ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        e.preventDefault();
      }

      keys.current[e.key] = true;
    };

    const up = (e) => {
      keys.current[e.key] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const restart = () => {
    if (document.activeElement) {
      document.activeElement.blur();
    }

    keys.current = {};

    setScore(0);
    setHearts(3);
    setStatus("playing");

    const game = gameRef.current;
    if (!game) return;

    game.score = 0;
    game.hearts = 3;
    game.speed = 3;
    game.status = "playing";
    game.invincible = 0;
    game.frame = 0;
    game.player.x = 120;
    game.player.y = 330;
    game.player.vy = 0;
    game.player.grounded = false;
    game.platforms = [
      { x: 0, y: 420, w: 900, h: 80 },
      { x: 420, y: 340, w: 150, h: 20 },
      { x: 720, y: 290, w: 150, h: 20 },
    ];
    game.stars = [];
    game.clouds = [];
  };

  return (
    <div className="rainbow-run-game">
      <h1 className="rainbow-run-title">Rainbow Run</h1>
<p className="rainbow-run-credit">
  Created by Taryn & Dad
</p>

      <p className="rainbow-run-help">
        Move with A/D or arrows. Jump with W, up arrow, or space.
      </p>

      <div className="rainbow-run-hud">
        <div>Score: {score}</div>
        <div>Hearts: {"💖".repeat(hearts)}</div>

        <button
          type="button"
          onClick={(e) => {
            restart();
            e.currentTarget.blur();
          }}
          className="rainbow-run-button"
        >
          Restart
        </button>
      </div>

      <canvas ref={canvasRef} className="rainbow-run-canvas" />

      {status === "won" && (
        <p className="rainbow-run-message win">
          You collected enough rainbow stars!
        </p>
      )}

      {status === "lost" && (
        <p className="rainbow-run-message lost">
          The storm clouds got you!
        </p>
      )}
    </div>
  );
}