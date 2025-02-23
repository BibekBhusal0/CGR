import { Card } from "@nextui-org/card";
import { Input } from "./input";
import Moves from "./moves";
import Summary from "./summary";
import { useSelector } from "react-redux";
import { StateType } from "@/Logic/reducers/store";

function RightPanel() {
  const { stage } = useSelector((state: StateType) => state.game);

  return (
    <div className="px-2 relative basis-3/12 lg:basis-4/12">
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
