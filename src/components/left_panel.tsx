import {
  Accordion,
  AccordionItem,
  Select,
  SelectItem,
  Slider,
  Switch,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { themes } from "../Logic/reducers";
import { useContext } from "react";
import { AppContext } from "../App";

function LeftPanel() {
  const heading_class = "text-2xl overflow-x-hidden";
  return (
    <div className="basis-3/12">
      <Accordion
        aria-label="left"
        variant="splitted"
        defaultExpandedKeys={["1", "2"]}
        selectionMode="multiple">
        <AccordionItem
          className="mb-2"
          aria-label="Settings"
          title={<h1 className={heading_class}> General Settings </h1>}
          key="1">
          <GeneralSettings />
        </AccordionItem>

        <AccordionItem
          aria-label="stockfish"
          title={<h1 className={heading_class}> Stockfish Settings</h1>}
          key="2">
          <StockfishSettings />
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function GeneralSettings() {
  const { theme, setTheme } = useTheme();
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "GeneralSettings must be used within an AppContext.Provider"
    );
  }

  const {
    state: { highlight, animation, btheme },
    dispatch,
  } = context;

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
      onValueChange={() => dispatch({ type: "ToggleHighlight" })}
      aria-label="highlight move"
      defaultSelected
    />,
    <Switch
      isSelected={animation}
      onValueChange={() => dispatch({ type: "ToggleAnimation" })}
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
            src={getImageSorce(theme, btheme)}
          />
        }
        className="mb-4 "
        size="lg"
        classNames={{
          label: "text-xl",
          trigger: "capitalize",
          listbox: "px-0",
        }}
        onChange={(e) => {
          if (e.target.value.trim() !== "") {
            dispatch({ type: "SetTheme", theme: e.target.value });
          }
        }}
        labelPlacement="outside-left"
        label="Board Theme">
        {themes.map((board_theme) => (
          <SelectItem aria-label={board_theme} key={board_theme}>
            <div className="flex gap-2 capitalize flex-row realtive text-lg items-center">
              <img
                className="w-14 h-auto"
                src={getImageSorce(theme, board_theme)}
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
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("SFSettings must be used within an AppContext.Provider");
  }

  const {
    state: { depth, bestMove },
    dispatch,
  } = context;

  const elem = [
    <Switch
      aria-label="Best Moves"
      isSelected={bestMove}
      onValueChange={() => dispatch({ type: "ToggleBestMove" })}
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
        onChange={(e) => dispatch({ type: "ChangeDepth", depth: e })}
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

function getImageSorce(theme: any, board_theme: string) {
  return `https://raw.githubusercontent.com/BibekBhusal0/CGR/557306e3ad6b55c87def1d5ce01b4e6f2095542b/public/images/pieces/${board_theme.toLowerCase()}/${
    theme === "dark" ? "w" : "b"
  }P.svg`;
}

export default LeftPanel;
