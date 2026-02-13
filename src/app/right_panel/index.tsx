import { Card } from "@heroui/card";
import { Input } from "@/app/right_panel/input";
import Summary from "@/app/right_panel/summary";
import Moves from "@/app/right_panel/moves";
import { useGameState } from "@/Logic/state/game";
import { useSettingsState } from "@/Logic/state/settings";
import { PerMoveAnalysis } from "@/app/right_panel/perMoveAnalysis";

function RightPanel() {
  const stage = useGameState((state) => state.stage);
  const analyzePerMove = useSettingsState((state) => state.analyzePerMove);

  return (
    <Card
      style={{ position: "unset" }}
      classNames={{
        base: "max-h-[650px]",
        footer: "overflow-visible",
        body: "overflow-auto",
        header: "overflow-visible",
      }}>
      {stage === "first" ? (
        <Input />
      ) : analyzePerMove ? (
        <PerMoveAnalysis />
      ) : (
        <>
          {stage === "second" && <Summary />}
          {stage === "third" && <Moves />}
        </>
      )}
    </Card>
  );
}
export default RightPanel;
