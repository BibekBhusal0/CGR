import { Card } from "@heroui/react";
import { FC } from "react";
import EvalBar from "@/app/full_board/evalbar";
import JustBoard from "@/app/full_board/customBoard";
import { useGameState } from "@/Logic/state/game";
import { getMaterialSurplus } from "@/Logic/pieces";
import { formatClock, getClocksAtIndex } from "@/Logic/clocks";
import { base_path } from "@/app/full_board/customBoard";
import { useEffect, useState } from "react";
import { useSettingsState } from "@/Logic/state/settings";
import { cn } from "@heroui/react";

export const LG_BREAKPOINT = 1024;

export function computeBoardSize(
  viewportWidth: number,
  viewportHeight: number,
  sidebarCollapsed: boolean
): number {
  let containerWidth: number;
  if (viewportWidth < LG_BREAKPOINT) {
    containerWidth = viewportWidth;
  } else if (sidebarCollapsed) {
    containerWidth = (viewportWidth * 7) / 12;
  } else {
    containerWidth = (viewportWidth * 5) / 12;
  }

  const size = Math.min(containerWidth - 30, viewportHeight - 100);
  return Math.max(0, size);
}

function FullBoard() {
  const sidebarCollapsed = useSettingsState((state) => state.sidebarCollapsed);
  const evalBar = useSettingsState((state) => state.evalBar);
  const [cardSize, setCardSize] = useState<number>(() =>
    computeBoardSize(
      typeof window === "undefined" ? 1024 : window.innerWidth,
      typeof window === "undefined" ? 800 : window.innerHeight,
      sidebarCollapsed
    )
  );

  useEffect(() => {
    const updateSize = () => {
      setCardSize(computeBoardSize(window.innerWidth, window.innerHeight, sidebarCollapsed));
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [sidebarCollapsed]);

  return (
    <div
      className={cn(
        "flex w-full justify-center px-2 lg:size-full lg:justify-end lg:px-0",
        sidebarCollapsed ? "lg:basis-7/12" : "lg:basis-5/12"
      )}>
      <Card
        className="flex px-1 md:px-4"
        style={{ width: cardSize + (evalBar ? 30 : 0), height: cardSize + 92 }}>
        <div className="flex size-full flex-col">
          <Player position="top" />
          <div className="flex gap-1">
            {evalBar && <EvalBar />}
            <div className="min-w-0 flex-1">
              <JustBoard />
            </div>
          </div>
          <Player position="bottom" />
        </div>
      </Card>
    </div>
  );
}
type playerProps = { position: "top" | "bottom" };

const Player: FC<playerProps> = ({ position }) => {
  const whitePlayer = useGameState((state) => state.whitePlayer);
  const blackPlayer = useGameState((state) => state.blackPlayer);
  const bottom = useGameState((state) => state.bottom);
  const fen = useGameState((state) => state.fen);
  const moveIndex = useGameState((state) => state.moveIndex);
  const clocks = useGameState((state) => state.clocks);
  const theme = useSettingsState((state) => state.theme);

  const isWhite =
    (position === "bottom" && bottom === "white") || (position === "top" && bottom === "black");
  const name = isWhite ? whitePlayer : blackPlayer;

  const { white: whiteClock, black: blackClock } = getClocksAtIndex(clocks, moveIndex);
  const rawClock = isWhite ? whiteClock : blackClock;

  const surplus = getMaterialSurplus(fen);
  const extraPieces = isWhite ? surplus.w : surplus.b;
  const net = isWhite ? surplus.diff : -surplus.diff;

  return (
    <div className="flex shrink items-center justify-between gap-2 py-2 pr-2 pl-6 lg:text-2xl">
      <div className="min-w-0 truncate">{name || ""}</div>
      <div className="flex shrink-0 items-center gap-2 text-sm lg:text-base">
        {extraPieces.length > 0 && (
          <span
            className="text-foreground flex items-center opacity-60"
            title={`Up ${extraPieces.length} piece(s)`}>
            {extraPieces.map((piece, i) => (
              <img
                key={`${piece}-${i}`}
                className="silhouette -ml-1 size-5 first:ml-0"
                src={`${base_path}/${theme.toLowerCase()}/${isWhite ? "w" : "b"}${piece.toUpperCase()}.svg`}
                alt={piece}
              />
            ))}
            {net > 0 && <span className="ml-0.5 font-mono text-xs font-semibold">+{net}</span>}
          </span>
        )}
        {rawClock && (
          <span className="bg-default rounded-md px-1.5 py-0.5 font-mono" title="Time remaining">
            {formatClock(rawClock)}
          </span>
        )}
      </div>
    </div>
  );
};

export default FullBoard;
