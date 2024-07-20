import { Card } from "@nextui-org/react";
import { Input } from "./input";
import { useContext } from "react";
import { AppContext } from "../App";
import Moves from "./moves";

function RightPanel() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error();
  }
  const {
    state: { stage },
  } = context;
  return (
    <div className="basis-4/12 px-2 relative">
      <Card className="h-full ">
        {stage === "first" && <Input />}
        {stage === "second" && <Moves />}
      </Card>
    </div>
  );
}
export default RightPanel;
