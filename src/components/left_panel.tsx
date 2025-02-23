import { Accordion, AccordionItem } from "@heroui/accordion";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { Switch, SwitchProps } from "@heroui/switch";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "@/Logic/reducers/store";
import {
  allBoardThemes,
  boardThemes,
  toggleValues,
  setBoardTheme,
  changeDepth,
} from "@/Logic/reducers/settings";
import { base_path } from "./customBoard";

const switchClassNames = {
  base: "flex-row-reverse justify-between w-full max-w-full border-default-400 border-dotted border-t-2 pt-3 mt-3",
  label: "text-xl",
};
function LeftPanel() {
  return (
    <div className="basis-3/12">
      <Accordion
        itemClasses={{ title: "text-2xl overflow-x-hidden", content: "mb-2" }}
        aria-label="left"
        variant="splitted"
        defaultExpandedKeys={["1", "2"]}
        selectionMode="multiple">
        <AccordionItem aria-label="Settings" title="General Settings" key="1">
          <GeneralSettings />
        </AccordionItem>

        <AccordionItem
          aria-label="stockfish"
          title="Stockfish Settings"
          key="2">
          <StockfishSettings />
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function GeneralSettings() {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const { highlight, animation, btheme } = useSelector(
    (state: StateType) => state.settings
  );

  function changeTheme() {
    const not_theme = theme === "dark" ? "light" : "dark";
    setTheme(not_theme);
  }

  const switches: SwitchProps[] = [
    {
      isSelected: theme === "dark",
      onValueChange: changeTheme,
      children: "Dark Mode",
    },
    {
      isSelected: highlight,
      onValueChange: () => dispatch(toggleValues("highlight")),
      defaultSelected: true,
      children: "Highlight Move",
    },
    {
      isSelected: animation,
      onValueChange: () => dispatch(toggleValues("animation")),
      defaultSelected: true,
      children: "Animation",
    },
  ];
  return (
    <>
      <Select
        selectedKeys={[btheme]}
        startContent={
          <img
            alt="select theme"
            className="w-8 h-auto pb-1"
            src={getImageSource(theme, btheme)}
          />
        }
        size="lg"
        classNames={{
          label: "text-xl",
          trigger: "capitalize",
          listbox: "px-0",
        }}
        onChange={(e) => {
          if (e.target.value.trim() !== "") {
            const v = e.target.value.trim() as boardThemes;
            dispatch(setBoardTheme(v));
          }
        }}
        labelPlacement="outside-left"
        label="Board Theme">
        {allBoardThemes.map((board_theme) => (
          <SelectItem
            startContent={
              <img
                className="w-10 h-auto"
                src={getImageSource(theme, board_theme)}
                alt={`${board_theme} board_theme Pawn`}
              />
            }
            className="capitalize"
            classNames={{ base: "items-center", title: "text-xl" }}
            aria-label={board_theme}
            key={board_theme}>
            {board_theme}
          </SelectItem>
        ))}
      </Select>
      {switches.map((props, i) => (
        <Switch key={i} classNames={switchClassNames} {...props} />
      ))}
    </>
  );
}
function StockfishSettings() {
  const { depth, bestMove } = useSelector((state: StateType) => state.settings);
  const dispatch = useDispatch();

  return (
    <>
      <Slider
        label={<h1 className="text-xl"> Depth </h1>}
        aria-label="depth"
        showTooltip
        minValue={10}
        value={depth}
        onChange={(e) => {
          if (typeof e === "number") dispatch(changeDepth(e));
        }}
        maxValue={30}
      />
      <Switch
        classNames={switchClassNames}
        aria-label="Best Moves"
        isSelected={bestMove}
        onValueChange={() => dispatch(toggleValues("bestMove"))}
        defaultSelected
        children="Best Move"
      />
    </>
  );
}

function getImageSource(theme: any, board_theme: string) {
  return `${base_path}${board_theme.toLowerCase()}/${
    theme === "dark" ? "w" : "b"
  }P.svg`;
}

export default LeftPanel;
