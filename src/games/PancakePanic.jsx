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
      game.obstacles.push({
        x: 170 + Math.random() * 330,
        y: -60,
        w: 50,
        h: 50,
        type: Math.random() > 0.5 ? "🪨" : "🌵",
      });
    };

    const spawnSyrup = () => {
      game.syrup.push({
        x: 180 + Math.random() * 320,
        y: -40,
        r: 18,
      });
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

      game.frame++;
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
        if (game.invincible === 0 && rectHit(game.player, obs)) {
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
        if (!drop.collected && circleHit(game.player, drop)) {
          drop.collected = true;
          game.score += 5;
          setScore(game.score);

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

      game.obstacles = game.obstacles.filter((o) => o.y < canvas.height + 80);
      game.syrup = game.syrup.filter((s) => s.y < canvas.height + 60 && !s.collected);
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

    const drawPlayer = () => {
      const p = game.player;

      ctx.save();

      if (game.invincible > 0 && Math.floor(game.frame / 5) % 2 === 0) {
        ctx.globalAlpha = 0.45;
      }

      ctx.font = "76px sans-serif";
      ctx.fillText("🥞", p.x, p.y + 70);

      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBackground();

      for (const drop of game.syrup) {
        ctx.font = "34px sans-serif";
        ctx.fillText("🍯", drop.x, drop.y);
      }

      for (const obs of game.obstacles) {
        ctx.font = "42px sans-serif";
        ctx.fillText(obs.type, obs.x, obs.y);
      }

      drawPlayer();

      ctx.font = "bold 28px sans-serif";
ctx.fillStyle = "#ffffff";
ctx.strokeStyle = "#3b2a4a";
ctx.lineWidth = 4;

ctx.strokeText(`Score: ${Math.floor(game.score)}`, 24, 40);
ctx.fillText(`Score: ${Math.floor(game.score)}`, 24, 40);

ctx.strokeText(`Hearts: ${"💛".repeat(game.hearts)}`, 210, 40);
ctx.fillText(`Hearts: ${"💛".repeat(game.hearts)}`, 210, 40);

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
        <div>Score: {score}</div>
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