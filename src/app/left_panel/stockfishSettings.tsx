import { Slider } from "@heroui/slider";
import { ToggleSwitch } from "@/components/switch";
import {
  allStockfishAvailable,
  availableStockfish,
  useSettingsState,
} from "@/Logic/state/settings";
import { Select, SelectItem } from "@heroui/select";

function StockfishSettings() {
  const depth = useSettingsState((state) => state.depth);
  const changeDepth = useSettingsState((state) => state.changeDepth);
  const setStockfish = useSettingsState((state) => state.setStockfish);
  const stockfish = useSettingsState((state) => state.stockfish);

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
      <Select
        selectedKeys={[stockfish]}
        size="md"
        classNames={{
          label: "text-lg pl-2",
          trigger: "capitalize",
          listbox: "px-0",
        }}
        onChange={(e) => {
          if (e.target.value.trim() !== "") {
            const v = e.target.value.trim() as availableStockfish;
            if (!allStockfishAvailable.includes(v)) return;
            setStockfish(v);
          }
        }}
        labelPlacement="outside-left"
        label="Stockfish">
        {allStockfishAvailable.map((sf) => (
          <SelectItem
            className="capitalize"
            classNames={{ base: "items-center", title: "text-sm" }}
            aria-label={sf}
            key={sf}>
            {sf.replace(/-/g, " ")}
          </SelectItem>
        ))}
      </Select>
    </>
  );
}

export default StockfishSettings;
