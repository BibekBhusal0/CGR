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
        // label={"Depth"}
        aria-label="depth"
        // showTooltip
        minValue={10}
        // classNames={{ label: "text-lg" }}
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
      // selectedKeys={[stockfish]}
      // classNames={{
      //   label: "text-lg pl-2",
      //   trigger: "capitalize",
      //   listbox: "px-0",
      // }}
      // onChange={(e) => {
      //   if (e.target.value.trim() !== "") {
      //     const v = e.target.value.trim() as availableStockfish;
      //     if (!allStockfishAvailable.includes(v)) return;
      //     setStockfish(v);
      //   }
      // }}
      // labelPlacement="outside-left"
      // label="Stockfish"
      >
        <Label>Stockfish</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {allStockfishAvailable.map((sf) => (
              <ListBox.Item
                className="capitalize"
                // classNames={{ base: "items-center", title: "text-sm" }}
                aria-label={sf}
                key={sf}>
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
