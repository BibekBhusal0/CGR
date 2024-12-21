import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Select, SelectItem } from "@nextui-org/select";
import { Slider } from "@nextui-org/slider";
import { Switch } from "@nextui-org/switch";
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

function LeftPanel() {
  return (
    <div className="basis-3/12">
      <Accordion
        itemClasses={{ title: "text-2xl overflow-x-hidden", content: "mb-2" }}
        aria-label="left"
        variant="splitted"
        defaultExpandedKeys={["1", "2"]}
        selectionMode="multiple">
        <AccordionItem aria-label="Settings" title="General Settings " key="1">
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

  const titles = ["Dark Mode", "Highlight Move", "Animation"];
  const elem = [
    <Switch
      aria-label="dark mode"
      isSelected={theme === "dark"}
      onValueChange={changeTheme}
    />,
    <Switch
      isSelected={highlight}
      onValueChange={() => dispatch(toggleValues("highlight"))}
      aria-label="highlight move"
      defaultSelected
    />,
    <Switch
      isSelected={animation}
      onValueChange={() => dispatch(toggleValues("animation"))}
      aria-label="a"
      defaultSelected
    />,
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
        className="mb-4"
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
          <SelectItem aria-label={board_theme} key={board_theme}>
            <div className="flex gap-2 capitalize flex-row realtive text-lg items-center">
              <img
                className="w-14 h-auto"
                src={getImageSource(theme, board_theme)}
                alt={`${board_theme} board_theme Pawn`}
              />
              {board_theme}
            </div>
          </SelectItem>
        ))}
      </Select>
      {titles.map((title, index) => (
        <TwoElement title={title} key={title} Component={elem[index]} />
      ))}
    </>
  );
}
function StockfishSettings() {
  const titles = ["Show Best Moves"];
  const { depth, bestMove } = useSelector((state: StateType) => state.settings);
  const dispatch = useDispatch();

  const elem = [
    <Switch
      aria-label="Best Moves"
      isSelected={bestMove}
      onValueChange={() => dispatch(toggleValues("bestMove"))}
      defaultSelected
    />,
  ];

  return (
    <div>
      <Slider
        label={<h1 className="text-xl"> Depth </h1>}
        aria-label="depth"
        showTooltip
        className="pb-3 pr-3"
        minValue={10}
        value={depth}
        onChange={(e) => {
          if (typeof e === "number") dispatch(changeDepth(e));
        }}
        maxValue={30}
      />
      {titles.map((title, index) => (
        <TwoElement title={title} key={title} Component={elem[index]} />
      ))}
    </div>
  );
}

interface TwoElementProps {
  title: string;
  Component: any;
}
function TwoElement({ title, Component }: TwoElementProps) {
  const bt = typeof Component.type === "object" ? "border-t-1" : "";
  return (
    <div className={`grid p-2 grid-cols-4 border-gray-600 border-dotted ${bt}`}>
      <div className="col-span-3 text-xl ">{title}</div>
      <div className="col-span-1">{Component}</div>
    </div>
  );
}

function getImageSource(theme: any, board_theme: string) {
  return `https://raw.githubusercontent.com/BibekBhusal0/CGR/557306e3ad6b55c87def1d5ce01b4e6f2095542b/public/images/pieces/${board_theme.toLowerCase()}/${
    theme === "dark" ? "w" : "b"
  }P.svg`;
}

export default LeftPanel;
