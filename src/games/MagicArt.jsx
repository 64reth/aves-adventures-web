import { useRef, useState } from "react";
import { playSound } from "../utils/audio";

const COLORS = [
  "#f23b91",
  "#7c3aed",
  "#38bdf8",
  "#22c55e",
  "#facc15",
  "#fb923c",
  "#111827",
  "#ffffff",
];

const STAMPS = ["⭐", "💖", "🌈", "✨", "🧁", "🧋", "🥞", "🐱"];

export default function MagicArt() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPoint = useRef(null);

  const [color, setColor] = useState("#f23b91");
  const [size, setSize] = useState(10);
  const [tool, setTool] = useState("brush");
  const [stamp, setStamp] = useState("⭐");

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;

    return {
      x: ((source.clientX - rect.left) / rect.width) * canvas.width,
      y: ((source.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (event) => {
    event.preventDefault();

    const point = getPoint(event);

    if (tool === "stamp") {
      const ctx = canvasRef.current.getContext("2d");
      ctx.font = `${size * 4}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(stamp, point.x, point.y);
      playSound("select", 0.25);
      return;
    }

    drawing.current = true;
    lastPoint.current = point;
    playSound("button", 0.15);
  };

  const draw = (event) => {
    if (!drawing.current || tool === "stamp") return;
    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const point = getPoint(event);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = size;
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;

    if (tool === "sparkle") {
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 16;
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    if (tool === "sparkle" && Math.random() > 0.65) {
      ctx.shadowBlur = 0;
      ctx.font = `${size * 2}px serif`;
      ctx.fillText("✨", point.x, point.y);
    }

    lastPoint.current = point;
  };

  const stopDrawing = () => {
    drawing.current = false;
    lastPoint.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    playSound("bash", 0.25);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");

    playSound("win", 0.25);
    link.download = "aves-magic-art.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const fillBackground = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    playSound("ok", 0.25);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <section className="magic-art-game">
      <div className="magic-art-header">
        <div>
          <h1>Zara’s Magic Art Studio</h1>
          <p>Draw, stamp, sparkle and save your masterpiece!</p>
        </div>

        <div className="magic-art-actions">
          <button type="button" onClick={clearCanvas}>
            Clear
          </button>
          <button type="button" onClick={fillBackground}>
            Fill
          </button>
          <button type="button" onClick={saveImage}>
            Save PNG
          </button>
        </div>
      </div>

      <div className="magic-art-layout">
        <aside className="magic-art-toolbar">
          <h3>Tools</h3>

          <button
            type="button"
            className={tool === "brush" ? "active" : ""}
            onClick={() => {
              playSound("button", 0.25);
              setTool("brush");
            }}
          >
            🖌 Brush
          </button>

          <button
            type="button"
            className={tool === "sparkle" ? "active" : ""}
            onClick={() => {
              playSound("button", 0.25);
              setTool("sparkle");
            }}
          >
            ✨ Sparkle
          </button>

          <button
            type="button"
            className={tool === "eraser" ? "active" : ""}
            onClick={() => {
              playSound("button", 0.25);
              setTool("eraser");
            }}
          >
            🧽 Eraser
          </button>

          <button
            type="button"
            className={tool === "stamp" ? "active" : ""}
            onClick={() => {
              playSound("button", 0.25);
              setTool("stamp");
            }}
          >
            ⭐ Stamp
          </button>

          <label>
            Brush Size
            <input
              type="range"
              min="4"
              max="34"
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
            />
          </label>

          <h3>Colours</h3>

          <div className="magic-colors">
            {COLORS.map((item) => (
              <button
                key={item}
                type="button"
                className={color === item ? "active" : ""}
                style={{ background: item }}
                onClick={() => {
                  playSound("select", 0.2);
                  setColor(item);
                }}
                aria-label={`Choose ${item}`}
              />
            ))}
          </div>

          <h3>Stamps</h3>

          <div className="magic-stamps">
            {STAMPS.map((item) => (
              <button
                key={item}
                type="button"
                className={stamp === item ? "active" : ""}
                onClick={() => {
                  playSound("select", 0.2);
                  setStamp(item);
                  setTool("stamp");
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </aside>

        <div className="magic-art-canvas-wrap">
          <canvas
            ref={canvasRef}
            width="900"
            height="560"
            className="magic-art-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      </div>
    </section>
  );
}