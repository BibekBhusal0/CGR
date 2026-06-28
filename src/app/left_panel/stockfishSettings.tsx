import { Slider, Select, Label, ListBox } from "@heroui/react";
import { ToggleSwitch } from "@/components/switch";
import {
  allStockfishAvailable,
  availableStockfish,
  useSettingsState,
} from "@/Logic/state/settings";

function StockfishSettings() {
  const depth = useSettingsState((state) => state.depth);
  const changeDepth = useSettingsState((state) => state.changeDepth);
  const setStockfish = useSettingsState((state) => state.setStockfish);
  const stockfish = useSettingsState((state) => state.stockfish);

  return (
    <>
      <Slider
        aria-label="depth"
        minValue={10}
        value={depth}
        onChange={(e) => {
          if (typeof e === "number") changeDepth(e);
        }}
        maxValue={30}>
        <Label>Depth</Label>
        <Slider.Output />
        <Slider.Track>
          <Slider.Fill />
          <Slider.Thumb />
        </Slider.Track>
      </Slider>
      <ToggleSwitch item="bestMove" children="Best Move" />
      <Select
        value={stockfish}
        variant="secondary"
        onChange={(e) => {
          if (e !== "") {
            const v = e as availableStockfish;
            if (!allStockfishAvailable.includes(v)) return;
            setStockfish(v);
          }
        }}>
        <Label>Stockfish</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {allStockfishAvailable.map((sf) => (
              <ListBox.Item className="capitalize" aria-label={sf} id={sf} key={sf}>
                {sf.replace(/-/g, " ")}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </>
  );
}

export default StockfishSettings;
