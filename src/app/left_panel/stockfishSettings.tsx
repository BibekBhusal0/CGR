import { Slider } from "@heroui/slider";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "@/Logic/state/store";
import { changeDepth } from "@/Logic/state/settings";
import { ToggleSwitch } from "@/components/switch";

function StockfishSettings() {
  const { depth } = useSelector((state: StateType) => state.settings);
  const dispatch = useDispatch();

  return (
    <>
      <Slider
        label={"Depth"}
        aria-label="depth"
        showTooltip
        minValue={10}
        classNames={{ label: "text-lg" }}
        value={depth}
        onChange={(e) => {
          if (typeof e === "number") dispatch(changeDepth(e));
        }}
        maxValue={30}
      />
      <ToggleSwitch item="bestMove" children="Best Move" />
      <ToggleSwitch item="localStockfish" children="Always use local Stockfish" />
    </>
  );
}

export default StockfishSettings;
