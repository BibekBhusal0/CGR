import { Card } from "@heroui/card";
import { Input } from "./input";
import Summary from "./summary";
import Moves from "./moves";
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
