import { Card, Chip } from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";

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
    <div className="basis-4/12 px-2 h-3/4 relative">
      <Card className=" px-3 ">
        <Chip size="lg" color="primary" className="px-8 py-8 mt-6 mb-12">
          <div className="flex gap-4 text-center text-3xl font-semibold">
            <IoSearch /> Chess Game Review
          </div>
        </Chip>
        {stage === "first" && <Input />}
        {stage === "second" && <Moves />}
      </Card>
    </div>
  );
}

export default RightPanel;
