import { Card } from "@heroui/card";
import { FC } from "react";
import EvalBar from "@/app/full_board/evalbar";
import JustBoard from "@/app/full_board/customBoard";
import { useGameState } from "@/Logic/state/game";
import { useEffect, useRef, useState } from "react";
import { useSettingsState } from "@/Logic/state/settings";
import { cn } from "@heroui/theme";

function FullBoard() {
  const sidebarCollapsed = useSettingsState((state) => state.sidebarCollapsed);
  const boardParentRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState<number | undefined>();

  useEffect(() => {
    const element = boardParentRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      if (!boardParentRef.current) return;
      const { width, height } = boardParentRef.current.getBoundingClientRect();
      const size = Math.min(width, height);
      setCardSize(size);
    });

    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  return (
    <div
      ref={boardParentRef}
      className={cn(
        "flex size-full items-center justify-center bg-red-400 px-2 lg:px-0", // Centering the card
        sidebarCollapsed ? "basis-7/12" : "basis-6/12 lg:basis-5/12"
      )}>
      <Card className="flex flex-col p-1 md:p-4" style={{ width: cardSize, height: cardSize }}>
        <div className="relative flex size-full gap-1">
          <EvalBar />
          <div className="size-full">
            <Player position="top" />
            <JustBoard />
            <Player position="bottom" />
          </div>
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
  const name =
    (position === "bottom" && bottom === "white") || (position === "top" && bottom === "black")
      ? whitePlayer
      : blackPlayer;

  return <div className="py-2 pl-6 text-2xl">{name || ""}</div>;
};

export default FullBoard;
