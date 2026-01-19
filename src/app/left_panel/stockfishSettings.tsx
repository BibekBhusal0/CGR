import { Slider } from "@heroui/slider";
import { ToggleSwitch } from "@/components/switch";
import { useSettingsState } from "@/Logic/state/settings";

function StockfishSettings() {
  const depth = useSettingsState((state) => state.depth);
  const changeDepth = useSettingsState((state) => state.changeDepth);

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
          if (typeof e === "number") changeDepth(e);
        }}
        maxValue={30}
      />
      <ToggleSwitch item="bestMove" children="Best Move" />
      <ToggleSwitch item="localStockfish" children="Always use local Stockfish" />
    </>
  );
}

export default StockfishSettings;
