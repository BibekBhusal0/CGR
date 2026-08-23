import { Card } from "@heroui/react";
import { FC } from "react";
import EvalBar from "@/app/full_board/evalbar";
import JustBoard from "@/app/full_board/customBoard";
import { useGameState } from "@/Logic/state/game";
import { useEffect, useState } from "react";
import { useSettingsState } from "@/Logic/state/settings";
import { cn } from "@heroui/react";

function FullBoard() {
  const sidebarCollapsed = useSettingsState((state) => state.sidebarCollapsed);
  const evalBar = useSettingsState((state) => state.evalBar);
  const [cardSize, setCardSize] = useState<number>(0);

  const updateSize = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate available width based on flex basis
    // basis-7/12 when collapsed, basis-6/12 or basis-5/12 when expanded (responsive)
    let containerWidth;
    if (sidebarCollapsed) {
      containerWidth = (viewportWidth * 7) / 12;
    } else {
      // basis-6/12 on mobile, basis-5/12 on large screens
      containerWidth = viewportWidth >= 1024 ? (viewportWidth * 5) / 12 : (viewportWidth * 6) / 12;
    }

    const size = Math.min(containerWidth - 30, viewportHeight - 100);
    setCardSize(size);
  };

  useEffect(() => {
    updateSize();
  }, [sidebarCollapsed]);

  useEffect(() => {
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className={cn(
        "flex size-full justify-center px-2 lg:justify-end lg:px-0",
        sidebarCollapsed ? "basis-7/12" : "basis-6/12 lg:basis-5/12"
      )}>
      <Card
        className="flex px-1 md:px-4"
        style={{ width: cardSize + (evalBar ? 30 : 0), height: cardSize + 92 }}>
        <div className="relative flex size-full gap-1">
          {evalBar && <EvalBar />}
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

  return <div className="shrink py-2 pl-6 lg:text-2xl">{name || ""}</div>;
};

export default FullBoard;
