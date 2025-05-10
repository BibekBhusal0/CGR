import { Select, SelectItem } from "@heroui/select";
import { Switch, } from "@heroui/switch";
import { useTheme } from "@heroui/use-theme";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "@/Logic/reducers/store";
import {
  allBoardThemes,
  boardThemes,
  setBoardTheme,
} from "@/Logic/reducers/settings";
import { base_path } from "../full_board/customBoard";
import ToggleSwitch, { switchClassNames } from "@/components/switch";

function getImageSource(theme: string, board_theme: string) {
  return `${base_path}${board_theme.toLowerCase()}/${theme === "dark" ? "w" : "b"}P.svg`;
}

function GeneralSettings() {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const { btheme } = useSelector((state: StateType) => state.settings);

  function changeTheme() {
    const not_theme = theme === "dark" ? "light" : "dark";
    setTheme(not_theme);
  }

  return (
    <>
      <Select
        selectedKeys={[btheme]}
        startContent={
          <img alt="select theme" className="h-auto w-8 pb-1" src={getImageSource(theme, btheme)} />
        }
        size="md"
        classNames={{
          label: "text-lg pl-2",
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
                className="h-auto w-9"
                src={getImageSource(theme, board_theme)}
                alt={`${board_theme} board_theme Pawn`}
              />
            }
            className="capitalize"
            classNames={{ base: "items-center", title: "text-sm" }}
            aria-label={board_theme}
            key={board_theme}>
            {board_theme}
          </SelectItem>
        ))}

      </Select>

      <Switch
        isSelected={theme === "dark"}
        onValueChange={changeTheme}
        classNames={switchClassNames}
        children="Dark Mode"
      />
      <ToggleSwitch item='highlight' children="Highlight Moves" />
      <ToggleSwitch item='animation' />

    </>
  );
}

export default GeneralSettings;
