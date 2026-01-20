import { Card } from "@heroui/card";
import { Input } from "@/app/right_panel/input";
import Summary from "@/app/right_panel/summary";
import Moves from "@/app/right_panel/moves";
import { useGameState } from "@/Logic/state/game";

function RightPanel() {
  const stage = useGameState((state) => state.stage);

  return (
    <Card
      classNames={{
        base: "max-h-[650px]",
        footer: "overflow-visible",
        body: "overflow-auto",
        header: "overflow-visible",
      }}>
      {stage === "first" && <Input />}
      {stage === "second" && <Summary />}
      {stage === "third" && <Moves />}
    </Card>
  );
}
export default RightPanel;
