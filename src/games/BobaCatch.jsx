import { useEffect, useRef, useState } from "react";
import { playSound } from "../utils/audio";

const GAME_WIDTH = 720;
const GAME_HEIGHT = 520;
const PLAYER_WIDTH = 90;
const PLAYER_HEIGHT = 110;
const BOBA_SIZE = 38;
const BASE_SPEED = 1.25;
const SPEED_STEP_EVERY = 10;
const SPEED_INCREASE_PER_STEP = 0.01;

function makeBoba(score = 0) {
  const speedMultiplier =
    0.5 + Math.floor(score / SPEED_STEP_EVERY) * SPEED_INCREASE_PER_STEP;

  return {
    id: crypto.randomUUID(),
    x: Math.random() * (GAME_WIDTH - BOBA_SIZE),
    y: -BOBA_SIZE,
    speed: BASE_SPEED * speedMultiplier + Math.random() * 0.8,
  };
}

export default function BobaCatch({ onBack }) {
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [bobas, setBobas] = useState([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [playerState, setPlayerState] = useState("idle");
  const [hasLost, setHasLost] = useState(false);

  const keys = useRef({ left: false, right: false });

  function restartGame() {
    playSound("start", 0.35);

    setPlayerX(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
    setBobas([]);
    setScore(0);
    setMisses(0);
    setPlayerState("idle");
    setHasLost(false);
  }

  useEffect(() => {
    playSound("start", 0.35);
  }, []);

  useEffect(() => {
    if (misses >= 5 && !hasLost) {
      playSound("lose", 0.55);
      setHasLost(true);
    }
  }, [misses, hasLost]);

  useEffect(() => {
    function keyDown(e) {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        keys.current.left = true;
      }

      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        keys.current.right = true;
      }
    }

    function keyUp(e) {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        keys.current.left = false;
      }

      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        keys.current.right = false;
      }
    }

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, []);

  useEffect(() => {
    if (hasLost) return;

    const spawnTimer = setInterval(() => {
      setBobas((current) => [...current, makeBoba(score)]);
    }, 850);

    return () => clearInterval(spawnTimer);
  }, [score, hasLost]);

  useEffect(() => {
    if (hasLost) return;

    const gameLoop = setInterval(() => {
      setPlayerX((x) => {
        let next = x;
        let state = "idle";

        if (keys.current.left) {
          next -= 12;
          state = "move-left";
        }

        if (keys.current.right) {
          next += 12;
          state = "move-right";
        }

        setPlayerState(state);

        return Math.max(0, Math.min(GAME_WIDTH - PLAYER_WIDTH, next));
      });

      setBobas((current) => {
        const nextBobas = [];
        let caught = 0;
        let missed = 0;

        current.forEach((boba) => {
          const nextY = boba.y + boba.speed;

          const playerTop = GAME_HEIGHT - PLAYER_HEIGHT - 18;
          const playerLeft = playerX;
          const playerRight = playerX + PLAYER_WIDTH;

          const bobaCenterX = boba.x + BOBA_SIZE / 2;
          const bobaBottom = nextY + BOBA_SIZE;

          const isCaught =
            bobaBottom >= playerTop &&
            bobaCenterX >= playerLeft &&
            bobaCenterX <= playerRight;

          if (isCaught) {
            caught += 1;
            return;
          }

          if (nextY > GAME_HEIGHT) {
            missed += 1;
            return;
          }

          nextBobas.push({ ...boba, y: nextY });
        });

        if (caught > 0) {
          playSound("collect", 0.4);

          setScore((currentScore) => {
            const nextScore = currentScore + caught;

            if (
              Math.floor(currentScore / SPEED_STEP_EVERY) <
              Math.floor(nextScore / SPEED_STEP_EVERY)
            ) {
              playSound("boost", 0.35);
            }

            return nextScore;
          });

          setPlayerState("happy");

          setTimeout(() => {
            setPlayerState("idle");
          }, 350);
        }

        if (missed > 0) {
          playSound("bash", 0.3);
          setMisses((m) => m + missed);
        }

        return nextBobas;
      });
    }, 30);

    return () => clearInterval(gameLoop);
  }, [playerX, hasLost]);

  const gameOver = misses >= 5;

  return (
    <section className="boba-catch">
      <div className="boba-game-header">
        <div>
          <h1>Boba Catch</h1>
          <p>Move left and right to catch the falling boba pearls!</p>
        </div>

        <div className="boba-game-actions">
          <span>Score: {score}</span>
          <span>Misses: {misses}/5</span>

          <button type="button" onClick={restartGame}>
            Restart
          </button>

          {onBack && (
            <button
              type="button"
              onClick={() => {
                playSound("button", 0.35);
                onBack();
              }}
            >
              Back
            </button>
          )}
        </div>
      </div>

      <div className="boba-stage">
        {bobas.map((boba) => (
          <div
            key={boba.id}
            className="falling-boba"
            style={{
              left: `${(boba.x / GAME_WIDTH) * 100}%`,
              top: `${(boba.y / GAME_HEIGHT) * 100}%`,
            }}
          />
        ))}

        <div
          className={`boba-player ${playerState}`}
          style={{
            left: `${(playerX / GAME_WIDTH) * 100}%`,
          }}
        />

        {gameOver && (
          <div className="boba-game-over">
            <h2>Game Over!</h2>
            <p>You caught {score} boba pearls.</p>

            <button type="button" onClick={restartGame}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}