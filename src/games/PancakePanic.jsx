import { useEffect, useRef, useState } from "react";

export default function PancakePanic() {
  const canvasRef = useRef(null);
  const keys = useRef({});
  const gameRef = useRef(null);

  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [status, setStatus] = useState("playing");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 700;
    canvas.height = 500;

    const bg = new Image();
    bg.src = "/assets/games/pancake-panic-bg.png";

    const pancakeSprite = new Image();
    pancakeSprite.src = "/assets/characters/pancake/pancake-sprite-sheet.png";

    const logImg = new Image();
    logImg.src = "/assets/games/pancake-panic/log-obstacle.png";

    const cactusImg = new Image();
    cactusImg.src = "/assets/games/pancake-panic/cactus-obstacle.png";

    const boulderImg = new Image();
    boulderImg.src = "/assets/games/pancake-panic/boulder-obstacle.png";

    const syrupImg = new Image();
    syrupImg.src = "/assets/games/pancake-panic/syrup-reward.png";

    const game = {
      frame: 0,
      score: 0,
      hearts: 3,
      speed: 3,
      status: "playing",
      invincible: 0,
      bgScroll: 0,
      player: {
        x: canvas.width / 2 - 40,
        y: canvas.height - 120,
        w: 80,
        h: 80,
      },
      obstacles: [],
      syrup: [],
    };

    gameRef.current = game;

    const spawnObstacle = () => {
      const types = [
        { name: "log", img: logImg, w: 115, h: 58 },
        { name: "cactus", img: cactusImg, w: 65, h: 92 },
        { name: "boulder", img: boulderImg, w: 88, h: 70 },
      ];

      const picked = types[Math.floor(Math.random() * types.length)];

      game.obstacles.push({
        x: 170 + Math.random() * 330,
        y: -110,
        w: picked.w,
        h: picked.h,
        img: picked.img,
        type: picked.name,
      });
    };

    const spawnSyrup = () => {
      game.syrup.push({
        x: 180 + Math.random() * 320,
        y: -70,
        w: 58,
        h: 58,
        collected: false,
        img: syrupImg,
      });
    };

    const rectHit = (a, b) =>
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y;

    const update = () => {
      if (game.status !== "playing") return;

      game.frame += 1;
      game.invincible = Math.max(0, game.invincible - 1);
      game.bgScroll += game.speed;

      if (keys.current.ArrowLeft || keys.current.a) game.player.x -= 6;
      if (keys.current.ArrowRight || keys.current.d) game.player.x += 6;
      if (keys.current.ArrowUp || keys.current.w) game.player.y -= 4;
      if (keys.current.ArrowDown || keys.current.s) game.player.y += 4;

      game.player.x = Math.max(150, Math.min(canvas.width - 220, game.player.x));
      game.player.y = Math.max(120, Math.min(canvas.height - 140, game.player.y));

      if (game.frame % 70 === 0) spawnObstacle();
      if (game.frame % 110 === 0) spawnSyrup();

      for (const obs of game.obstacles) obs.y += game.speed + 2;
      for (const drop of game.syrup) drop.y += game.speed + 1;

      for (const obs of game.obstacles) {
        const playerHitbox = {
          x: game.player.x + 14,
          y: game.player.y + 12,
          w: game.player.w - 28,
          h: game.player.h - 22,
        };

        const obstacleHitbox = {
          x: obs.x + obs.w * 0.12,
          y: obs.y + obs.h * 0.12,
          w: obs.w * 0.76,
          h: obs.h * 0.76,
        };

        if (
          game.invincible === 0 &&
          rectHit(playerHitbox, obstacleHitbox)
        ) {
          game.hearts -= 1;
          game.invincible = 90;
          setHearts(game.hearts);

          if (game.hearts <= 0) {
            game.status = "lost";
            setStatus("lost");
          }
        }
      }

      for (const drop of game.syrup) {
        if (!drop.collected && rectHit(game.player, drop)) {
          drop.collected = true;
          game.score += 5;
          setScore(Math.floor(game.score));

          if (game.score % 25 === 0) {
            game.speed += 0.3;
          }
        }
      }

      game.score += 0.03;
      setScore(Math.floor(game.score));

      if (game.score >= 999) {
        game.status = "won";
        setStatus("won");
      }

      game.obstacles = game.obstacles.filter((o) => o.y < canvas.height + 120);
      game.syrup = game.syrup.filter(
        (s) => s.y < canvas.height + 90 && !s.collected
      );
    };

    const drawBackground = () => {
      if (bg.complete && bg.naturalWidth > 0) {
        const h = canvas.height;
        const y1 = game.bgScroll % h;
        ctx.drawImage(bg, 0, y1 - h, canvas.width, h);
        ctx.drawImage(bg, 0, y1, canvas.width, h);
      } else {
        ctx.fillStyle = "#f8d47a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    const drawImageOrFallback = (img, fallback, x, y, w, h) => {
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, x, y, w, h);
      } else {
        ctx.font = `${Math.max(32, h)}px sans-serif`;
        ctx.fillText(fallback, x, y + h);
      }
    };

    const drawPlayer = () => {
      const p = game.player;

      ctx.save();

      if (game.invincible > 0 && Math.floor(game.frame / 5) % 2 === 0) {
        ctx.globalAlpha = 0.45;
      }

      if (pancakeSprite.complete && pancakeSprite.naturalWidth > 0) {
        const cols = 3;
        const rows = 2;
        const frameWidth = pancakeSprite.width / cols;
        const frameHeight = pancakeSprite.height / rows;

        const frame = Math.floor(game.frame / 8) % 6;
        const frameX = frame % cols;
        const frameY = Math.floor(frame / cols);

        ctx.drawImage(
          pancakeSprite,
          frameX * frameWidth,
          frameY * frameHeight,
          frameWidth,
          frameHeight,
          p.x - 8,
          p.y - 18,
          95,
          90
        );
      } else {
        ctx.font = "76px sans-serif";
        ctx.fillText("🥞", p.x, p.y + 70);
      }

      ctx.restore();
    };

    const drawHud = () => {
      const displayScore = String(Math.floor(game.score)).padStart(3, "0");

      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#3b2a4a";
      ctx.lineWidth = 4;

      ctx.strokeText(`Score: ${displayScore}`, 24, 40);
      ctx.fillText(`Score: ${displayScore}`, 24, 40);

      ctx.strokeText(`Hearts: ${"💛".repeat(game.hearts)}`, 230, 40);
      ctx.fillText(`Hearts: ${"💛".repeat(game.hearts)}`, 230, 40);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBackground();

      for (const drop of game.syrup) {
        drawImageOrFallback(drop.img, "🍯", drop.x, drop.y, drop.w, drop.h);
      }

      for (const obs of game.obstacles) {
        const fallback =
          obs.type === "cactus" ? "🌵" : obs.type === "log" ? "🪵" : "🪨";

        drawImageOrFallback(obs.img, fallback, obs.x, obs.y, obs.w, obs.h);
      }

      drawPlayer();
      drawHud();

      if (game.status === "won" || game.status === "lost") {
        ctx.fillStyle = "rgba(255,255,255,0.86)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#7c3aed";
        ctx.textAlign = "center";
        ctx.font = "bold 48px sans-serif";
        ctx.fillText(
          game.status === "won" ? "Pancake Escaped!" : "Pancake Panic!",
          canvas.width / 2,
          220
        );

        ctx.font = "24px sans-serif";
        ctx.fillText("Press Restart to play again", canvas.width / 2, 270);
        ctx.textAlign = "left";
      }
    };

    let anim;

    const loop = () => {
      update();
      draw();
      anim = requestAnimationFrame(loop);
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
      cancelAnimationFrame(anim);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const restart = () => {
    if (document.activeElement) document.activeElement.blur();

    keys.current = {};

    setScore(0);
    setHearts(3);
    setStatus("playing");

    const game = gameRef.current;
    if (!game) return;

    game.frame = 0;
    game.score = 0;
    game.hearts = 3;
    game.speed = 3;
    game.status = "playing";
    game.invincible = 0;
    game.bgScroll = 0;
    game.player.x = 700 / 2 - 40;
    game.player.y = 500 - 120;
    game.obstacles = [];
    game.syrup = [];
  };

  return (
    <div className="rainbow-run-game">
      <h1 className="rainbow-run-title">Pancake Panic</h1>

      <p className="rainbow-run-help">
        Move with W/A/S/D or arrows. Dodge obstacles and collect syrup!
      </p>

      <div className="rainbow-run-hud">
        <div>Score: {String(score).padStart(3, "0")}</div>
        <div>Hearts: {"💛".repeat(hearts)}</div>

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
        <p className="rainbow-run-message win">Pancake made it up the path!</p>
      )}

      {status === "lost" && (
        <p className="rainbow-run-message lost">The garden path got too wild!</p>
      )}
    </div>
  );
}