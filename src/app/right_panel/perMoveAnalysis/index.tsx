import { CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Controls } from "../moves/controls";
import { useSettingsState } from "@/Logic/state/settings";

export function PerMoveAnalysis() {
  const toggle = useSettingsState((state) => state.toggleValues);
  return (
    <>
      <CardHeader className="flex flex-col gap-2">
        <div className="text-md text-danger-800 bg-danger-200 rounded-md p-2">
          Note that per move analysis is not recommended unless you are inspecting every single
          move. Some settigs will not be applied here.
          <div>Red Arrow: Pin.</div>
          <div>Green Arrow: Best Move</div>
          <div>Green Highlight: Hanging piece.</div>
        </div>
        <Button onPress={() => toggle("analyzePerMove")}>Turn off Per move analysis</Button>
      </CardHeader>
      <CardBody>Per move detail will be here loading ....</CardBody>
      <CardFooter className="flex-center">
        <Controls />
      </CardFooter>
    </>
  );
}
