import {
  Accordion,
  AccordionItem,
  Select,
  SelectItem,
  Slider,
  Switch,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { themes } from "../reducers";
import { FC, useContext } from "react";
import { AppContext } from "../App";

function LeftPanel() {
  const heading_class = "text-2xl";
  return (
    <div className=" basis-3/12 pt-4">
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
    state: { highlight, arrows, btheme },
    dispatch,
  } = context;

  function changeTheme() {
    const not_theme = theme === "dark" ? "light" : "dark";
    setTheme(not_theme);
  }

  const titles = ["Board Theme", "Dark Mode", "Highlight Move", "Arrows"];

  const BoardTheme: FC = () => (
    <Select
      selectedKeys={[btheme]}
      className="capitalize"
      onChange={(e) => dispatch({ type: "SetTheme", theme: e.target.value })}
      aria-label="themes">
      {themes.map((theme) => (
        <SelectItem aria-label={theme} key={theme} className="capitalize ">
          {theme}
        </SelectItem>
      ))}
    </Select>
  );
  const elem = [
    <BoardTheme />,
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
      isSelected={arrows}
      onValueChange={() => dispatch({ type: "ToggleArrows" })}
      aria-label="a"
      defaultSelected
    />,
  ];
  return (
    <div>
      {titles.map((title, index) => (
        <TwoElement title={title} key={title} Component={elem[index]} />
      ))}
    </div>
  );
}
function StockfishSettings() {
  const titles = ["Evaluation Bar", "Lines"];
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "GeneralSettings must be used within an AppContext.Provider"
    );
  }

  const {
    state: { depth, evalbar, lines },
    dispatch,
  } = context;

  const elem = [
    <Switch
      aria-label="evalbar"
      isSelected={evalbar}
      onValueChange={() => dispatch({ type: "ToggleEvalbar" })}
      defaultSelected
    />,
    <Switch
      aria-label="lines"
      isSelected={lines}
      onValueChange={() => dispatch({ type: "ToggleLines" })}
      defaultSelected
    />,
  ];

  return (
    <div>
      <Slider
        label={<h1 className="text-xl "> Depth </h1>}
        aria-label="depth"
        className="pb-3"
        minValue={10}
        value={depth}
        onChange={(e) => dispatch({ type: "ChangeDepth", n: e })}
        maxValue={20}
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
    <div
      className={` grid pl-2 grid-cols-5 py-2 border-gray-600 border-dotted ${bt}`}>
      <div className=" col-span-3 text-xl ">{title}</div>
      <div className="col-span-2">{Component}</div>
    </div>
  );
}

export default LeftPanel;
