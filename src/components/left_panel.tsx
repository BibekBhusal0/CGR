import {
  Accordion,
  AccordionItem,
  Select,
  SelectItem,
  Slider,
  Switch,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { FC } from "react";

function LeftPanel() {
  const heading_class = "text-2xl";
  return (
    <div className=" basis-3/12 pt-4">
      <Accordion
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
  function changeTheme() {
    const not_theme = theme === "dark" ? "light" : "dark";
    setTheme(not_theme);
  }

  const themes = ["wood", "glass", "nature"];
  const titles = ["Board Theme", "Dark Mode", "Highlight Move", "Arrows"];

  const BoardTheme: FC = () => (
    <Select
      defaultSelectedKeys={["wood"]}
      className="capitalize"
      aria-label="theme">
      {themes.map((theme) => (
        <SelectItem key={theme} className="capitalize ">
          {theme}
        </SelectItem>
      ))}
    </Select>
  );
  const elem = [
    <BoardTheme />,
    <Switch isSelected={theme === "dark"} onValueChange={changeTheme} />,
    <Switch defaultSelected />,
    <Switch defaultSelected />,
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
  const elem = [<Switch defaultSelected />, <Switch defaultSelected />];

  return (
    <div>
      <Slider
        label={<h1 className="text-xl "> Depth </h1>}
        className="pb-3"
        minValue={10}
        defaultValue={10}
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
