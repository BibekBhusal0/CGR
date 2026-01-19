import { Card } from "@heroui/card";
import { Input } from "./input";
import Summary from "./summary";
import { useSelector } from "react-redux";
import { StateType } from "@/Logic/state/store";
import Moves from "./moves";

function RightPanel() {
  const { stage } = useSelector((state: StateType) => state.game);

  return (
    <div className="relative basis-3/12 px-2 lg:basis-4/12">
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
    </div>
  );
}
export default RightPanel;
