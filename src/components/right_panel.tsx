import { Card } from "@nextui-org/react";
import { Input } from "./input";
import { useContext } from "react";
import { AppContext } from "../App";
import Moves from "./moves";
import Summary from "./summary";

function RightPanel() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error();
  }
  const {
    state: { stage },
  } = context;
  return (
    <div className="px-2 relative basis-3/12 lg:basis-4/12">
      <Card
        classNames={{
          base: "max-h-[700px]",
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
