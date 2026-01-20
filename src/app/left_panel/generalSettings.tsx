import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { useTheme } from "@heroui/use-theme";
import {
  allBoardThemes,
  allNotationStyles,
  boardThemes,
  notationStyle,
  useSettingsState,
} from "@/Logic/state/settings";
import { base_path } from "@/app/full_board/customBoard";
import { ToggleSwitch } from "@/components/switch";
import { switchClassNames } from "@/components/switch_types";

function getImageSource(theme: string, board_theme: string) {
  return `${base_path}${board_theme.toLowerCase()}/${theme === "dark" ? "w" : "b"}P.svg`;
}

function GeneralSettings() {
  const { theme, setTheme } = useTheme();
  const btheme = useSettingsState((state) => state.btheme);
  const setBoardTheme = useSettingsState((state) => state.setBoardTheme);
  const setNotationStyle = useSettingsState((state) => state.setNotationStyle);
  const notationStyle = useSettingsState((state) => state.notationStyle);

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
            setBoardTheme(v);
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
      <Select
        selectedKeys={[notationStyle]}
        size="md"
        classNames={{
          label: "text-lg pl-2",
          trigger: "capitalize",
          listbox: "px-0",
        }}
        onChange={(e) => {
          if (e.target.value.trim() !== "") {
            const v = e.target.value.trim() as notationStyle;
            setNotationStyle(v);
          }
        }}
        labelPlacement="outside-left"
        label="Notation">
        {allNotationStyles.map((notation) => (
          <SelectItem
            className="capitalize"
            classNames={{ base: "items-center", title: "text-sm" }}
            aria-label={notation}
            key={notation}>
            {notation}
          </SelectItem>
        ))}
      </Select>

      <Switch
        isSelected={theme === "dark"}
        onValueChange={changeTheme}
        classNames={switchClassNames}
        children="Dark Mode"
      />
      <ToggleSwitch item="highlight" children="Highlight Moves" />
      <ToggleSwitch item="animation" />
      <ToggleSwitch item="devMode" children="Dev Mode" />
    </>
  );
}

export default GeneralSettings;
