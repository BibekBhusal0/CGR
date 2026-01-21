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
      let { width } = boardParentRef.current.getBoundingClientRect();
      width -= 10;
      const height = window.innerHeight - 60;
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
        "flex size-full justify-center px-2 lg:justify-end lg:px-0",
        sidebarCollapsed ? "basis-7/12" : "basis-6/12 lg:basis-5/12"
      )}>
      <Card className="flex px-1 md:px-4" style={{ width: cardSize, height: (cardSize || 0) + 30 }}>
        <div className="relative flex size-full gap-1">
          <EvalBar />
          <div className="flex size-full flex-col">
            <Player position="top" />
            <div className="shrink">
              <JustBoard />
            </div>
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

  return <div className="shrink py-2 pl-6 lg:text-2xl ">{name || ""}</div>;
};

export default FullBoard;
