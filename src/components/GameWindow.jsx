import CakeMatcher from "../games/CakeMatcher";
import BobaCatch from "../games/BobaCatch";
import RainbowRun from "../games/RainbowRun";
import PancakePanic from "../games/PancakePanic";
import MagicArt from "../games/MagicArt";
import LolasBakingBonanza from "../games/LolasBakingBonanza";
import ErrorBoundary from "./ErrorBoundary";

const games = {
  "cake-matcher": CakeMatcher,
  "boba-catch": BobaCatch,
  "rainbow-run": RainbowRun,
  "pancake-panic": PancakePanic,
  "magic-art": MagicArt,
  "lolas-baking-bonanza": LolasBakingBonanza,
};

export default function GameWindow({ gameId, onClose }) {
  if (!gameId) return null;

  const GameComponent = games[gameId];

  return (
    <div className="game-window-backdrop">
      <div className="game-window">
        <button type="button" className="game-window-close" onClick={onClose}>
          ✕
        </button>

        <ErrorBoundary key={gameId}>
          {GameComponent ? (
            <GameComponent onBack={onClose} />
          ) : (
            <div className="coming-soon-game">
              <h1>Coming Soon!</h1>
              <p>This adventure is being built.</p>
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}