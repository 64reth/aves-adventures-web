import { useEffect, useRef, useState } from "react";
import { playSound } from "../utils/audio";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 540;

const LANES = [{ y: 135 }, { y: 230 }, { y: 325 }, { y: 420 }];

const LOLA_X = 170;
const OVEN_X = 72;
const TABLE_START_X = 210;
const CUSTOMER_X = 765;

const SERVE_SPEED = 8;
const PLATE_SPEED = 1.2;
const PLATE_RETURN_DELAY = 300;

const TREATS = [
  { id: "cupcake", emoji: "🧁", label: "Cupcake" },
  { id: "cake", emoji: "🍰", label: "Cake" },
  { id: "donut", emoji: "🍩", label: "Donut" },
  { id: "cookie", emoji: "🍪", label: "Cookie" },
];

const CUSTOMER_TYPES = ["ave", "adam", "zara", "bobby"];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function makeCustomer(lane, level) {
  const treat = randomItem(TREATS);
  const maxPatience = Math.max(50, 120 - level * 6);

  return {
    id: crypto.randomUUID(),
    lane,
    character: randomItem(CUSTOMER_TYPES),
    treat,
    patience: maxPatience,
    maxPatience,
// When spawnin
    scale: 0,
  };
}

function makeOvenSet() {
  return TREATS.map((treat, lane) => ({
    id: crypto.randomUUID(),
    lane,
    treat,
    ready: true,
  }));
}

export default function LolasBakingBonanza({ onBack }) {
  const canvasRef = useRef(null);
  const keys = useRef({});
  const gameRef = useRef(null);
  const bgRef = useRef(null);
  const lolaRef = useRef(null);

  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(0);
  const [status, setStatus] = useState("playing");
  const [laneDisplay, setLaneDisplay] = useState(1);
  const [holding, setHolding] = useState(null);

  useEffect(() => {
    playSound("start", 0.35);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const bg = new Image();
bg.src = "/assets/backgrounds/lolas-bakery-bg.png";
bgRef.current = bg;

const lola = new Image();
lola.src = "/assets/characters/lola/lola-sprite-sheet.png";
lolaRef.current = lola;

const bench = new Image();
bench.src = "/assets/games/lola-baking/bench-lane.png";

const oven = new Image();
oven.src = "/assets/games/lola-baking/oven.png";

const foodImages = {
  cupcake: new Image(),
  cake: new Image(),
  donut: new Image(),
  cookie: new Image(),
};

foodImages.cupcake.src = "/assets/games/lola-baking/cupcake.png";
foodImages.cake.src = "/assets/games/lola-baking/cake-slice.png";
foodImages.donut.src = "/assets/games/lola-baking/donut.png";
foodImages.cookie.src = "/assets/games/lola-baking/cookie.png";

const plateImg = new Image();
plateImg.src = "/assets/games/lola-baking/empty-plate.png";

    const game = {
      frame: 0,
      score: 0,
      hearts: 3,
      combo: 0,
      level: 1,
      status: "playing",
      hasEnded: false,
      selectedLane: 0,
      facing: "right",
      inputLocks: {
        up: false,
        down: false,
        left: false,
        right: false,
      },
      feedbackText: "",
      feedbackTimer: 0,
      carrying: null,
      ovens: makeOvenSet(),
      customers: [makeCustomer(0, 1)],
      servedItems: [],
      plates: [],
    };

    const customerImages = {
  ave: new Image(),
  adam: new Image(),
  zara: new Image(),
  bobby: new Image(),
};

customerImages.ave.src = "/assets/characters/ave/ave-icon.png";
customerImages.adam.src = "/assets/characters/adam/adam-icon.png";
customerImages.zara.src = "/assets/characters/zara/zara-icon.png";
customerImages.bobby.src = "/assets/characters/bobby/bobby-icon.png";

    gameRef.current = game;

    const setFeedback = (text) => {
      game.feedbackText = text;
      game.feedbackTimer = 70;
    };

    const endGame = (nextStatus) => {
      if (game.hasEnded) return;

      game.hasEnded = true;
      game.status = nextStatus;
      setStatus(nextStatus);
      playSound(nextStatus === "won" ? "win" : "gameOver", 0.6);
    };

    const loseHeart = (message = "Oops!") => {
      game.hearts -= 1;
      game.combo = 0;

      setHearts(Math.max(0, game.hearts));
      setCombo(0);
      setFeedback(message);
      playSound("bash", 0.35);

      if (game.hearts <= 0) {
        endGame("lost");
      }
    };

    const spawnCustomer = () => {
      const occupied = new Set(game.customers.map((c) => c.lane));
      const emptyLanes = LANES.map((_, index) => index).filter(
        (lane) => !occupied.has(lane)
      );

      if (emptyLanes.length === 0) return;

      const lane = randomItem(emptyLanes);
      game.customers.push(makeCustomer(lane, game.level));
    };

    const refreshOven = (lane) => {
      game.ovens[lane] = {
        id: crypto.randomUUID(),
        lane,
        treat: TREATS[lane],
        ready: true,
      };
    };

    const collectFromOven = () => {
      const lane = game.selectedLane;
      const oven = game.ovens[lane];

      game.facing = "left";

      if (game.carrying) {
        playSound("bash", 0.2);
        setFeedback("Hands full!");
        return;
      }

      if (!oven?.ready) {
        playSound("bash", 0.2);
        setFeedback("Oven empty!");
        return;
      }

      game.carrying = oven.treat;
      setHolding(oven.treat);
      game.ovens[lane] = null;

      playSound("select", 0.3);
      setFeedback(`Collected ${oven.treat.emoji}`);

      setTimeout(() => {
        const current = gameRef.current;
        if (!current || current.status !== "playing") return;
        refreshOven(lane);
      }, 900 + Math.random() * 900);
    };

    const clearPlate = (plate) => {
      game.facing = "right";
      game.plates = game.plates.filter((item) => item.id !== plate.id);

      game.score += 5;
      setScore(game.score);

      playSound("ok", 0.28);
      setFeedback("Plate cleared! +5");
    };

    const serveToCustomer = () => {
      const lane = game.selectedLane;

      game.facing = "right";

      const nearPlate = game.plates.find(
        (item) => item.lane === lane && Math.abs(item.x - LOLA_X) < 80
      );

      if (nearPlate) {
        clearPlate(nearPlate);
        return;
      }

      if (!game.carrying) {
        playSound("bash", 0.2);
        setFeedback("No treat!");
        return;
      }

      const alreadyServing = game.servedItems.some((item) => item.lane === lane);

      if (alreadyServing) {
        playSound("bash", 0.2);
        setFeedback("Wait!");
        return;
      }

      game.servedItems.push({
        id: crypto.randomUUID(),
        lane,
        x: TABLE_START_X,
        y: LANES[lane].y,
        treat: game.carrying,
      });

      playSound("shoot", 0.35);
      setFeedback(`Sent ${game.carrying.emoji}`);

      game.carrying = null;
      setHolding(null);
    };

    const moveLane = (direction) => {
      const nextLane = Math.max(
        0,
        Math.min(LANES.length - 1, game.selectedLane + direction)
      );

      if (nextLane !== game.selectedLane) {
        game.selectedLane = nextLane;
        setLaneDisplay(nextLane + 1);
        playSound("select", 0.18);
      }
    };

    const updateInput = () => {
      const upPressed = keys.current.ArrowUp || keys.current.w;
      const downPressed = keys.current.ArrowDown || keys.current.s;
      const leftPressed = keys.current.ArrowLeft || keys.current.a;
      const rightPressed = keys.current.ArrowRight || keys.current.d;

      if (upPressed && !game.inputLocks.up) {
        moveLane(-1);
        game.inputLocks.up = true;
      }

      if (downPressed && !game.inputLocks.down) {
        moveLane(1);
        game.inputLocks.down = true;
      }

      if (leftPressed && !game.inputLocks.left) {
        collectFromOven();
        game.inputLocks.left = true;
      }

      if (rightPressed && !game.inputLocks.right) {
        serveToCustomer();
        game.inputLocks.right = true;
      }

      if (!upPressed) game.inputLocks.up = false;
      if (!downPressed) game.inputLocks.down = false;
      if (!leftPressed) game.inputLocks.left = false;
      if (!rightPressed) game.inputLocks.right = false;
    };

    const updateCustomers = () => {
  game.customers = game.customers.filter((customer) => {
    // 👇 POP-IN ANIMATION
    customer.scale = Math.min(1, customer.scale + 0.08);

    customer.patience -= 0.06 + game.level * 0.012;

    if (customer.patience > 0) return true;

    loseHeart("Customer left!");
    return false;
  });
};

    const updateServedItems = () => {
      for (const item of game.servedItems) {
        item.x += SERVE_SPEED + game.level * 0.25;
      }

      game.servedItems = game.servedItems.filter((item) => {
        const customer = game.customers.find((c) => c.lane === item.lane);

        if (customer && item.x >= CUSTOMER_X - 45) {
          if (customer.treat.id === item.treat.id) {
            const nextCombo = game.combo + 1;
            const points = 10 + nextCombo * 2;

            game.combo = nextCombo;
            game.score += points;
            game.level = 1 + Math.floor(game.score / 90);

            setScore(game.score);
            setCombo(game.combo);

            game.customers = game.customers.filter((c) => c.id !== customer.id);

            game.plates.push({
  id: crypto.randomUUID(),
  lane: item.lane,
  x: CUSTOMER_X - 35,
  y: LANES[item.lane].y,
  waitTimer: PLATE_RETURN_DELAY,
});

            setFeedback(`Correct! +${points}`);
            playSound("ok", 0.4);

            if (game.score >= 350) {
              endGame("won");
            }
          } else {
            game.combo = 0;
            setCombo(0);
            customer.patience = Math.max(0, customer.patience - 30);
            setFeedback("Wrong order!");
            playSound("bash", 0.35);
          }

          return false;
        }

        if (item.x > CANVAS_WIDTH + 80) {
          game.combo = 0;
          setCombo(0);
          setFeedback("Cake slid away!");
          playSound("bash", 0.25);
          return false;
        }

        return true;
      });
    };

    const updatePlates = () => {
  for (const plate of game.plates) {
    if (plate.waitTimer > 0) {
      plate.waitTimer -= 1;
      continue;
    }

    plate.x -= PLATE_SPEED + game.level * 0.06;
  }

  game.plates = game.plates.filter((plate) => {
    if (plate.x > LOLA_X - 70) return true;

    loseHeart("Plate crashed!");
    return false;
  });
};

    const update = () => {
      if (game.status !== "playing") return;

      game.frame += 1;
      game.feedbackTimer = Math.max(0, game.feedbackTimer - 1);

      updateInput();

      if (game.frame % Math.max(80, 160 - game.level * 9) === 0) {
        spawnCustomer();
      }

      updateCustomers();
      updateServedItems();
      updatePlates();
    };

    const drawRoundedRect = (x, y, w, h, r, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
    };

    const getLanePrompt = () => {
      const lane = game.selectedLane;
      const oven = game.ovens[lane];
      const nearPlate = game.plates.find(
        (item) => item.lane === lane && Math.abs(item.x - LOLA_X) < 80
      );

      if (nearPlate) return "→ Clear plate";
      if (game.carrying) return `→ Serve ${game.carrying.emoji}`;
      if (oven?.ready) return `← Collect ${oven.treat.emoji}`;
      return "Oven warming...";
    };

    const drawBackground = () => {
      const bgImg = bgRef.current;

      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      } else {
        ctx.fillStyle = "#ffe4f1";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      ctx.fillStyle = "rgba(255, 248, 252, 0.72)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };

const drawImageAsset = (img, fallback, x, y, w, h) => {
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, x, y, w, h);
  } else {
    ctx.font = `${Math.floor(h * 0.8)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fallback, x + w / 2, y + h / 2);
  }
};

const drawOvens = () => {
  for (let i = 0; i < LANES.length; i++) {
    const lane = LANES[i];
    const ovenItem = game.ovens[i];
    const isSelected = i === game.selectedLane;

    ctx.save();

    if (isSelected) {
      drawRoundedRect(OVEN_X - 64, lane.y - 56, 128, 112, 24, "rgba(242,59,145,0.25)");
    }

    drawImageAsset(oven, "🔥", OVEN_X - 58, lane.y - 46, 116, 92);

    if (ovenItem?.treat) {
      const img = foodImages[ovenItem.treat.id];
      drawImageAsset(img, ovenItem.treat.emoji, OVEN_X - 18, lane.y - 24, 36, 36);
    } else {
      ctx.font = "22px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("⏳", OVEN_X, lane.y - 6);
    }

    ctx.restore();
  }
};

const drawTables = () => {
  for (let i = 0; i < LANES.length; i++) {
    const lane = LANES[i];
    const isSelected = i === game.selectedLane;

    if (isSelected) {
      drawRoundedRect(
        TABLE_START_X - 10,
        lane.y - 40,
        CUSTOMER_X - TABLE_START_X + 74,
        80,
        24,
        "rgba(124,58,237,0.2)"
      );
    }

    drawImageAsset(
      bench,
      "",
      TABLE_START_X - 6,
      lane.y - 34,
      CUSTOMER_X - TABLE_START_X + 68,
      68
    );

    ctx.fillStyle = "#5b316b";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Table ${i + 1}`, TABLE_START_X + 10, lane.y - 42);
  }
};

const drawLola = () => {
  const y = LANES[game.selectedLane].y;
  const img = lolaRef.current;

  const cols = 3;
  const rows = 2;
  const drawW = 96;
  const drawH = 116;
  const drawX = LOLA_X - 46;
  const drawY = y - 76;

  let frame = 0;

  if (game.facing === "left") frame = 3;
  if (game.facing === "right") frame = 4;
  if (game.feedbackText.includes("Collected")) frame = 3;
  if (game.feedbackText.includes("Sent")) frame = 4;
  if (game.feedbackText.includes("Wrong") || game.feedbackText.includes("crashed")) frame = 5;

  ctx.save();

 if (img && img.complete && img.naturalWidth > 0) {
  const frameWidth = img.width / cols;
  const frameHeight = img.height / rows;
  const frameX = frame % cols;
  const frameY = Math.floor(frame / cols);

  if (game.facing === "left") {
    ctx.translate(drawX + drawW / 2, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(
      img,
      frameX * frameWidth,
      frameY * frameHeight,
      frameWidth,
      frameHeight,
      -drawW / 2,
      drawY,
      drawW,
      drawH
    );
  } else {
    ctx.drawImage(
      img,
      frameX * frameWidth,
      frameY * frameHeight,
      frameWidth,
      frameHeight,
      drawX,
      drawY,
      drawW,
      drawH
    );
  }
}
  else {
    ctx.font = "72px serif";
    ctx.fillText("👩🏽‍🍳", LOLA_X - 30, y + 20);
  }

  ctx.restore();

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  drawRoundedRect(LOLA_X - 70, y - 130, 140, 36, 18, "rgba(255,255,255,0.96)");

  ctx.font = "bold 18px sans-serif";
  ctx.fillStyle = "#7c3aed";
  ctx.fillText(getLanePrompt(), LOLA_X, y - 112);

  ctx.font = "32px serif";
  ctx.fillText(game.facing === "left" ? "⬅️" : "➡️", LOLA_X, y + 60);

  if (game.carrying) {
    drawRoundedRect(LOLA_X - 30, y - 172, 60, 46, 16, "rgba(255,255,255,0.96)");
    drawImageAsset(foodImages[game.carrying.id], game.carrying.emoji, LOLA_X - 22, y - 166, 44, 38);
  }

  ctx.restore();
};

const drawServedItems = () => {
  for (const item of game.servedItems) {
    drawImageAsset(
      foodImages[item.treat.id],
      item.treat.emoji,
      item.x - 24,
      item.y - 34,
      48,
      48
    );
  }
};

const drawPlates = () => {
  for (const plate of game.plates) {
    drawImageAsset(plateImg, "🍽️", plate.x - 24, plate.y - 28, 48, 38);

    if (plate.waitTimer > 0) {
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#5b316b";
      ctx.fillText("waiting", plate.x, plate.y + 28);
    }
  }
};

const drawHud = () => {
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = "bold 23px sans-serif";

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#3b2a4a";
  ctx.lineWidth = 4;

  const hud = `Score: ${game.score}   Combo: x${game.combo}   Hearts: ${"💖".repeat(game.hearts)}`;
  ctx.strokeText(hud, 24, 36);
  ctx.fillText(hud, 24, 36);

  ctx.textAlign = "center";
  ctx.font = "bold 20px sans-serif";

  const help = "↑↓ table   ← collect from oven   → serve / clear plate";
  ctx.strokeText(help, CANVAS_WIDTH / 2, 512);
  ctx.fillText(help, CANVAS_WIDTH / 2, 512);

  if (game.feedbackTimer > 0) {
    ctx.font = "bold 34px sans-serif";
    ctx.fillStyle = "#f23b91";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 6;
    ctx.strokeText(game.feedbackText, CANVAS_WIDTH / 2, 80);
    ctx.fillText(game.feedbackText, CANVAS_WIDTH / 2, 80);
  }
};

    const drawEndScreen = () => {
      if (game.status === "playing") return;

      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.textAlign = "center";
      ctx.fillStyle = "#f23b91";
      ctx.font = "bold 52px sans-serif";
      ctx.fillText(
        game.status === "won" ? "Bakery Rush Complete!" : "Bakery Closed!",
        CANVAS_WIDTH / 2,
        220
      );

      ctx.fillStyle = "#5b316b";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText(`Final Score: ${game.score}`, CANVAS_WIDTH / 2, 268);
      ctx.fillText("Press Restart to play again", CANVAS_WIDTH / 2, 310);
    };

   const drawCustomers = () => {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const customer of game.customers) {
    const y = LANES[customer.lane].y;

     ctx.save();

  // 👇 POP SCALE
  ctx.translate(CUSTOMER_X, y);
  ctx.scale(customer.scale, customer.scale);
  ctx.translate(-CUSTOMER_X, -y);

   // Card background (smaller)
drawRoundedRect(CUSTOMER_X - 48, y - 48, 96, 100, 20, "white");

// Character icon (smaller)
drawImageAsset(
  customerImages[customer.character],
  "🙂",
  CUSTOMER_X - 24,
  y - 40,
  48,
  48
);

// Label
ctx.font = "bold 12px sans-serif";
ctx.fillStyle = "#5b316b";
ctx.fillText("Wants", CUSTOMER_X, y + 6);

// Food icon
drawImageAsset(
  foodImages[customer.treat.id],
  customer.treat.emoji,
  CUSTOMER_X - 14,
  y + 10,
  28,
  28
);

// Patience bar
drawRoundedRect(CUSTOMER_X - 36, y + 36, 72, 6, 999, "#ffe3f1");

const patienceWidth =
  (customer.patience / customer.maxPatience) * 72;

drawRoundedRect(
  CUSTOMER_X - 36,
  y + 36,
  Math.max(0, patienceWidth),
  6,
  999,
  customer.patience > 45 ? "#22c55e" : "#f23b91"
);
      ctx.restore();

  }
};

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      drawBackground();
      drawOvens();
      drawTables();
      drawCustomers();
      drawServedItems();
      drawPlates();
      drawLola();
      drawHud();
      drawEndScreen();
    };

    let animationId;

    const loop = () => {
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    };

    const down = (event) => {
      if (
        event.key === " " ||
        event.key === "Enter" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
      ) {
        event.preventDefault();
      }

      keys.current[event.key] = true;
      keys.current[event.key.toLowerCase()] = true;
    };

    const up = (event) => {
      keys.current[event.key] = false;
      keys.current[event.key.toLowerCase()] = false;
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
    playSound("start", 0.35);

    keys.current = {};

    setScore(0);
    setHearts(3);
    setCombo(0);
    setStatus("playing");
    setLaneDisplay(1);
    setHolding(null);

    const game = gameRef.current;
    if (!game) return;

    game.frame = 0;
    game.score = 0;
    game.hearts = 3;
    game.combo = 0;
    game.level = 1;
    game.status = "playing";
    game.hasEnded = false;
    game.selectedLane = 0;
    game.facing = "right";
    game.inputLocks = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    game.feedbackText = "";
    game.feedbackTimer = 0;
    game.carrying = null;
    game.ovens = makeOvenSet();
    game.customers = [makeCustomer(0, 1)];
    game.servedItems = [];
    game.plates = [];
  };

  return (
    <section className="lola-baking-game">
      <div className="lola-baking-header">
        <div>
          <h1>Lola’s Baking Bonanza</h1>
          <p>
            Up/Down picks a table. Left collects from the oven. Right serves or
            clears plates.
          </p>
        </div>

        <div className="lola-baking-actions">
          <span>Table: {laneDisplay}</span>
          <span>Holding: {holding ? holding.emoji : "None"}</span>
          <span>Score: {score}</span>
          <span>Combo: x{combo}</span>
          <span>Hearts: {"💖".repeat(hearts)}</span>

          <button type="button" onClick={restart}>
            Restart
          </button>

          {onBack && (
            <button
              type="button"
              onClick={() => {
                playSound("button", 0.3);
                onBack();
              }}
            >
              Back
            </button>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="lola-baking-canvas" />

      {status !== "playing" && (
        <p className={`rainbow-run-message ${status === "won" ? "win" : "lost"}`}>
          {status === "won"
            ? "Lola served the whole bakery rush!"
            : "The bakery rush got too wild!"}
        </p>
      )}
    </section>
  );
}